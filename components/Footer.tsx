import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
   FaYoutube,
} from "react-icons/fa6";
import { siteConfig } from "@/lib/site-config";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook, icon: FaFacebookF },
  { label: "Instagram", href: siteConfig.social.instagram, icon: FaInstagram },
  { label: "X", href: siteConfig.social.x, icon: FaXTwitter },
  { label: "TikTok", href: siteConfig.social.tiktok, icon: FaTiktok },
  { label: "YouTube", href: siteConfig.social.youtube, icon: FaYoutube },
];

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">
            SOS <span className="text-primary">Work Abroad</span>
          </p>
          <p className="mt-2 text-muted-foreground">{siteConfig.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Licence: {siteConfig.licence}
          </p>
        </div>

        <div>
          <p className="font-semibold">Quick links</p>
          <ul className="mt-3 space-y-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">Contact us</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone size={18} aria-hidden="true" />
              {siteConfig.contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} aria-hidden="true" />
              {siteConfig.contact.email}
            </li>
              <li>
    <a
      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-1 transition-colors hover:text-primary"
    >
      <FaWhatsapp size={18} aria-hidden="true" />
      Chat on WhatsApp
    </a>
  </li>
          </ul>

          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                <s.icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

            <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        <p className="mt-1">
          <Link
            href="/terms"
            className="inline-block py-2 underline-offset-4 hover:text-primary hover:underline"
          >
            Terms and Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
}