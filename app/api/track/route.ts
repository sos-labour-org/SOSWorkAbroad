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

    const page = body.page.trim();
    // Do not track admin routes
    if (page.startsWith("/sos-office")) {
      return new NextResponse(null, { status: 204 });
    }

    const device = parseDevice(userAgent);
    const referrer = body.referrer ? String(body.referrer).slice(0, 500) : null;
    const visitorId = body.visitorId
      ? String(body.visitorId).slice(0, 100)
      : "anon";

    const supabase = createAdminClient();

    await supabase.from("page_views").insert({
      page: page.slice(0, 255),
      referrer,
      device,
      visitor_id: visitorId,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Fail silently so visitor experience is never interrupted
    return new NextResponse(null, { status: 204 });
  }
}
