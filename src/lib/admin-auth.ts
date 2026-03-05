import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

const getSessionSecret = () => process.env.ADMIN_SESSION_SECRET ?? "";

const signPayload = (payload: string) => {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
};

const safeCompare = (a: string, b: string) => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const validateAdminPassword = (password: string) => {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) {
    return false;
  }

  return safeCompare(password, expected);
};

export const createAdminSessionToken = () => {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  return `${issuedAt}.${signPayload(issuedAt)}`;
};

export const verifyAdminSessionToken = (token: string) => {
  const [issuedAt, signature] = token.split(".");

  if (!issuedAt || !signature || !getSessionSecret()) {
    return false;
  }

  const expectedSignature = signPayload(issuedAt);
  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  const issuedAtSeconds = Number(issuedAt);
  if (!Number.isFinite(issuedAtSeconds)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds - issuedAtSeconds < ADMIN_SESSION_MAX_AGE;
};

export const isAdminRequest = (request: NextRequest) => {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminSessionToken(token) : false;
};

export const isAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminSessionToken(token) : false;
};
