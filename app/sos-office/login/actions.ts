"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin-guard";

export type LoginState = { error?: string };

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };

  // Logged in is not enough: they must be on the admins list
  const admin = await getAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect("/sos-office");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/sos-office/login");
}