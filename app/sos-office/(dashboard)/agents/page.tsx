import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  UserCheck,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AgentStatusSelect, AgentReferralManager } from "./AgentControls";

const PAGE_SIZE = 15;

async function AgentsList({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const status = params.status || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = createAdminClient();

  // Metrics counts
  const [totalRes, newRes, approvedRes, applicantsWithRef] = await Promise.all([
    supabase.from("agent_applications").select("*", { count: "exact", head: true }),
    supabase.from("agent_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("agent_applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("applicants").select("referral_code").not("referral_code", "is", null),
  ]);

  // Build referral counts map: code -> number of applicants
  const referralCounts: Record<string, number> = {};
  for (const a of applicantsWithRef.data || []) {
    if (a.referral_code) {
      const c = a.referral_code.toUpperCase();
      referralCounts[c] = (referralCounts[c] || 0) + 1;
    }
  }

  // Query agents
  let query = supabase
    .from("agent_applications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,location.ilike.%${q}%,referral_code.ilike.%${q}%`
    );
  }

  const { data: agents, count } = await query.range(offset, offset + PAGE_SIZE - 1);

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const totalReferredCandidates = Object.values(referralCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment Agents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage partner recruiters across Ghana, review applications, and track candidate referrals.
          </p>
        </div>
      </div>

      {/* Stats Cards - Clean Professional Monochrome */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Total Applications</p>
              <Users className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{totalRes.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">New Leads (Pending)</p>
              <Clock className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{newRes.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Approved Agents</p>
              <UserCheck className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{approvedRes.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Candidates Referred</p>
              <Users className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{totalReferredCandidates}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="shadow-2xs">
        <CardContent className="p-4">
          <form method="GET" className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-8">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search agent name, phone, city, or referral code..."
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-3">
              <select
                name="status"
                defaultValue={status}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="new">New Applications</option>
                <option value="contacted">Contacted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                className="h-9 w-full rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-2xs"
              >
                Filter
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card className="shadow-2xs">
        <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Agent Directory</CardTitle>
            <CardDescription className="text-xs">
              Showing {agents?.length ?? 0} of {totalCount} total records
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {agents && agents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[50rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Agent Name & Location</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4 text-center">Referred</th>
                    <th className="py-3 px-4">Outreach Plan</th>
                    <th className="py-3 px-4">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agents.map((agent) => {
                    const cleanPhone = (agent.phone || "").replace(/[^\d]/g, "");
                    const whatsappNum = (agent.whatsapp || agent.phone || "").replace(/[^\d]/g, "");
                    const code = agent.referral_code ? agent.referral_code.toUpperCase() : null;
                    const referredCount = code ? (referralCounts[code] || 0) : 0;

                    const whatsappGreeting = encodeURIComponent(
                      `Hello ${agent.full_name}, this is SOS Labour Ghana reaching out regarding your application to become an SOS Recruitment Agent.`
                    );

                    return (
                      <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                        {/* Name & Location */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground text-sm">{agent.full_name}</p>
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                            <MapPin className="size-3 shrink-0 text-slate-400" />
                            <span>{agent.location || "Ghana"}</span>
                          </p>
                        </td>

                        {/* Contact info */}
                        <td className="py-3.5 px-4 space-y-1">
                          <div>
                            <a
                              href={`tel:${agent.phone}`}
                              className="font-mono text-[11px] font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Phone className="size-3 text-slate-400" />
                              <span>{agent.phone}</span>
                            </a>
                          </div>

                          {whatsappNum ? (
                            <div>
                              <a
                                href={`https://wa.me/${whatsappNum}?text=${whatsappGreeting}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-[11px] text-emerald-700 hover:underline"
                              >
                                <span>WhatsApp</span>
                                <ExternalLink className="size-2.5" />
                              </a>
                            </div>
                          ) : null}

                          {agent.email ? (
                            <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={agent.email}>
                              {agent.email}
                            </p>
                          ) : null}
                        </td>

                        {/* Status selector */}
                        <td className="py-3.5 px-4">
                          <AgentStatusSelect
                            agentId={agent.id}
                            currentStatus={agent.status || "new"}
                          />
                        </td>

                        {/* Referral Code manager */}
                        <td className="py-3.5 px-4">
                          <AgentReferralManager
                            agentId={agent.id}
                            agentName={agent.full_name}
                            currentCode={agent.referral_code}
                          />
                        </td>

                        {/* Referred Candidates */}
                        <td className="py-3.5 px-4 text-center">
                          {referredCount > 0 ? (
                            <Link
                              href={`/sos-office/applicants?q=${encodeURIComponent(code || "")}`}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                              title="View referred applicants"
                            >
                              <span>{referredCount}</span>
                              <ExternalLink className="size-2.5" />
                            </Link>
                          ) : (
                            <span className="text-muted-foreground font-mono">0</span>
                          )}
                        </td>

                        {/* About / Strategy */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          {agent.about ? (
                            <p className="text-[11px] text-muted-foreground line-clamp-2" title={agent.about}>
                              "{agent.about}"
                            </p>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No notes provided</span>
                          )}
                        </td>

                        {/* Applied Date */}
                        <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]">
                          {new Date(agent.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Users className="size-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-foreground">No agent applications found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {q || status ? "Try clearing your search or status filter." : "Agent leads submitted through /agents will appear here."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
              <p className="text-muted-foreground">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link
                    href={`/sos-office/agents?page=${page - 1}&q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 hover:bg-muted font-medium text-foreground transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Prev</span>
                  </Link>
                ) : null}
                {page < totalPages ? (
                  <Link
                    href={`/sos-office/agents?page=${page + 1}&q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 hover:bg-muted font-medium text-foreground transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">
          Loading agents directory...
        </div>
      }
    >
      <AgentsList searchParams={searchParams} />
    </Suspense>
  );
}
