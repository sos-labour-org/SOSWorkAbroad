import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { hasPaid, requireApplicant } from "@/lib/apply-guard";
import { siteConfig } from "@/lib/site-config";
import Progress from "../Progress";
import ReferenceCard from "../ReferenceCard";
import PaymentConfirming from "./PaymentConfirming";

export const metadata: Metadata = {
  title: "Application complete | SOS Work Abroad",
  robots: { index: false },
};

async function DoneContent({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const applicant = await requireApplicant();
  const { reference, trxref } = await searchParams;

  if (!hasPaid(applicant.status)) {
    // Just came back from the payment page: wait for the confirmation
    if (reference || trxref) {
      return (
        <main className="bg-muted">
          <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
            <PaymentConfirming />
          </div>
        </main>
      );
    }
    redirect("/apply/payment");
  }

  const next = [
    "We confirm your payment and your documents.",
    `Our team contacts you on ${applicant.phone} with your next steps.`,
    "We guide you through your medicals and documentation until your batch departs.",
  ];

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:px-8 md:py-6">
          <Progress current={5} />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <CheckCircle2
            size={56}
            className="mx-auto text-primary"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            You are all set, {applicant.full_name.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your application is complete.
            {applicant.destination === "uae"
              ? ` The first UAE batch leaves in ${siteConfig.firstBatch.label}.`
              : ""}
          </p>
        </div>

        <div className="mt-6">
          <ReferenceCard reference={applicant.reference} />
        </div>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-3">
            {next.map((text, i) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/"
            className="mt-6 inline-block font-semibold text-primary underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function DonePage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="p-8 text-center">Loading your application...</p>}
    >
      <DoneContent searchParams={searchParams} />
    </Suspense>
  );
}