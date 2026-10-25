import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | SOS Work Abroad",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <h1 className="text-4xl font-bold md:text-5xl">
            Terms and Conditions
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <p className="text-lg text-muted-foreground">
            Our terms and conditions are being prepared and will be published
            here soon.
          </p>
          <p className="mt-4 text-muted-foreground">
            If you have questions in the meantime, please{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}