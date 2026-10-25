import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const COOKIE_NAME = "sos_applicant";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function setApplicantCookie(reference: string, token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${reference}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function getCurrentApplicant() {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const [reference, token] = raw.split(".");
  if (!reference || !token) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("applicants")
    .select("*")
    .eq("reference", reference)
    .eq("access_token_hash", hashToken(token))
    .maybeSingle();

  return data;
}