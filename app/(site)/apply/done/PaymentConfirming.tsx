"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 10;

export default function PaymentConfirming() {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return;
    const id = setTimeout(() => {
      router.refresh();
      setAttempts((n) => n + 1);
    }, 3000);
    return () => clearTimeout(id);
  }, [attempts, router]);

  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <Loader2
        className="mx-auto size-12 animate-spin text-primary"
        aria-hidden="true"
      />
      <h1 className="mt-4 text-3xl font-bold">Confirming your payment...</h1>
      {attempts < MAX_ATTEMPTS ? (
        <p className="mt-2 text-lg text-muted-foreground">
          Please wait a moment. Do not pay again and do not close this page.
        </p>
      ) : (
        <p className="mt-2 text-lg text-muted-foreground">
          This is taking longer than usual. Your payment is safe. If you were
          charged, contact us with your reference number and we will confirm it.
        </p>
      )}
    </div>
  );
}