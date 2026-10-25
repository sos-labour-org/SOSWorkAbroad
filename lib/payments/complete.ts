import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markPaymentPaid(input: {
  paymentId: string;
  provider: string;
  providerReference: string;
}) {
  const supabase = createAdminClient();

  // Only flips a payment that isn't already paid, so repeats are harmless
  const { data: payment } = await supabase
    .from("payments")
    .update({
      status: "paid",
      provider: input.provider,
      provider_reference: input.providerReference,
      paid_at: new Date().toISOString(),
    })
    .eq("id", input.paymentId)
    .neq("status", "paid")
    .select("applicant_id")
    .maybeSingle();

  if (!payment) return false;

  await supabase
    .from("applicants")
    .update({ status: "paid" })
    .eq("id", payment.applicant_id)
    .in("status", ["registered", "documents_complete"]);

  return true;
}