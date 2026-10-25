import type { Metadata } from "next";
import { Share2, Users, Wallet } from "lucide-react";
import AgentForm from "./AgentForm";

export const metadata: Metadata = {
  title: "Become an Agent | SOS Work Abroad",
  description:
    "Join the SOS Work Abroad agent network. Help people register for jobs abroad and get paid.",
};

const steps = [
  {
    icon: Share2,
    title: "Apply and get approved",
    text: "Fill in the form. Once approved, you receive your own referral link.",
  },
  {
    icon: Users,
    title: "Bring people in",
    text: "Share your link with people who want to work abroad. Everyone who registers through it is tracked to you.",
  },
  {
    icon: Wallet,
    title: "Get paid",
    text: "You receive payment for the people you bring in.",
  },
];

export default function AgentsPage() {
  return (
    <main>
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl font-bold md:text-5xl">
            Become an SOS agent
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Help people in your community start their journey abroad, and earn
            for it.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">How it works</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-3xl bg-muted p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                    <step.icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-3xl bg-cream p-6">
              <h2 className="text-xl font-bold">Agent benefits</h2>
              <p className="mt-2 text-muted-foreground">
                Benefits and payment details will be shared here soon.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-muted p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Apply to be an agent</h2>
            <AgentForm />
          </div>
        </div>
      </section>
    </main>
  );
}