import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { markPaymentPaid } from "@/lib/payments/complete";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return new Response(null, { status: 503 });

  // 1. Prove the call really came from Paystack (signed with our secret key)
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response(null, { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      reference?: string;
      amount?: number;
      currency?: string;
      metadata?: { paymentId?: string };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }

  // Only a successful charge matters; acknowledge everything else
  if (event.event !== "charge.success") return new Response(null, { status: 200 });

  const data = event.data;
  const paymentId = data?.metadata?.paymentId;
  if (!data || !paymentId || !data.reference) {
    return new Response(null, { status: 200 });
  }

  // 2. Check the money matches what we expected, from OUR database
  const supabase = createAdminClient();
  const { data: payment } = await supabase
    .from("payments")
    .select("amount, currency")
    .eq("id", paymentId)
    .maybeSingle();

  const matches =
    payment &&
    Math.round(Number(payment.amount) * 100) === data.amount &&
    payment.currency === data.currency;

  if (!matches) {
    console.error("Paystack webhook: amount or currency mismatch", paymentId);
    return new Response(null, { status: 200 });
  }

  // 3. Mark it paid (safe to repeat: already-paid payments are ignored)
  await markPaymentPaid({
    paymentId,
    provider: "paystack",
    providerReference: data.reference,
  });

  return new Response(null, { status: 200 });
}