import Link from "next/link";
import { ArrowRight } from "lucide-react";


export default function Hero() {
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">

                <h1
                    className="animate-fade-up max-w-3xl text-5xl font-bold uppercase leading-tight md:text-7xl"
          style={{ animationDelay: "150ms" }}
        >
          Work <span className="text-primary">Abroad</span>
          <span className="mt-2 block text-2xl font-semibold normal-case text-foreground md:text-4xl">
            Transfer to <span className="text-primary">Transform</span>
          </span>
        </h1>

         <p
          className="animate-fade-up mt-4 max-w-xl text-lg text-muted-foreground"
          style={{ animationDelay: "300ms" }}
        >
          Free recruitment for all Africans. Register today and take the first
          step to working abroad.
        </p>

                <div
          id="apply"
          className="animate-fade-up mt-8 flex scroll-mt-24 flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "450ms" }}
        >
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

                <p
          className="animate-fade-up mt-6 max-w-xl text-sm text-muted-foreground"
          style={{ animationDelay: "600ms" }}
        >
          Recruitment is free. Just bring your passport, a CV with your photo,
          and your school certificate (JHS and above).
        </p>
      </div>
    </section>
  );
}