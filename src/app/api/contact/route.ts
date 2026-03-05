import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/contact-messages";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  try {
    await createContactMessage(body ?? {});
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut trimite mesajul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
