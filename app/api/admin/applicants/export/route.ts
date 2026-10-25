import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const route = searchParams.get("route");
  const status = searchParams.get("status");

  const supabase = createAdminClient();
  let query = supabase
    .from("applicants")
    .select(
      "reference, full_name, destination, phone, whatsapp, email, region, education, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (route && (route === "uae" || route === "europe")) {
    query = query.eq("destination", route);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,reference.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error || !data) {
    return new NextResponse("Failed to export data", { status: 500 });
  }

  const headers = [
    "Reference",
    "Full Name",
    "Destination",
    "Phone",
    "WhatsApp",
    "Email",
    "Region",
    "Education",
    "Status",
    "Registered At",
  ];

  const escapeCSV = (val: string | null | undefined) => {
    if (!val) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = data.map((a) => [
    escapeCSV(a.reference),
    escapeCSV(a.full_name),
    escapeCSV(a.destination?.toUpperCase()),
    escapeCSV(a.phone),
    escapeCSV(a.whatsapp),
    escapeCSV(a.email),
    escapeCSV(a.region),
    escapeCSV(a.education),
    escapeCSV(a.status),
    escapeCSV(new Date(a.created_at).toISOString()),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\r\n"
  );

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sos-applicants-${new Date()
        .toISOString()
        .split("T")[0]}.csv"`,
    },
  });
}
