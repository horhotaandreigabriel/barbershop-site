import { getAdminDb } from "@/lib/firebase-admin";

const COLLECTION = "contactMessages";

const restProjectId = process.env.FIREBASE_PROJECT_ID;
const restApiKey = process.env.FIREBASE_WEB_API_KEY;

const hasFirestoreRestConfig = Boolean(restProjectId && restApiKey);

const getRestCollectionUrl = () => {
  if (!restProjectId || !restApiKey) {
    return null;
  }

  return `https://firestore.googleapis.com/v1/projects/${restProjectId}/databases/(default)/documents/${COLLECTION}`;
};

const getRestDocumentUrl = (id: string) => {
  const collectionUrl = getRestCollectionUrl();
  if (!collectionUrl || !restApiKey) {
    return null;
  }

  return `${collectionUrl}/${encodeURIComponent(id)}?key=${restApiKey}`;
};

export type ContactMessageStatus = "new" | "in_progress" | "resolved";

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
};

type ContactMessageInput = {
  name: string;
  phone: string;
  message: string;
};

const normalize = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const parseStatus = (value: unknown): ContactMessageStatus => {
  if (value === "in_progress" || value === "resolved") {
    return value;
  }

  return "new";
};

const validateInput = (payload: Partial<ContactMessageInput>) => {
  const name = normalize(payload.name);
  const phone = normalize(payload.phone);
  const message = normalize(payload.message);

  if (!name || !phone || !message) {
    throw new Error("Completeaza nume, telefon si mesaj.");
  }

  return { name, phone, message };
};

const getStringField = (fields: Record<string, unknown>, key: string) => {
  const field = fields[key] as { stringValue?: string } | undefined;
  return field?.stringValue ?? "";
};

const mapRestDoc = (doc: { name?: string; fields?: Record<string, unknown> }): ContactMessage | null => {
  const id = doc.name?.split("/").pop();
  const fields = doc.fields;

  if (!id || !fields) {
    return null;
  }

  return {
    id,
    name: getStringField(fields, "name"),
    phone: getStringField(fields, "phone"),
    message: getStringField(fields, "message"),
    status: parseStatus(getStringField(fields, "status")),
    createdAt: getStringField(fields, "createdAt"),
    updatedAt: getStringField(fields, "updatedAt"),
  };
};

const toFirestoreFields = (message: Omit<ContactMessage, "id">) => ({
  name: { stringValue: message.name },
  phone: { stringValue: message.phone },
  message: { stringValue: message.message },
  status: { stringValue: message.status },
  createdAt: { stringValue: message.createdAt },
  updatedAt: { stringValue: message.updatedAt },
});

const sortByCreatedAtDesc = (messages: ContactMessage[]) =>
  messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const createContactMessage = async (payload: Partial<ContactMessageInput>) => {
  const parsed = validateInput(payload);
  const now = new Date().toISOString();
  const data = {
    ...parsed,
    status: "new" as ContactMessageStatus,
    createdAt: now,
    updatedAt: now,
  };

  const db = getAdminDb();
  if (db) {
    const ref = await db.collection(COLLECTION).add(data);
    return { id: ref.id, ...data };
  }

  if (hasFirestoreRestConfig) {
    const collectionUrl = getRestCollectionUrl();
    if (!collectionUrl || !restApiKey) {
      throw new Error("Firebase nu este configurat.");
    }

    const response = await fetch(`${collectionUrl}?key=${restApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    });

    if (!response.ok) {
      throw new Error("Nu am putut salva mesajul.");
    }

    const body = (await response.json()) as { name?: string };
    const id = body.name?.split("/").pop();
    if (!id) {
      throw new Error("Nu am putut salva mesajul.");
    }

    return { id, ...data };
  }

  throw new Error("Firebase nu este configurat.");
};

export const listContactMessages = async (): Promise<ContactMessage[]> => {
  const db = getAdminDb();
  if (db) {
    const snapshot = await db.collection(COLLECTION).get();
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<ContactMessage>;
      return {
        id: doc.id,
        name: normalize(data.name),
        phone: normalize(data.phone),
        message: normalize(data.message),
        status: parseStatus(data.status),
        createdAt: normalize(data.createdAt),
        updatedAt: normalize(data.updatedAt),
      };
    });

    return sortByCreatedAtDesc(messages);
  }

  if (hasFirestoreRestConfig) {
    const collectionUrl = getRestCollectionUrl();
    if (!collectionUrl || !restApiKey) {
      return [];
    }

    const response = await fetch(`${collectionUrl}?key=${restApiKey}`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const body = (await response.json()) as {
      documents?: Array<{ name?: string; fields?: Record<string, unknown> }>;
    };
    const messages = (body.documents ?? [])
      .map((doc) => mapRestDoc(doc))
      .filter((item): item is ContactMessage => item !== null);

    return sortByCreatedAtDesc(messages);
  }

  return [];
};

export const updateContactMessageStatus = async (id: string, status: ContactMessageStatus) => {
  const nextStatus = parseStatus(status);
  const now = new Date().toISOString();

  const db = getAdminDb();
  if (db) {
    await db.collection(COLLECTION).doc(id).set({ status: nextStatus, updatedAt: now }, { merge: true });
    return;
  }

  if (hasFirestoreRestConfig) {
    const documentUrl = getRestDocumentUrl(id);
    if (!documentUrl) {
      throw new Error("Firebase nu este configurat.");
    }

    const response = await fetch(documentUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        fields: {
          status: { stringValue: nextStatus },
          updatedAt: { stringValue: now },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Nu am putut actualiza statusul.");
    }
    return;
  }

  throw new Error("Firebase nu este configurat.");
};
