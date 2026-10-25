import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/lib/site-config";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | SOS Work Abroad",
  description:
    "Questions about working abroad? Call, WhatsApp or message the SOS Work Abroad team.",
};

const channels = [
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    external: false,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${siteConfig.contact.whatsapp}`,
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    external: false,
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl font-bold md:text-5xl">Contact us</h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Questions before you apply? Reach out and our team will help you.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center gap-4 rounded-3xl bg-muted p-6 transition-colors hover:bg-border"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                    <channel.icon size={24} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted-foreground">
                      {channel.label}
                    </span>
                    <span className="block text-lg font-semibold">
                      {channel.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="rounded-3xl bg-muted p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}