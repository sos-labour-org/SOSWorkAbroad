import { Suspense } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Calendar,
  Smartphone,
  Globe,
  TrendingUp,
  FileCheck,
  CreditCard,
  UserCheck,
  Mail,
  AlertCircle,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { PAID_STATUSES, statusInfo } from "@/lib/statuses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VisitorChart, DailyVisitorPoint } from "@/components/VisitorChart";

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string | number;
  note?: string;
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <Card className="shadow-xs">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon ? (
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                highlight
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="size-4" />
            </div>
          ) : null}
        </div>
        <p
          className={`mt-2 text-2xl font-bold tracking-tight ${
            highlight ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </p>
        {note ? (
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

async function OverviewContent() {
  await requireAdmin();
  const supabase = createAdminClient();

  const count = (table: string) =>
    supabase.from(table).select("*", { count: "exact", head: true });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    total,
    documentsIn,
    paid,
    uae,
    europe,
    newAgents,
    messages,
    paidPayments,
    recent,
    viewsData,
  ] = await Promise.all([
    count("applicants"),
    count("applicants").eq("status", "documents_complete"),
    count("applicants").in("status", PAID_STATUSES),
    count("applicants").eq("destination", "uae"),
    count("applicants").eq("destination", "europe"),
    count("agent_applications").eq("status", "new"),
    count("contact_messages"),
    supabase.from("payments").select("amount, currency").eq("status", "paid"),
    supabase
      .from("applicants")
      .select("id, reference, full_name, destination, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    // Query page views from the last 30 days
    supabase
      .from("page_views")
      .select("page, referrer, device, visitor_id, created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true }),
  ]);

  const isTableMissing = !!viewsData.error;
  const rawViews = viewsData.data || [];

  // Visitor analytics processing
  let todayViewsCount = 0;
  const todayVisitorsSet = new Set<string>();
  let weekViewsCount = 0;
  const weekVisitorsSet = new Set<string>();
  const monthVisitorsSet = new Set<string>();

  const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
  const pageMap: Record<string, number> = {};
  const referrerMap: Record<string, number> = {};
  const deviceMap: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };

  // Initialize last 14 days in dailyMap
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { views: 0, visitors: new Set<string>() };
  }

  for (const v of rawViews) {
    const createdAt = v.created_at;
    const vid = v.visitor_id;
    const dateKey = createdAt.split("T")[0];

    // Today
    if (createdAt >= todayStart) {
      todayViewsCount++;
      if (vid) todayVisitorsSet.add(vid);
    }

    // 7 Days
    if (createdAt >= sevenDaysAgo) {
      weekViewsCount++;
      if (vid) weekVisitorsSet.add(vid);
    }

    // 30 Days
    if (vid) monthVisitorsSet.add(vid);

    // Daily chart (last 14 days)
    if (dailyMap[dateKey]) {
      dailyMap[dateKey].views++;
      if (vid) dailyMap[dateKey].visitors.add(vid);
    }

    // Top Pages
    pageMap[v.page] = (pageMap[v.page] ?? 0) + 1;

    // Referrers
    const ref = v.referrer ? v.referrer.replace(/^https?:\/\//, "").split("/")[0] : "Direct";
    referrerMap[ref] = (referrerMap[ref] ?? 0) + 1;

    // Devices
    const dev = (v.device || "desktop").toLowerCase();
    deviceMap[dev] = (deviceMap[dev] ?? 0) + 1;
  }

  const chartData: DailyVisitorPoint[] = Object.entries(dailyMap).map(
    ([date, info]) => ({
      date,
      views: info.views,
      visitors: info.visitors.size,
    })
  );

  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topReferrers = Object.entries(referrerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalDeviceCount =
    deviceMap.mobile + deviceMap.desktop + deviceMap.tablet || 1;
  const mobilePercent = Math.round(
    ((deviceMap.mobile + deviceMap.tablet) / totalDeviceCount) * 100
  );

  const totalApplicantsCount = total.count ?? 0;
  const conversionRate =
    monthVisitorsSet.size > 0
      ? ((totalApplicantsCount / monthVisitorsSet.size) * 100).toFixed(1) + "%"
      : "—";

  // Collected revenue
  const collected: Record<string, number> = {};
  for (const p of paidPayments.data ?? []) {
    collected[p.currency] = (collected[p.currency] ?? 0) + Number(p.amount);
  }
  const collectedText =
    Object.entries(collected)
      .map(([currency, amount]) => formatPrice(amount, currency))
      .join(" + ") || "GH₵ 0";

  return (
    <div className="space-y-8">
      {isTableMissing ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm">
          <AlertCircle className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Visitor Tracking Table Not Yet Created in Supabase</p>
            <p className="mt-1 text-xs text-amber-800">
              Run the SQL in{" "}
              <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">
                supabase/migrations/page_views.sql
              </code>{" "}
              in your Supabase SQL Editor to start recording live visitor analytics.
            </p>
          </div>
        </div>
      ) : null}

      {/* Traffic & Visitor Analytics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Traffic & Visitors</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time traffic and visitor trends on your public website
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Visitors"
            value={todayVisitorsSet.size}
            note={`${todayViewsCount} page views today`}
            icon={Eye}
            highlight
          />
          <StatCard
            label="7 Days Visitors"
            value={weekVisitorsSet.size}
            note={`${weekViewsCount} views past week`}
            icon={Calendar}
          />
          <StatCard
            label="30 Days Visitors"
            value={monthVisitorsSet.size}
            note={`${rawViews.length} views past month`}
            icon={Users}
          />
          <StatCard
            label="Applications Started"
            value={totalApplicantsCount}
            note={`Conversion rate: ${conversionRate}`}
            icon={TrendingUp}
            highlight
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* Main 14-day Chart */}
          <div className="lg:col-span-2">
            <VisitorChart data={chartData} />
          </div>

          {/* Top Pages & Sources Breakdown */}
          <div className="space-y-4">
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Top Pages</span>
                  <Globe className="size-3.5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {topPages.length > 0 ? (
                  topPages.map(([page, hits]) => (
                    <div
                      key={page}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-muted-foreground truncate max-w-[180px]">
                        {page}
                      </span>
                      <span className="font-semibold text-foreground">
                        {hits} views
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2">
                    No page views recorded yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Traffic Sources</span>
                  <Smartphone className="size-3.5 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="text-xs">
                  {mobilePercent}% mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {topReferrers.length > 0 ? (
                  topReferrers.map(([source, count]) => (
                    <div
                      key={source}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground truncate max-w-[180px]">
                        {source}
                      </span>
                      <span className="font-semibold text-foreground">
                        {count} visits
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2">
                    No traffic sources recorded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Operations & Recruitment Overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Recruitment Operations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Application pipelines, documentation, and payments
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Applicants"
            value={total.count ?? 0}
            icon={Users}
          />
          <StatCard
            label="Documents Uploaded"
            value={documentsIn.count ?? 0}
            note="Ready for payment"
            icon={FileCheck}
          />
          <StatCard
            label="Paid Packages"
            value={paid.count ?? 0}
            note="Verified departures"
            icon={CreditCard}
            highlight
          />
          <StatCard
            label="Funds Collected"
            value={collectedText}
            note="One-time travel packages"
            icon={TrendingUp}
          />
          <StatCard
            label="UAE Applicants"
            value={uae.count ?? 0}
            note="November 2026 departure"
          />
          <StatCard
            label="Europe Applicants"
            value={europe.count ?? 0}
            note="Direct route"
          />
          <StatCard
            label="New Agent Leads"
            value={newAgents.count ?? 0}
            note="Pending review"
            icon={UserCheck}
          />
          <StatCard
            label="Contact Messages"
            value={messages.count ?? 0}
            icon={Mail}
          />
        </div>
      </section>

      {/* Latest Applicants Table */}
      <section>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest Applicants</CardTitle>
              <CardDescription>
                Most recent candidate registrations awaiting processing
              </CardDescription>
            </div>
            <Link
              href="/sos-office/applicants"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all applicants →
            </Link>
          </CardHeader>
          <CardContent>
            {recent.data && recent.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-2.5 pr-4 font-semibold">Reference</th>
                      <th className="py-2.5 pr-4 font-semibold">Name</th>
                      <th className="py-2.5 pr-4 font-semibold">Route</th>
                      <th className="py-2.5 pr-4 font-semibold">Status</th>
                      <th className="py-2.5 font-semibold">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recent.data.map((a) => {
                      const status = statusInfo(a.status);
                      return (
                        <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 pr-4 font-mono font-semibold text-primary">
                            {a.reference}
                          </td>
                          <td className="py-3 pr-4 font-medium text-foreground">
                            {a.full_name}
                          </td>
                          <td className="py-3 pr-4 uppercase text-xs font-semibold text-muted-foreground">
                            {a.destination}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No applicants registered yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">
          Loading overview data...
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}