import Link from "next/link";
import { Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";

const routes = [siteConfig.packages.uae, siteConfig.packages.europe];

export default function Offers() {
  return (
    <section id="packages" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Choose your route</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Registration and recruitment are free. The package below covers your
          travel costs.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {routes.map((route) => (
            <article
              key={route.name}
              className={`flex flex-col rounded-3xl border-2 p-8 ${
                route.highlight
                  ? "border-primary bg-muted"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold">{route.name}</h3>
                {route.badge ? (
                  <span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-on-highlight">
                    {route.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-6 text-4xl font-bold text-primary">
                {formatPrice(route.amount, route.currency)}
              </p>
              <p className="text-sm text-muted-foreground">
                One-time travel package
              </p>

              <ul className="mt-6 flex-1 space-y-3">
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

              <p className="mt-6 text-sm text-muted-foreground">{route.note}</p>

              <Link
                href={route.href}
                className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 font-semibold transition-colors ${
                  route.highlight
                    ? "bg-primary text-on-primary hover:opacity-90"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary"
                }`}
              >
                Apply for {route.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}