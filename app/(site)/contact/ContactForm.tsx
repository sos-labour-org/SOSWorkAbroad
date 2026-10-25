"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";

const initialState: ContactState = { ok: false };

const inputClass =
  "min-h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-3 focus:border-primary";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendMessage,
    initialState,
  );

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl bg-white p-6">
        <p className="text-lg font-semibold">Thank you!</p>
        <p className="mt-1 text-muted-foreground">
          We got your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
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
        <label htmlFor="email" className="mb-1.5 block font-medium">
          Email address{" "}
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
        <label htmlFor="message" className="mb-1.5 block font-medium">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={2000}
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
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}