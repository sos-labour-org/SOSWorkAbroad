"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { simulatePayment, startPayment, type PayState } from "./actions";

const initial: PayState = {};

export default function PayForm({ amountLabel }: { amountLabel: string }) {
  const [state, payAction, paying] = useActionState(startPayment, initial);
  const [simState, simAction, simulating] = useActionState(
    simulatePayment,
    initial,
  );

  const error = state.error ?? simState.error;

  return (
    <div>
      <form action={payAction}>
        <button
          type="submit"
          disabled={paying}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Lock size={20} aria-hidden="true" />
          {paying ? "Please wait..." : `Pay ${amountLabel} now`}
        </button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/40 bg-red-50 p-4 text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}

      {process.env.NODE_ENV === "development" ? (
        <form action={simAction} className="mt-6 border-t border-border pt-6">
          <p className="mb-2 text-sm text-muted-foreground">
            Developer only: you will not see this on the live website.
          </p>
          <button
            type="submit"
            disabled={simulating}
            className="min-h-11 rounded-full border-2 border-dashed border-slate-400 px-5 py-2 text-sm font-semibold"
          >
            {simulating ? "Working..." : "Simulate successful payment"}
          </button>
        </form>
      ) : null}
    </div>
  );
}