"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAnyState } from "@/lib/admin-guard";

export type ChangePasswordState = { error?: string };

export async function changePassword(
  _previous: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const profile = await requireAdminAnyState();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 10) {
    return { error: "Use at least 10 characters." };
  }
  if (password !== confirm) {
    return { error: "The two passwords do not match." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Could not change the password. Try a different one." };
  }

  await createAdminClient()
    .from("admins")
    .update({ must_change_password: false })
    .eq("user_id", profile.user.id);

  redirect("/sos-office");
}
