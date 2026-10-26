"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { flyers, type Flyer } from "@/lib/flyers";

const placeholders: Flyer[] = [1, 2, 3].map((n) => ({
  src: "",
  alt: `Flyer ${n} placeholder`,
}));

export default function Flyers() {
  const track = useRef<HTMLDivElement>(null);

  const isDev = process.env.NODE_ENV === "development";
  const items = flyers.length > 0 ? flyers : isDev ? placeholders : [];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 5000);

    return () => clearInterval(id);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  function scroll(direction: 1 | -1) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8 });
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
  Work in the UAE: first batch enrolling now
</h2>
<p className="mt-2 max-w-xl text-muted-foreground">
  Everything you need to travel is included.
</p>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous flyers"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next flyers"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

                {/* Phone: one flyer at a time, fading every 5 seconds */}
        <div
          className="mt-8 sm:hidden"
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-muted">
            {items.map((flyer, i) => (
              <div
                key={flyer.src || i}
                aria-hidden={i !== current}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                {flyer.src ? (
                  <Image
                    src={flyer.src}
                    alt={flyer.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">
                    Flyer goes here
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Show flyer ${i + 1}`}
                aria-current={i === current}
                className="flex h-11 w-8 items-center justify-center"
              >
                <span
                  className={`h-2.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "w-2.5 bg-primary/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tablet and desktop: sideways scroller */}
        <div
          ref={track}
          role="region"
          aria-label="Job flyers, scroll sideways"
          tabIndex={0}
          className="mt-8 hidden snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto pb-4 sm:flex"
        >
          {items.map((flyer, i) => (
            <div
              key={flyer.src || i}
              className="relative aspect-[4/5] w-[75%] shrink-0 snap-start overflow-hidden rounded-3xl bg-muted sm:w-[45%] lg:w-[30%]"
            >
              {flyer.src ? (
                <Image
                  src={flyer.src}
                  alt={flyer.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 75vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">
                  Flyer goes here
                  <br />
                  1080 × 1350
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}