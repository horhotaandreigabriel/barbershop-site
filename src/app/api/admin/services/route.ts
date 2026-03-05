import { NextRequest, NextResponse } from "next/server";
import { createService, listServicesForAdmin } from "@/lib/services";
import { isAdminRequest } from "@/lib/admin-auth";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const services = await listServicesForAdmin();
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  try {
    const service = await createService(body ?? {});
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut salva serviciul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
