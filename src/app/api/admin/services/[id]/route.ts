import { NextRequest, NextResponse } from "next/server";
import { deleteService, updateService } from "@/lib/services";
import { isAdminRequest } from "@/lib/admin-auth";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  try {
    const service = await updateService(id, body ?? {});
    return NextResponse.json({ service });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut actualiza serviciul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const { id } = await context.params;
  try {
    await deleteService(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut sterge serviciul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
