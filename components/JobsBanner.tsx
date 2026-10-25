import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const categories = [
  "Factory",
  "Construction",
  "Healthcare",
  "Hospitality",
  "Driving",
  "Cleaning",
  "Logistics",
  "Customer Service",
];

export default function JobsBanner() {
  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Job offers
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            Not sure what jobs are out there?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse real job openings on SOS Labour, our job board, and see the
            kind of work waiting abroad.
          </p>
          <a
            href={siteConfig.links.soslabour}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Check out some job offers
            <ArrowUpRight size={20} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <ul className="flex flex-wrap gap-3">
          {categories.map((name) => (
            <li
              key={name}
              className="rounded-full bg-white px-5 py-2.5 font-medium"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}