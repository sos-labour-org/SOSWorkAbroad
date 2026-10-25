import type { Metadata } from "next";
import { Share2, Users} from "lucide-react";
import AgentForm from "./AgentForm";

export const metadata: Metadata = {
  title: "Become an Agent | SOS Work Abroad",
  description:
    "Join the SOS Work Abroad agent network and help people register for jobs abroad.",
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

];

export default function AgentsPage() {
  return (
    <main className="bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            For agents
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            Become an SOS agent
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
                        Help people in your community start their journey abroad.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-xl font-semibold">How it works</h2>

            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary">
                    <step.icon size={24} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8 lg:col-span-3">
            <h2 className="text-2xl font-bold">Apply to be an agent</h2>
            <p className="mt-1 mb-6 text-muted-foreground">
              Fill in your details and our team will get back to you.
            </p>
            <AgentForm />
          </div>
        </div>
      </div>
    </main>
  );
}