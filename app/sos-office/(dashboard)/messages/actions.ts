"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteMessage(messageId: string) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/sos-office/messages");
  revalidatePath("/sos-office");
  return { ok: true };
}
