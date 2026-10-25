"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ContactState = { ok: boolean; error?: string };

export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real people leave this empty
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || phone.length < 7 || message.length < 5) {
    return {
      ok: false,
      error: "Please fill in your name, phone number and message.",
    };
  }
    if (email !== "" && (email.length > 200 || !email.includes("@"))) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  if (name.length > 100 || phone.length > 30 || message.length > 2000) {
    return { ok: false, error: "One of the fields is too long." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, phone, email: email || null, message });
    

  if (error) {
    return {
      ok: false,
      error: "Something went wrong. Please try again, or message us on WhatsApp.",
    };
  }

  return { ok: true };
}