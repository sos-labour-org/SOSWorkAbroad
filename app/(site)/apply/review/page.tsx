import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Check } from "lucide-react";
import { requireDocumentsComplete } from "@/lib/apply-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";
import { documentTypes, formatBytes } from "@/lib/documents";
import Progress from "../Progress";

export const metadata: Metadata = {
  title: "Review your application | SOS Work Abroad",
  robots: { index: false },
};

async function ReviewContent() {
  const applicant = await requireDocumentsComplete();

  const supabase = createAdminClient();
  const { data: docs } = await supabase
    .from("documents")
    .select("type, original_name, size_bytes")
    .eq("applicant_id", applicant.id);

  const pkg = siteConfig.packages[applicant.destination as "uae" | "europe"];

  const rows: [string, string | null][] = [
    ["Full name", applicant.full_name],
    ["Route", pkg.name],
    ["Phone", applicant.phone],
    ["WhatsApp", applicant.whatsapp],
    ["Email", applicant.email],
    ["Town or city", applicant.region],
    ["Education", applicant.education],
  ];

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:px-8 md:py-6">
          <Progress current={3} />
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            Review your application
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Check everything is correct before you continue to payment.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">Your details</h2>
            <dl className="mt-4 divide-y divide-border">
              {rows
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium sm:col-span-2">{value}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              Something wrong? Message us on WhatsApp and we will fix it before
              you pay.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Your documents</h2>
              <Link
                href="/apply/documents"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Change documents
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {documentTypes.map((def) => {
                const doc = docs?.find((d) => d.type === def.type);
                return (
                  <li key={def.type} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="mt-0.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium">{def.label}</span>
                      <span className="block break-all text-sm text-muted-foreground">
                        {doc?.original_name}
                        {doc?.size_bytes
                          ? ` · ${formatBytes(doc.size_bytes)}`
                          : ""}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <Link
            href="/apply/payment"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Everything is correct, continue to payment
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={<p className="p-8 text-center">Loading your application...</p>}
    >
      <ReviewContent />
    </Suspense>
  );
}