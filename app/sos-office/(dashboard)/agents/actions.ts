"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateAgentStatus(agentId: string, status: string) {
  await requireAdmin();

  const validStatuses = ["new", "contacted", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    return { ok: false, error: "Invalid agent status." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("agent_applications")
    .update({ status })
    .eq("id", agentId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/sos-office/agents");
  revalidatePath("/sos-office");
  return { ok: true };
}

export async function assignReferralCode(agentId: string, referralCode: string) {
  await requireAdmin();

  const cleanCode = referralCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  if (!cleanCode || cleanCode.length < 3) {
    return { ok: false, error: "Referral code must be at least 3 alphanumeric characters." };
  }

  const supabase = createAdminClient();

  // Check if code is already used by another agent
  const { data: existing } = await supabase
    .from("agent_applications")
    .select("id")
    .eq("referral_code", cleanCode)
    .neq("id", agentId)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: `Referral code "${cleanCode}" is already assigned to another agent.` };
  }

  const { error } = await supabase
    .from("agent_applications")
    .update({ referral_code: cleanCode, status: "approved" })
    .eq("id", agentId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/sos-office/agents");
  revalidatePath("/sos-office");
  return { ok: true, code: cleanCode };
}
