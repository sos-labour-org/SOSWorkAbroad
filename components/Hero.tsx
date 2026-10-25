import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-on-highlight">
          <CalendarDays size={16} aria-hidden="true" />
         UAE first batch leaving {siteConfig.firstBatch.label}
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Transfer to <span className="text-primary">Transform</span>
        </h1>

        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Free recruitment for all Africans. Register today and take the first
          step to working abroad.
        </p>

        <div id="apply" className="mt-8 flex scroll-mt-24 flex-col gap-3 sm:flex-row">
          <Link
            href="/apply/uae"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Apply for UAE Jobs
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/apply/europe"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Apply for European Jobs
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-6 max-w-xl text-sm text-muted-foreground">
          Recruitment is free. Just bring your passport, a CV with your photo,
          and your school certificate (JHS and above).
        </p>
      </div>
    </section>
  );
}