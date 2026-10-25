"use client";

import { useActionState } from "react";
import { applyAsAgent, type AgentState } from "./actions";

const initialState: AgentState = { ok: false };

const inputClass =
  "min-h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-3 focus:border-primary";

export default function AgentForm() {
  const [state, formAction, pending] = useActionState(
    applyAsAgent,
    initialState,
  );

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl bg-white p-6">
        <p className="text-lg font-semibold">Application received!</p>
        <p className="mt-1 text-muted-foreground">
          Thank you for applying. Our team will review it and contact you.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="mb-1.5 block font-medium">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1.5 block font-medium">
          WhatsApp number{" "}
          <span className="font-normal text-muted-foreground">
            (if different)
          </span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block font-medium">
          Email address{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-1.5 block font-medium">
          Town or city
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="about" className="mb-1.5 block font-medium">
          How will you find people?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="about"
          name="about"
          rows={4}
          maxLength={1000}
          placeholder="Tell us about your network or any experience you have."
          className={inputClass}
        />
      </div>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-primary"
        />
        <span className="text-sm text-muted-foreground">
          I agree that SOS Work Abroad may store my details and contact me
          about my agent application.
        </span>
      </label>

      {state.error ? (
        <p role="alert" className="font-medium text-destructive">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}