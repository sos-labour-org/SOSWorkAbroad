import type { Metadata } from "next";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { requireDocumentsComplete } from "@/lib/apply-guard";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import Progress from "../Progress";
import ReferenceCard from "../ReferenceCard";
import PayForm from "./PayForm";

export const metadata: Metadata = {
  title: "Payment | SOS Work Abroad",
  robots: { index: false },
};

async function PaymentContent() {
  const applicant = await requireDocumentsComplete();
  const pkg = siteConfig.packages[applicant.destination as "uae" | "europe"];
  const amountLabel = formatPrice(pkg.amount, pkg.currency);

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:px-8 md:py-6">
          <Progress current={4} />
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="text-3xl font-bold md:text-4xl">Complete your payment</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your documents are in. One last step to secure your place.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              {pkg.name} travel package
            </p>
            <p className="mt-1 text-5xl font-bold text-primary">{amountLabel}</p>
            <p className="mt-1 text-muted-foreground">One-time payment</p>

            <h2 className="mt-8 font-semibold">This covers</h2>
            <ul className="mt-3 space-y-3">
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

            <div className="mt-8 border-t border-border pt-8">
              <PayForm amountLabel={amountLabel} />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                You will be taken to a secure payment page.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <ReferenceCard reference={applicant.reference} />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={<p className="p-8 text-center">Loading your payment...</p>}
    >
      <PaymentContent />
    </Suspense>
  );
}