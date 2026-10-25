"use server";

import { randomInt } from "crypto";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { newToken, hashToken, setApplicantCookie } from "@/lib/applicant-session";

export type ApplyState = { error?: string };

const EDUCATION = ["JHS", "SHS", "Diploma / HND", "Degree", "Other"];
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I mix-ups

function makeReference() {
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `SOS-${code}`;
}

export async function registerApplicant(
  _previous: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  // Honeypot: real people leave this empty
  if (String(formData.get("website") ?? "") !== "") {
    return { error: "Something went wrong. Please try again." };
  }

  const destination = String(formData.get("destination") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/[\s-]/g, "");
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/[\s-]/g, "");
  const email = String(formData.get("email") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const education = String(formData.get("education") ?? "");
  const consent = formData.get("consent") === "on";

  if (destination !== "uae" && destination !== "europe") {
    return { error: "Something went wrong. Please try again." };
  }
  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Please enter your full name." };
  }
  if (!/^\+?\d{9,15}$/.test(phone)) {
    return { error: "Please enter a valid phone number, for example 0241234567." };
  }
  if (whatsapp !== "" && !/^\+?\d{9,15}$/.test(whatsapp)) {
    return { error: "That WhatsApp number doesn't look right." };
  }
  if (email !== "" && (email.length > 200 || !email.includes("@"))) {
    return { error: "That email address doesn't look right." };
  }
  if (region.length < 2 || region.length > 100) {
    return { error: "Please enter your town or city." };
  }
  if (!EDUCATION.includes(education)) {
    return { error: "Please choose your level of education." };
  }
  if (!consent) {
    return { error: "Please tick the box to agree before you continue." };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("applicants")
    .select("reference")
    .eq("phone", phone)
    .eq("destination", destination)
    .maybeSingle();

  if (existing) {
    return {
      error: `This phone number is already registered (reference ${existing.reference}). Please contact us on WhatsApp to continue your application.`,
    };
  }

  const token = newToken();
  let reference = makeReference();

  let { error } = await supabase.from("applicants").insert({
    reference,
    destination,
    full_name: fullName,
    phone,
    whatsapp: whatsapp || null,
    email: email || null,
    region,
    education,
    access_token_hash: hashToken(token),
  });

  // Very rare: the random reference already exists, so try once more
  if (error?.code === "23505") {
    reference = makeReference();
    ({ error } = await supabase.from("applicants").insert({
      reference,
      destination,
      full_name: fullName,
      phone,
      whatsapp: whatsapp || null,
      email: email || null,
      region,
      education,
      access_token_hash: hashToken(token),
    }));
  }

  if (error) {
    return {
      error: "We couldn't save your details. Please try again, or message us on WhatsApp.",
    };
  }

  await setApplicantCookie(reference, token);
  redirect("/apply/documents");
}