"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("sos_vid");
    if (!vid) {
      vid =
        "v_" +
        Math.random().toString(36).substring(2, 10) +
        Date.now().toString(36);
      localStorage.setItem("sos_vid", vid);
    }
    return vid;
  } catch {
    return "v_fallback";
  }
}

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/sos-office")) {
      return;
    }

    if (lastTracked.current === pathname) {
      return;
    }
    lastTracked.current = pathname;

    const visitorId = getVisitorId();
    const payload = JSON.stringify({
      page: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      visitorId,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
