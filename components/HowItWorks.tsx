import { UserPlus, Upload, CreditCard, Plane } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register (free)",
    text: "Choose UAE or Europe and fill in your details. Registration costs nothing.",
  },
  {
    icon: Upload,
    title: "Upload your documents",
    text: "Your passport, a CV with your photo, and your school certificate.",
  },
  {
    icon: CreditCard,
    title: "Complete your travel package",
    text: "One payment covers your tickets, medicals and documentation.",
  },
  {
    icon: Plane,
    title: "Get ready to fly",
    text: "We guide you through every step until your batch departs.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Four simple steps from registration to departure.
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-3xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
                <step.icon size={24} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-semibold text-primary">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}