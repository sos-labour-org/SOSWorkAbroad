import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getCurrentApplicant } from "@/lib/applicant-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import Progress from "../Progress";
import DocumentsForm from "./DocumentsForm";
import ReferenceCard from "../ReferenceCard";

export const metadata: Metadata = {
  title: "Upload your documents | SOS Work Abroad",
  robots: { index: false },
};

async function DocumentsContent() {
  const applicant = await getCurrentApplicant();
  if (!applicant) redirect("/#packages");

  const supabase = createAdminClient();
  const { data: docs } = await supabase
    .from("documents")
    .select("type, original_name, size_bytes")
    .eq("applicant_id", applicant.id);

  const pkg =
    siteConfig.packages[applicant.destination as "uae" | "europe"];

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:px-8 md:py-6">
          <Progress current={2} />
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Upload your documents
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Welcome, {applicant.full_name}. Upload all three documents to
            unlock the next step.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
            <DocumentsForm saved={docs ?? []} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
                        <ReferenceCard reference={applicant.reference} />

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                {pkg.name} package
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {formatPrice(pkg.amount, pkg.currency)}
              </p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {siteConfig.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="mt-0.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={<p className="p-8 text-center">Loading your application...</p>}
    >
      <DocumentsContent />
    </Suspense>
  );
}