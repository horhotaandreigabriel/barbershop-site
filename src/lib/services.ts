import type { Service } from "@/data/site-data";
import { siteData } from "@/data/site-data";
import { getAdminDb } from "@/lib/firebase-admin";

export type AdminService = Service & { id: string };

const SERVICES_COLLECTION = "services";

const restProjectId = process.env.FIREBASE_PROJECT_ID;
const restApiKey = process.env.FIREBASE_WEB_API_KEY;

const hasFirestoreRestConfig = Boolean(restProjectId && restApiKey);

const getRestCollectionUrl = () => {
  if (!restProjectId || !restApiKey) {
    return null;
  }

  return `https://firestore.googleapis.com/v1/projects/${restProjectId}/databases/(default)/documents/${SERVICES_COLLECTION}`;
};

const getRestDocumentUrl = (id: string) => {
  const collectionUrl = getRestCollectionUrl();
  if (!collectionUrl || !restApiKey) {
    return null;
  }

  return `${collectionUrl}/${encodeURIComponent(id)}?key=${restApiKey}`;
};

export type ServiceInput = {
  name: string;
  slug?: string;
  duration: string;
  price: string;
  description: string;
  longDescription: string;
  recommendedFor: string;
  includes: string[];
};

const cleanString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const cleanIncludes = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const toService = (input: Partial<ServiceInput>) => {
  const service = {
    name: cleanString(input.name),
    slug: cleanString(input.slug),
    duration: cleanString(input.duration),
    price: cleanString(input.price),
    description: cleanString(input.description),
    longDescription: cleanString(input.longDescription),
    recommendedFor: cleanString(input.recommendedFor),
    includes: cleanIncludes(input.includes),
  };

  if (
    !service.name ||
    !service.duration ||
    !service.price ||
    !service.description ||
    !service.longDescription ||
    !service.recommendedFor ||
    !service.includes.length
  ) {
    throw new Error("Date invalide. Completeaza toate campurile.");
  }

  return service;
};

const removeDiacritics = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const slugify = (value: string) =>
  removeDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapServiceDoc = (id: string, data: Partial<ServiceInput>): AdminService => {
  const parsed = toService(data);

  return {
    id,
    ...parsed,
    slug: parsed.slug || slugify(parsed.name),
  };
};

const getStringField = (fields: Record<string, unknown>, key: string) => {
  const field = fields[key] as { stringValue?: string } | undefined;
  return field?.stringValue ?? "";
};

const getArrayStringField = (fields: Record<string, unknown>, key: string) => {
  const field = fields[key] as
    | {
        arrayValue?: {
          values?: Array<{ stringValue?: string }>;
        };
      }
    | undefined;

  return (field?.arrayValue?.values ?? [])
    .map((value) => value.stringValue ?? "")
    .filter(Boolean);
};

const mapRestDoc = (doc: { name?: string; fields?: Record<string, unknown> }): AdminService | null => {
  const id = doc.name?.split("/").pop();
  const fields = doc.fields;

  if (!id || !fields) {
    return null;
  }

  try {
    return mapServiceDoc(id, {
      slug: getStringField(fields, "slug"),
      name: getStringField(fields, "name"),
      duration: getStringField(fields, "duration"),
      price: getStringField(fields, "price"),
      description: getStringField(fields, "description"),
      longDescription: getStringField(fields, "longDescription"),
      recommendedFor: getStringField(fields, "recommendedFor"),
      includes: getArrayStringField(fields, "includes"),
    });
  } catch {
    return null;
  }
};

const toFirestoreFields = (service: ServiceInput) => ({
  slug: { stringValue: service.slug ?? "" },
  name: { stringValue: service.name },
  duration: { stringValue: service.duration },
  price: { stringValue: service.price },
  description: { stringValue: service.description },
  longDescription: { stringValue: service.longDescription },
  recommendedFor: { stringValue: service.recommendedFor },
  includes: {
    arrayValue: {
      values: service.includes.map((item) => ({ stringValue: item })),
    },
  },
});

const listServicesFromRest = async (): Promise<AdminService[]> => {
  const collectionUrl = getRestCollectionUrl();
  if (!collectionUrl || !restApiKey) {
    return [];
  }

  const response = await fetch(`${collectionUrl}?key=${restApiKey}`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    documents?: Array<{ name?: string; fields?: Record<string, unknown> }>;
  };

  return (data.documents ?? [])
    .map((doc) => mapRestDoc(doc))
    .filter((service): service is AdminService => service !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "ro"));
};

const upsertServiceWithRest = async (id: string, service: ServiceInput) => {
  const documentUrl = getRestDocumentUrl(id);
  if (!documentUrl) {
    throw new Error("Firebase nu este configurat.");
  }

  const response = await fetch(documentUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ fields: toFirestoreFields(service) }),
  });

  if (!response.ok) {
    throw new Error("Nu am putut salva serviciul in Firestore.");
  }

  return { id, ...service };
};

const deleteServiceWithRest = async (id: string) => {
  const documentUrl = getRestDocumentUrl(id);
  if (!documentUrl) {
    throw new Error("Firebase nu este configurat.");
  }

  const response = await fetch(documentUrl, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nu am putut sterge serviciul din Firestore.");
  }
};

const getUniqueSlug = async (requestedSlug: string, excludeId?: string) => {
  const db = getAdminDb();
  if (db) {
    let candidate = requestedSlug;
    let suffix = 2;

    while (true) {
      const collision = await db
        .collection(SERVICES_COLLECTION)
        .where("slug", "==", candidate)
        .limit(1)
        .get();

      if (collision.empty || collision.docs[0].id === excludeId) {
        return candidate;
      }

      candidate = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }
  }

  if (hasFirestoreRestConfig) {
    const services = await listServicesFromRest();
    let candidate = requestedSlug;
    let suffix = 2;

    while (services.some((service) => service.slug === candidate && service.id !== excludeId)) {
      candidate = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  return requestedSlug;
};

export const getPublicServices = async () => {
  const db = getAdminDb();
  if (db) {
    try {
      const snapshot = await db.collection(SERVICES_COLLECTION).get();
      const services = snapshot.docs
        .map((doc) => mapServiceDoc(doc.id, doc.data()))
        .sort((a, b) => a.name.localeCompare(b.name, "ro"));

      return services.length ? services : siteData.services;
    } catch {
      return siteData.services;
    }
  }

  if (hasFirestoreRestConfig) {
    const restServices = await listServicesFromRest();
    return restServices.length ? restServices : siteData.services;
  }

  return siteData.services;
};

export const getPublicServiceBySlug = async (slug: string) => {
  const services = await getPublicServices();
  return services.find((service) => service.slug === slug) ?? null;
};

export const listServicesForAdmin = async (): Promise<AdminService[]> => {
  const db = getAdminDb();
  if (db) {
    const snapshot = await db.collection(SERVICES_COLLECTION).get();
    return snapshot.docs
      .map((doc) => mapServiceDoc(doc.id, doc.data()))
      .sort((a, b) => a.name.localeCompare(b.name, "ro"));
  }

  if (hasFirestoreRestConfig) {
    return listServicesFromRest();
  }

  return [];
};

export const createService = async (payload: Partial<ServiceInput>) => {
  const parsed = toService(payload);
  const baseSlug = slugify(parsed.slug || parsed.name);
  const uniqueSlug = await getUniqueSlug(baseSlug);

  const data: ServiceInput = {
    ...parsed,
    slug: uniqueSlug,
  };

  const db = getAdminDb();
  if (db) {
    const ref = await db.collection(SERVICES_COLLECTION).add(data);
    return { id: ref.id, ...data };
  }

  if (hasFirestoreRestConfig) {
    return upsertServiceWithRest(uniqueSlug, data);
  }

  throw new Error("Firebase nu este configurat.");
};

export const updateService = async (id: string, payload: Partial<ServiceInput>) => {
  const parsed = toService(payload);
  const baseSlug = slugify(parsed.slug || parsed.name);
  const uniqueSlug = await getUniqueSlug(baseSlug, id);

  const data: ServiceInput = {
    ...parsed,
    slug: uniqueSlug,
  };

  const db = getAdminDb();
  if (db) {
    await db.collection(SERVICES_COLLECTION).doc(id).set(data, { merge: true });
    return { id, ...data };
  }

  if (hasFirestoreRestConfig) {
    return upsertServiceWithRest(id, data);
  }

  throw new Error("Firebase nu este configurat.");
};

export const deleteService = async (id: string) => {
  const db = getAdminDb();
  if (db) {
    await db.collection(SERVICES_COLLECTION).doc(id).delete();
    return;
  }

  if (hasFirestoreRestConfig) {
    await deleteServiceWithRest(id);
    return;
  }

  throw new Error("Firebase nu este configurat.");
};
