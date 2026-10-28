import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const getAdminProfile = cache(async () => {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await createAdminClient()
    .from("admins")
    .select("user_id, is_owner, must_change_password")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;

    return {
    user,
    isOwner: data.is_owner as boolean,
    mustChangePassword: data.must_change_password as boolean,
  };
});

export async function getAdmin() {
  const profile = await getAdminProfile();
  return profile ? profile.user : null;
}

// Normal protection for every admin page: must be an admin, and must
// already have replaced their temporary password.
export async function requireAdmin() {
  await connection();
  const profile = await getAdminProfile();
  if (!profile) redirect("/sos-office/login");
  if (profile.mustChangePassword) redirect("/sos-office/change-password");
  return profile.user;
}


export async function requireAdminAnyState() {
  await connection();
  const profile = await getAdminProfile();
  if (!profile) redirect("/sos-office/login");
  return profile;
}


export async function requireOwner() {
  const profile = await requireAdminAnyState();
  if (profile.mustChangePassword) redirect("/sos-office/change-password");
  if (!profile.isOwner) redirect("/sos-office");
  return profile;
}