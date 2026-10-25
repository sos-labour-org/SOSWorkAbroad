import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  FileCheck,
  Globe,
  Plane,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "About Us | SOS Work Abroad",
  description:
    "SOS Work Abroad connects African workers with jobs overseas. Learn who we are, how we work and what recruitment costs.",
};

const { uae, europe } = siteConfig.packages;

// Put a photo in the public folder and set it here, e.g. "/about-team.jpg".
// While it is null, a blue panel is shown instead.
   const photo: string | null = "/about-team.jpg";

const facts = [
  {
    icon: Plane,
    title: "UAE jobs",
    text: `First batch leaving ${siteConfig.firstBatch.label}.`,
  },
  {
    icon: Globe,
    title: "European jobs",
    text: "A direct route to work in European countries.",
  },
  {
    icon: BadgeCheck,
    title: "Free recruitment",
    text: "You never pay us a recruitment fee.",
  },
];

const strengths = [
  {
    icon: ShieldCheck,
    title: "Genuine applicants",
    text: "We accept only genuine applicants with genuine documents.",
  },
  {
    icon: Wallet,
    title: "Clear fees",
    text: "Recruitment is free. One travel package covers your ticket, medicals and documentation.",
  },
  {
    icon: FileCheck,
    title: "Document support",
    text: "We help you put together and submit the documents you need.",
  },
  {
    icon: Plane,
    title: "Travel support",
    text: "Your ticket and medicals are taken care of, so you can focus on the job ahead.",
  },
];

const steps = [
  {
    title: "Register free",
    text: "Choose UAE or Europe and fill in your details. It costs nothing.",
  },
  {
    title: "Upload your documents",
    text: "Your passport, a CV with your photo, and your school certificate.",
  },
  {
    title: "Review your application",
    text: "Check that everything is correct before you continue.",
  },
  {
    title: "Pay your travel package",
    text: "This step opens only after your documents are uploaded.",
  },
  {
    title: "Get ready to fly",
    text: "We guide you through every step until your batch departs.",
  },
];

function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-highlight">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      ) : null}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
           {/* Intro */}
      <section className="relative overflow-hidden bg-slate-900">
        <Image
          src="/about-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center md:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            About SOS Work Abroad
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
            Connecting Africa&apos;s Workforce with the World
          </h1>
        </div>
      </section>

      {/* 01 Who we are */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading
            label="01 / Who We Are"
            title="Building Bridges to Global Opportunities"
          />

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {photo ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                <Image
                  src={photo}
                  alt="The SOS Work Abroad team"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-end rounded-3xl bg-gradient-to-br from-[#0969c3] to-[#073b73] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.12)] md:p-10">
                <p className="text-3xl font-bold leading-tight text-white md:text-4xl">
                  Transfer
                  <br />
                  to Transform
                </p>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold md:text-3xl">
                Your Gateway to International Employment
              </h3>
              <div className="mt-4 space-y-4 text-lg text-muted-foreground">
                <p>
                  SOS Work Abroad helps Ghanaians and other Africans find jobs
                  overseas. We are connected to SOS Labour, a job placement
                  company that is registered and licensed in Accra, Ghana and
                  Alberta, Canada, and specialises in placing African workers
                  in well-paid positions abroad.
                </p>
                <p>
                  Our first programme sends a batch of workers to the UAE, and
                  we also offer a direct route to work in European countries.
                </p>
              </div>
              <a
                href={siteConfig.links.soslabour}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
              >
                Visit SOS Labour
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {facts.map((fact) => (
              <li
                key={fact.title}
                className="rounded-3xl bg-slate-50 p-6 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center text-highlight">
                  <fact.icon size={32} aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-lg font-semibold">{fact.title}</h3>
                <p className="mt-1 text-muted-foreground">{fact.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 Why choose us */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading
            label="02 / Why Choose Us"
            title="Our Strengths"
            intro={`Recruitment is free. The travel package is ${formatPrice(uae.amount, uae.currency)} for UAE jobs and ${formatPrice(europe.amount, europe.currency)} for European jobs.`}
          />

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((item) => (
              <li
                key={item.title}
                className="rounded-3xl bg-white p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center text-highlight">
                  <item.icon size={40} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 The process */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <SectionHeading
            label="03 / The Process"
            title="How It Works"
            intro="Any worker, skilled or unskilled, can apply. You can do everything on this website, from your phone."
          />

          <ol className="mt-14 space-y-6 rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:p-10">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-on-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to start?</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Registration is free and takes a few minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
          <p className="mt-6 text-muted-foreground">
            Questions first?{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}