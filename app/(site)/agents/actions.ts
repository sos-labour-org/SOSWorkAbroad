"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type AgentState = { ok: boolean; error?: string };

export async function applyAsAgent(
  _previous: AgentState,
  formData: FormData,
): Promise<AgentState> {
  // Honeypot: real people leave this empty
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const about = String(formData.get("about") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (fullName.length < 2 || phone.length < 7 || location.length < 2) {
    return {
      ok: false,
      error: "Please fill in your name, phone number and location.",
    };
  }

  if (
    fullName.length > 100 ||
    phone.length > 30 ||
    whatsapp.length > 30 ||
    location.length > 100 ||
    about.length > 1000
  ) {
    return { ok: false, error: "One of the fields is too long." };
  }

  if (email !== "" && (email.length > 200 || !email.includes("@"))) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  if (!consent) {
    return {
      ok: false,
      error: "Please tick the box to agree before you submit.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("agent_applications").insert({
    full_name: fullName,
    phone,
    whatsapp: whatsapp || null,
    email: email || null,
    location,
    about: about || null,
  });

  if (error) {
    return {
      ok: false,
      error: "Something went wrong. Please try again, or message us on WhatsApp.",
    };
  }

  return { ok: true };
}