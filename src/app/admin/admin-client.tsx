"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminService, ServiceInput } from "@/lib/services";
import type { ContactMessage, ContactMessageStatus } from "@/lib/contact-messages";

type AdminClientProps = {
  initialAuthenticated: boolean;
  firebaseReady: boolean;
};

type ServiceFormState = {
  name: string;
  slug: string;
  duration: string;
  price: string;
  description: string;
  longDescription: string;
  recommendedFor: string;
  includesText: string;
};

const emptyForm: ServiceFormState = {
  name: "",
  slug: "",
  duration: "",
  price: "",
  description: "",
  longDescription: "",
  recommendedFor: "",
  includesText: "",
};

const toPayload = (form: ServiceFormState): ServiceInput => ({
  name: form.name,
  slug: form.slug || undefined,
  duration: form.duration,
  price: form.price,
  description: form.description,
  longDescription: form.longDescription,
  recommendedFor: form.recommendedFor,
  includes: form.includesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
});

const formFromService = (service: AdminService): ServiceFormState => ({
  name: service.name,
  slug: service.slug,
  duration: service.duration,
  price: service.price,
  description: service.description,
  longDescription: service.longDescription,
  recommendedFor: service.recommendedFor,
  includesText: service.includes.join("\n"),
});

export default function AdminClient({ initialAuthenticated, firebaseReady }: AdminClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<AdminService[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);

  const formTitle = useMemo(
    () => (editingId ? "Editeaza serviciu" : "Adauga serviciu"),
    [editingId],
  );

  const loadServices = async () => {
    const response = await fetch("/api/admin/services", { cache: "no-store" });
    if (response.status === 401) {
      setIsAuthenticated(false);
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Nu am putut incarca serviciile.");
    }

    setServices(data.services ?? []);
  };

  const loadMessages = async () => {
    const response = await fetch("/api/admin/messages", { cache: "no-store" });
    if (response.status === 401) {
      setIsAuthenticated(false);
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Nu am putut incarca mesajele.");
    }

    setMessages(data.messages ?? []);
  };

  useEffect(() => {
    if (!isAuthenticated || !firebaseReady) {
      return;
    }

    Promise.all([loadServices(), loadMessages()]).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Eroare la incarcare.");
    });
  }, [isAuthenticated, firebaseReady]);

  const updateForm = (key: keyof ServiceFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Autentificare esuata.");
      }

      setPassword("");
      setIsAuthenticated(true);
      await Promise.all([loadServices(), loadMessages()]);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Autentificare esuata.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setServices([]);
    setMessages([]);
    resetForm();
  };

  const submitService = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = toPayload(form);
    const endpoint = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Nu am putut salva serviciul.");
      }

      resetForm();
      await loadServices();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nu am putut salva.");
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: ContactMessageStatus) => {
    setStatusUpdatingId(messageId);
    setError("");
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Nu am putut actualiza statusul.");
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? { ...message, status, updatedAt: new Date().toISOString() } : message,
        ),
      );
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Nu am putut actualiza statusul.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) {
      return "-";
    }
    return new Date(iso).toLocaleString("ro-RO");
  };

  const statusLabel: Record<ContactMessageStatus, string> = {
    new: "Nou",
    in_progress: "In lucru",
    resolved: "Rezolvat",
  };

  const editService = (service: AdminService) => {
    setEditingId(service.id);
    setForm(formFromService(service));
  };

  const removeService = async (serviceId: string) => {
    const confirmed = window.confirm("Sigur vrei sa stergi acest serviciu?");
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Nu am putut sterge serviciul.");
      }

      if (editingId === serviceId) {
        resetForm();
      }
      await loadServices();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Nu am putut sterge.");
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseReady) {
    return (
      <section className="rounded-3xl border border-line bg-surface p-6">
        <h1 className="font-heading text-5xl uppercase tracking-[0.06em]">Mini Admin</h1>
        <p className="mt-4 text-sm text-foreground/80">
          Firebase nu este configurat. Adauga variabilele din README, apoi refresh.
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-6">
        <h1 className="font-heading text-5xl uppercase tracking-[0.06em]">Mini Admin</h1>
        <p className="mt-3 text-sm text-foreground/80">Autentificare cu parola de admin.</p>
        <form className="mt-6 space-y-3" onSubmit={login}>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Parola"
            className="w-full rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-accent bg-accent px-5 py-3 text-xs font-bold tracking-[0.14em] text-black transition hover:bg-transparent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "SE VERIFICA..." : "INTRA"}
          </button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-5xl uppercase tracking-[0.06em]">Mini Admin</h1>
          <p className="mt-2 text-sm text-foreground/80">
            Administrezi serviciile din Firestore, iar site-ul public le va citi dinamic.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.12em] text-muted transition hover:border-accent hover:text-accent"
        >
          Logout
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <form onSubmit={submitService} className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="font-heading text-3xl uppercase tracking-[0.05em]">{formTitle}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Nume" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Slug (optional)" value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} />
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Durata (ex: 45 min)" value={form.duration} onChange={(event) => updateForm("duration", event.target.value)} />
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Pret (ex: 95 RON)" value={form.price} onChange={(event) => updateForm("price", event.target.value)} />
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Descriere scurta" value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
            <textarea className="w-full rounded-xl border border-line bg-background px-3 py-2" rows={4} placeholder="Descriere lunga" value={form.longDescription} onChange={(event) => updateForm("longDescription", event.target.value)} />
            <input className="w-full rounded-xl border border-line bg-background px-3 py-2" placeholder="Recomandat pentru" value={form.recommendedFor} onChange={(event) => updateForm("recommendedFor", event.target.value)} />
            <textarea className="w-full rounded-xl border border-line bg-background px-3 py-2" rows={4} placeholder={"Ce include (cate un rand)\nConsultanta\nTuns\nStyling"} value={form.includesText} onChange={(event) => updateForm("includesText", event.target.value)} />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full border border-accent bg-accent px-4 py-2 text-xs font-bold tracking-[0.12em] text-black transition hover:bg-transparent hover:text-accent disabled:opacity-60"
            >
              {loading ? "SE SALVEAZA..." : editingId ? "ACTUALIZEAZA" : "ADAUGA"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.12em] text-muted"
              >
                ANULEAZA
              </button>
            ) : null}
          </div>
        </form>

        <div className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="font-heading text-3xl uppercase tracking-[0.05em]">Servicii existente</h2>
          <div className="mt-4 space-y-3">
            {services.map((service) => (
              <article key={service.id} className="rounded-2xl border border-line bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-xs text-muted">
                      /{service.slug} • {service.price} • {service.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editService(service)} className="rounded-full border border-line px-3 py-1 text-xs">
                      Edit
                    </button>
                    <button type="button" onClick={() => removeService(service.id)} className="rounded-full border border-red-700 px-3 py-1 text-xs text-red-300">
                      Sterge
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!services.length ? <p className="text-sm text-muted">Nu exista servicii in Firestore.</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-3xl uppercase tracking-[0.05em]">Mesaje contact</h2>
          <button
            type="button"
            onClick={() => loadMessages().catch(() => setError("Nu am putut reincarca mesajele."))}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.12em] text-muted transition hover:border-accent hover:text-accent"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-line bg-background/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{message.name}</p>
                  <p className="text-xs text-muted">{message.phone}</p>
                  <p className="mt-2 text-sm text-foreground/85">{message.message}</p>
                  <p className="mt-2 text-xs text-muted">Primit: {formatDate(message.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`status-${message.id}`} className="text-xs text-muted">
                    Status
                  </label>
                  <select
                    id={`status-${message.id}`}
                    value={message.status}
                    disabled={statusUpdatingId === message.id}
                    onChange={(event) =>
                      updateMessageStatus(message.id, event.target.value as ContactMessageStatus)
                    }
                    className="rounded-xl border border-line bg-background px-3 py-2 text-xs"
                  >
                    <option value="new">{statusLabel.new}</option>
                    <option value="in_progress">{statusLabel.in_progress}</option>
                    <option value="resolved">{statusLabel.resolved}</option>
                  </select>
                </div>
              </div>
            </article>
          ))}
          {!messages.length ? <p className="text-sm text-muted">Nu exista mesaje de contact.</p> : null}
        </div>
      </div>
    </section>
  );
}
