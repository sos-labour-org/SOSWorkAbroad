import Link from "next/link";
import { ArrowRight, Share2, Users } from "lucide-react";

const points = [
  {
    icon: Share2,
    title: "Share your link",
    text: "Get your own referral link to send to people who want to work abroad.",
  },
  {
    icon: Users,
    title: "They register",
    text: "Everyone who registers through your link is tracked to you.",
  },
];

export default function AgentsTeaser() {
  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            For agents
          </p>
          <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            Become an SOS agent
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Know people who want to work abroad? Join our agent network and
            help them register.
          </p>
          <Link
            href="/agents"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Apply to be an agent
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>

        <ul className="space-y-4">
          {points.map((point) => (
            <li
              key={point.title}
              className="flex gap-4 rounded-3xl bg-white p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary">
                <point.icon size={24} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="mt-1 text-muted-foreground">{point.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}