"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "./actions";

const initial: ChangePasswordState = {};

const inputClass =
  "block min-h-12 w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          At least 10 characters.
        </p>
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold">
          Repeat new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-red-50 p-3 text-sm font-medium text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save new password"}
      </button>
    </form>
  );
}