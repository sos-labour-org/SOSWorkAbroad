"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";

export default function ReferenceCard({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Copying isn't available on every browser; the number is still on screen
    }
  }

  return (
    <div className="rounded-2xl bg-primary p-6 text-on-primary shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <KeyRound size={20} aria-hidden="true" />
        </span>
        <p className="font-semibold">Your reference number</p>
      </div>

      <p className="mt-4 rounded-xl bg-white px-4 py-4 text-center text-3xl font-bold tracking-widest text-primary">
        {reference}
      </p>

      <button
        type="button"
        onClick={copy}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-white px-5 py-2.5 font-semibold transition-colors hover:bg-white hover:text-primary"
      >
        {copied ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Copy size={18} aria-hidden="true" />
        )}
        {copied ? "Copied!" : "Copy number"}
      </button>

      <p className="mt-4 text-sm">
        Save this number or take a screenshot. You will need it if you contact
        us about your application.
      </p>

      <p role="status" className="sr-only">
        {copied ? "Reference number copied" : ""}
      </p>
    </div>
  );
}