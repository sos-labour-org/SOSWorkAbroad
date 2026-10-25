"use client";

import { useActionState } from "react";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";
import { registerApplicant, type ApplyState } from "./actions";

const initialState: ApplyState = {};

const inputClass =
  "block min-h-12 w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-base placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

function Field({
  id,
  label,
  hint,
  optional,
  className = "",
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">
        {number}
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

export default function DetailsForm({
  destination,
}: {
  destination: "uae" | "europe";
}) {
  const [state, formAction, pending] = useActionState(
    registerApplicant,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="destination" value={destination} />

      <section className="space-y-5">
        <SectionTitle number={1} title="About you" />

        <Field
          id="full_name"
          label="Full name"
          hint="Write it exactly as it appears on your passport."
        >
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="region" label="Town or city">
            <input
              id="region"
              name="region"
              type="text"
              required
              className={inputClass}
            />
          </Field>

          <Field id="education" label="Highest level of education">
            <div className="relative">
              <select
                id="education"
                name="education"
                required
                defaultValue=""
                className={`${inputClass} appearance-none pr-11`}
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option>JHS</option>
                <option>SHS</option>
                <option>Diploma / HND</option>
                <option>Degree</option>
                <option>Other</option>
              </select>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </Field>
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle number={2} title="How we reach you" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phone" label="Phone number">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="0241234567"
              className={inputClass}
            />
          </Field>

          <Field id="whatsapp" label="WhatsApp number" optional>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="If different from phone"
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="email" label="Email address" optional>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
      </section>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted p-4">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
        />
        <span className="text-sm">
          I agree that SOS Work Abroad may store my details and documents to
          process my application.
        </span>
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-red-50 p-4 text-sm font-medium text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Continue to documents"}
          {pending ? null : <ArrowRight size={20} aria-hidden="true" />}
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock size={14} aria-hidden="true" />
          Your information is kept private and secure.
        </p>
      </div>
    </form>
  );
}