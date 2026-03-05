import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateContactMessageStatus } from "@/lib/contact-messages";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  const { id } = await context.params;

  try {
    await updateContactMessageStatus(id, status as "new" | "in_progress" | "resolved");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut actualiza statusul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
