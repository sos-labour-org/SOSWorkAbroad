import { Check } from "lucide-react";

const steps = ["Details", "Documents", "Review", "Payment", "Done"];

export default function Progress({ current }: { current: number }) {
  return (
    <nav aria-label="Application progress">
      <p className="mb-3 text-sm font-medium text-muted-foreground sm:hidden">
        Step {current} of {steps.length}: {steps[current - 1]}
      </p>

      <ol className="flex items-center">
        {steps.map((label, i) => {
          const number = i + 1;
          const done = number < current;
          const active = number === current;
          const last = number === steps.length;

          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={`flex items-center ${last ? "" : "flex-1"}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    done || active
                      ? "bg-primary text-on-primary"
                      : "border-2 border-slate-300 bg-white text-muted-foreground"
                  }`}
                >
                  {done ? <Check size={18} aria-hidden="true" /> : number}
                </span>
                <span
                  className={`hidden text-sm sm:block ${
                    active ? "font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>

              {!last && (
                <span
                  aria-hidden="true"
                  className={`mx-3 h-0.5 flex-1 rounded ${
                    done ? "bg-primary" : "bg-slate-300"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}