import Image from "next/image";
import Link from "next/link";

const wide = {
  src: "/flyer-5.jpg",
  alt: "Work in Europe: apply now for European jobs",
  width: 1800,
  height: 600,
};

// Phone version. If you only have the wide image, set this to null.
const tall: { src: string; alt: string; width: number; height: number } | null = {
  src: "/europe-tall.jpg",
  alt: "Work in Europe: apply now for European jobs",
  width: 1080,
  height: 1350,
};

export default function EuropeBanner() {
  return (
    <section className="-mt-8 bg-white pb-16 md:-mt-12 md:pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <Link
          href="/apply/europe"
          className="block overflow-hidden rounded-3xl shadow-sm transition-shadow hover:shadow-md"
        >
          {tall ? (
            <Image
              src={tall.src}
              alt={tall.alt}
              width={tall.width}
              height={tall.height}
              sizes="100vw"
              className="h-auto w-full sm:hidden"
            />
          ) : null}
          <Image
            src={wide.src}
            alt={wide.alt}
            width={wide.width}
            height={wide.height}
            sizes="(min-width: 1152px) 1100px, 100vw"
            className={`h-auto w-full ${tall ? "hidden sm:block" : ""}`}
          />
        </Link>
      </div>
    </section>
  );
}