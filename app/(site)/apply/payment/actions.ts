"use server";

import { redirect } from "next/navigation";
import { requireDocumentsComplete } from "@/lib/apply-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";
import { startProviderPayment } from "@/lib/payments/provider";
import { markPaymentPaid } from "@/lib/payments/complete";

export type PayState = { error?: string };

// One pending payment per applicant. The amount ALWAYS comes from our config.
async function getPendingPayment(applicant: {
  id: string;
  destination: string;
}) {
  const pkg = siteConfig.packages[applicant.destination as "uae" | "europe"];
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("payments")
    .select("id")
    .eq("applicant_id", applicant.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    await supabase
      .from("payments")
      .update({ amount: pkg.amount, currency: pkg.currency })
      .eq("id", existing.id);
    return { id: existing.id as string, pkg };
  }

  const { data: created } = await supabase
    .from("payments")
    .insert({
      applicant_id: applicant.id,
      amount: pkg.amount,
      currency: pkg.currency,
    })
    .select("id")
    .single();

  return created ? { id: created.id as string, pkg } : null;
}

export async function startPayment(_previous: PayState): Promise<PayState> {
  const applicant = await requireDocumentsComplete();
  const payment = await getPendingPayment(applicant);

  if (!payment) {
    return { error: "We couldn't start your payment. Please try again." };
  }

  const result = await startProviderPayment({
    paymentId: payment.id,
    reference: applicant.reference,
    amount: payment.pkg.amount,
    currency: payment.pkg.currency as "GHS" | "USD",
    customer: {
      name: applicant.full_name,
      phone: applicant.phone,
      email: applicant.email,
    },
  });

  if (!result.ok) return { error: result.error };
  redirect(result.redirectUrl);
}

// Development only: lets you test the full flow without a real payment
export async function simulatePayment(_previous: PayState): Promise<PayState> {
  if (process.env.NODE_ENV !== "development") {
    return { error: "Not available." };
  }

  const applicant = await requireDocumentsComplete();
  const payment = await getPendingPayment(applicant);
  if (!payment) return { error: "No pending payment found." };

  await markPaymentPaid({
    paymentId: payment.id,
    provider: "simulated",
    providerReference: `SIM-${payment.id}`,
  });
  redirect("/apply/done");
}