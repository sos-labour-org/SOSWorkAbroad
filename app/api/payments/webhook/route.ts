// TODO (payment integration): receive the provider's "payment succeeded" message.
// 1. VERIFY the provider's signature first. Never trust an unsigned request.
// 2. Find our payment using the paymentId you sent as metadata.
// 3. Call markPaymentPaid({ paymentId, provider, providerReference }).
// 4. Reply 200 quickly.

export async function POST() {
  return new Response("Payment webhook not set up yet", { status: 501 });
}