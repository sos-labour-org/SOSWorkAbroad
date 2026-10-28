import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BOT_REGEX =
  /bot|spider|crawl|slurp|headless|puppeteer|lighthouse|curl|wget|python|postman|preview/i;

function parseDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /mobile|iphone|ipod|iemobile|blackberry|android|opera mini/i.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (BOT_REGEX.test(userAgent)) {
      return new NextResponse(null, { status: 204 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.page || typeof body.page !== "string") {
      return new NextResponse(null, { status: 204 });
    }

    const page = body.page.trim().split(/[?#]/)[0];
    if (
      !/^\/[A-Za-z0-9/_-]{0,200}$/.test(page) ||
      page.startsWith("/sos-office")
    ) {
      return new NextResponse(null, { status: 204 });
    }

    // Ignore requests that don't come from our own site
    const origin = req.headers.get("origin");
    if (origin && new URL(origin).host !== req.nextUrl.host) {
      return new NextResponse(null, { status: 204 });
    }

    const device = parseDevice(userAgent);
        // Keep only the site name of the referrer, e.g. facebook.com
    let referrer: string | null = null;
    try {
      const host = new URL(String(body.referrer)).hostname;
      referrer =
        host && host !== req.nextUrl.hostname ? host.slice(0, 200) : null;
    } catch {
      // no referrer
    }

    // Must look like a real visitor id, otherwise skip it
    const visitorId = String(body.visitorId ?? "");
        if (!/^[A-Za-z0-9_-]{8,64}$/.test(visitorId)) {
      return new NextResponse(null, { status: 204 });
    }

    const supabase = createAdminClient();

        const { error } = await supabase.from("page_views").insert({
      page,
      referrer,
      device,
      visitor_id: visitorId,
    });
    if (error) console.error("page_views insert failed:", error.message);

    return new NextResponse(null, { status: 204 });
  } catch {
    // Fail silently so visitor experience is never interrupted
    return new NextResponse(null, { status: 204 });
  }
}
