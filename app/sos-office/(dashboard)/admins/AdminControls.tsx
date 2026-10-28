"use client";

import { useActionState, useState } from "react";
import { Check, Copy, Loader2, Trash2, UserPlus } from "lucide-react";
import { createAdmin, removeAdmin, type CreateAdminState } from "./actions";

const initial: CreateAdminState = {};

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

export function AddAdminForm() {
  const [state, action, pending] = useActionState(createAdmin, initial);
  const [copied, setCopied] = useState(false);

  const message = state.success
    ? [
        `Hello ${state.success.fullName}, you have been added as an admin on SOS Work Abroad.`,
        "",
        `Login: ${window.location.origin}/sos-office/login`,
        `Email: ${state.success.email}`,
        `Temporary password: ${state.success.password}`,
        "",
        "You will be asked to choose a new password the first time you sign in. Please do not share this message.",
      ].join("\n")
    : "";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard blocked: the message is still visible to select by hand
    }
  }

  return (
    <div className="space-y-4">
      <form
        key={state.success?.email ?? "new"}
        action={action}
        className="grid gap-3 md:grid-cols-12"
      >
        <input
          name="full_name"
          placeholder="Full name"
          required
          className={`${inputClass} md:col-span-4`}
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className={`${inputClass} md:col-span-5`}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60 md:col-span-3"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <UserPlus className="size-3.5" />
          )}
          <span>Add admin</span>
        </button>
      </form>

      {state.error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-900">
            Admin created. Send this to {state.success.fullName} on WhatsApp.
            The password is shown only once.
          </p>
          <pre className="whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-[11px] leading-relaxed text-foreground">
            {message}
          </pre>
          <button
            type="button"
            onClick={copyMessage}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-foreground shadow-2xs ring-1 ring-border transition-colors hover:bg-muted"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy message"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RemoveAdminButton({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    if (!window.confirm(`Remove ${name}? They lose access immediately.`)) return;
    setLoading(true);
    setError(null);
    const res = await removeAdmin(userId);
    setLoading(false);
    if (res.error) setError(res.error);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="inline-flex h-7 items-center gap-1 rounded-md bg-muted px-2.5 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive hover:text-white disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Trash2 className="size-3" />
        )}
        <span>Remove</span>
      </button>
      {error ? <p className="text-[10px] text-destructive">{error}</p> : null}
    </div>
  );
}