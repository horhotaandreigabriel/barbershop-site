"use client";

import { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Nu am putut trimite mesajul.");
      }

      setForm(initialForm);
      setSuccess("Mesajul a fost trimis. Revenim rapid cu un apel.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nu am putut trimite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rounded-3xl border border-line bg-surface p-6" onSubmit={onSubmit}>
      <p className="text-sm text-foreground/80">Trimite un mesaj rapid:</p>
      <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="contact-name">
        Nume
      </label>
      <input
        id="contact-name"
        type="text"
        value={form.name}
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Nume complet"
        className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
      />
      <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="contact-phone">
        Telefon
      </label>
      <input
        id="contact-phone"
        type="tel"
        value={form.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        placeholder="07xx xxx xxx"
        className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
      />
      <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="contact-message">
        Mesaj
      </label>
      <textarea
        id="contact-message"
        value={form.message}
        onChange={(event) => updateField("message", event.target.value)}
        placeholder="Spune-ne ce serviciu doresti."
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full border border-accent bg-accent px-6 py-3 text-sm font-extrabold tracking-[0.14em] text-black transition hover:bg-transparent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "SE TRIMITE..." : "TRIMITE"}
      </button>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-emerald-400">{success}</p> : null}
    </form>
  );
}
