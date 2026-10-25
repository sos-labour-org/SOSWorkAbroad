import "server-only";

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

/**
 * TODO (payment integration):
 * 1. Call the provider's API here to create a payment/checkout session.
 * 2. Return { ok: true, redirectUrl } with the provider's payment page address.
 * 3. When the provider confirms payment, it calls our webhook
 *    (app/api/payments/webhook/route.ts), which calls markPaymentPaid().
 * Keep any secret keys in .env.local, never in code.
 */
export async function startProviderPayment(
  request: PaymentRequest,
): Promise<PaymentStart> {
  void request;
  return {
    ok: false,
    error: "Online payment is not switched on yet. Please check back soon.",
  };
}