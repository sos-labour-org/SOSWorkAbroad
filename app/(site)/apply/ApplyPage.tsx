import { Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import Progress from "./Progress";
import DetailsForm from "./DetailsForm";

export default function ApplyPage({
  destination,
}: {
  destination: "uae" | "europe";
}) {
  const pkg = siteConfig.packages[destination];

  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="rounded-2xl bg-white p-5 shadow-sm md:px-8 md:py-6">
          <Progress current={1} />
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Apply for {pkg.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Registration is free. You only pay after your documents are
            uploaded.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
            <DetailsForm destination={destination} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Your travel package
              </p>
              <p className="mt-1 text-4xl font-bold text-primary">
                {formatPrice(pkg.amount, pkg.currency)}
              </p>
              <p className="text-sm text-muted-foreground">
                One-time payment, after your documents are uploaded
              </p>

              <ul className="mt-5 space-y-3 border-t border-border pt-5">
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

            <div className="rounded-2xl bg-cream p-6">
              <h2 className="font-semibold">Have these ready</h2>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-3">
                  <Check
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Passport
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  CV with your photo
                </li>
                <li className="flex items-start gap-3">
                  <Check
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  School certificate (JHS and above)
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}