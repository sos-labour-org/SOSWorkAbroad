import "server-only";
import { randomBytes } from "node:crypto";

export type PaymentRequest = {
  paymentId: string; // our own id for this payment: send it to the provider as metadata
  reference: string; // the applicant's reference, e.g. SOS-NMA5JZ
  amount: number; // e.g. 4990
  currency: "GHS" | "USD";
  customer: { name: string; phone: string; email: string | null };
};

export type PaymentStart =
  | { ok: true; redirectUrl: string } // where to send the person to pay
  | { ok: false; error: string };

const NOT_READY =
  "Online payment is not switched on yet. Please check back soon.";

/**
 * Starts a Paystack checkout and returns the address of Paystack's payment page.
 * When Paystack confirms the payment it calls app/api/payments/webhook/route.ts,
 * which calls markPaymentPaid().
 */
export async function startProviderPayment(
  request: PaymentRequest,
): Promise<PaymentStart> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = process.env.SITE_URL;

  // Until the keys are added, behave exactly as before
  if (!secret || !siteUrl) return { ok: false, error: NOT_READY };

  // Paystack needs an email on every payment. If the applicant gave none,
  // use the company address so the payment can still go through.
  const email =
    request.customer.email ||
    process.env.PAYSTACK_FALLBACK_EMAIL ||
    "info@nekotechcenter.org";

  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        // Paystack wants the smallest unit: pesewas for GHS, cents for USD
        amount: Math.round(request.amount * 100),
        currency: request.currency,
        // Must be unique each attempt, so a retry never clashes with an old try
        reference: `${request.paymentId}-${randomBytes(4).toString("hex")}`,
        callback_url: `${siteUrl}/apply/done`,
        metadata: {
          paymentId: request.paymentId,
          applicantReference: request.reference,
          name: request.customer.name,
          phone: request.customer.phone,
        },
      }),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status || !json?.data?.authorization_url) {
      console.error("Paystack initialize failed:", json?.message ?? res.status);
      return {
        ok: false,
        error: "We couldn't reach the payment service. Please try again.",
      };
    }

    return { ok: true, redirectUrl: json.data.authorization_url as string };
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return {
      ok: false,
      error: "We couldn't reach the payment service. Please try again.",
    };
  }
}