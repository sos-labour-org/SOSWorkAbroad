"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="SOS Work Abroad"
            width={600}
            height={200}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#apply"
          className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 md:inline-block"
        >
          Free Registration
        </Link>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-white px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#apply"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-primary py-3 text-center font-semibold text-on-primary"
          >
            Free Registration
          </Link>
        </nav>
      )}
    </header>
  );
}