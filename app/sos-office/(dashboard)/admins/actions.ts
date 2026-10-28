"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateAdminState = {
  error?: string;
  success?: { fullName: string; email: string; password: string };
};

// No look-alike characters (0/O, 1/l/I) so it is easy to read on WhatsApp
function makeTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[randomInt(chars.length)];
  return out;
}

export async function createAdmin(
  _previous: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  await requireOwner();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!fullName || !email) return { error: "Enter a name and an email." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const supabase = createAdminClient();
  const password = makeTempPassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    const taken = error?.message.toLowerCase().includes("already");
    return {
      error: taken
        ? "That email already has an account."
        : "Could not create the login. Try again.",
    };
  }

  const { error: insertError } = await supabase.from("admins").insert({
    user_id: data.user.id,
    email,
    full_name: fullName,
    is_owner: false,
    must_change_password: true,
  });

  if (insertError) {
    // Undo the login so nothing is left half-created
    await supabase.auth.admin.deleteUser(data.user.id);
    return { error: "Could not add the admin. Nothing was saved." };
  }

  revalidatePath("/sos-office/admins");
  return { success: { fullName, email, password } };
}

export async function removeAdmin(
  userId: string,
): Promise<{ error?: string; success?: boolean }> {
  const me = await requireOwner();

  if (userId === me.user.id) {
    return { error: "You cannot remove yourself." };
  }

  const supabase = createAdminClient();

  const { count: adminCount } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true });
  if ((adminCount ?? 0) <= 1) {
    return { error: "You cannot remove the last admin." };
  }

  const { data: target } = await supabase
    .from("admins")
    .select("is_owner")
    .eq("user_id", userId)
    .maybeSingle();

  if (target?.is_owner) {
    const { count: ownerCount } = await supabase
      .from("admins")
      .select("*", { count: "exact", head: true })
      .eq("is_owner", true);
    if ((ownerCount ?? 0) <= 1) {
      return { error: "You cannot remove the last owner." };
    }
  }

  const { error } = await supabase.from("admins").delete().eq("user_id", userId);
  if (error) return { error: "Could not remove the admin." };

 
  await supabase.auth.admin.deleteUser(userId);

  revalidatePath("/sos-office/admins");
  return { success: true };
}