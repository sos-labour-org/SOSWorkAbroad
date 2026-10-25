import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicantStatuses, statusInfo } from "@/lib/statuses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PAGE_SIZE = 15;

async function ApplicantsList({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    route?: string;
    status?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const route = params.route || "";
  const status = params.status || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = createAdminClient();

  let query = supabase
    .from("applicants")
    .select(
      "id, reference, full_name, destination, phone, whatsapp, email, region, education, status, created_at",
      { count: "exact" }
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

  const { data: applicants, count, error } = await query.range(
    offset,
    offset + PAGE_SIZE - 1
  );

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const exportUrl = `/api/admin/applicants/export?q=${encodeURIComponent(
    q
  )}&route=${encodeURIComponent(route)}&status=${encodeURIComponent(status)}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage candidates, verify documents, track payments and departure batches.
          </p>
        </div>

        <a
          href={exportUrl}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white border border-border px-3 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors"
        >
          <Download className="size-3.5" />
          <span>Export to CSV</span>
        </a>
      </div>

      {/* Search & Filters Card */}
      <Card className="shadow-2xs">
        <CardContent className="p-4">
          <form method="GET" className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search name, reference, phone, email..."
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="md:col-span-3">
              <select
                name="route"
                defaultValue={route}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Destinations</option>
                <option value="uae">UAE Jobs</option>
                <option value="europe">European Jobs</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                name="status"
                defaultValue={status}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Statuses</option>
                {applicantStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex gap-2">
              <button
                type="submit"
                className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary hover:bg-primary/90 transition-colors"
              >
                Filter
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card className="shadow-2xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Candidates ({totalCount})
            </CardTitle>
            <CardDescription className="text-xs">
              Showing page {page} of {totalPages}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <p className="p-8 text-center text-xs text-destructive">
              Failed to load applicants: {error.message}
            </p>
          ) : applicants && applicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2.5 px-4">Reference</th>
                    <th className="py-2.5 px-4">Candidate</th>
                    <th className="py-2.5 px-4">Contact</th>
                    <th className="py-2.5 px-4">Destination</th>
                    <th className="py-2.5 px-4">Education</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Registered</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applicants.map((a) => {
                    const st = statusInfo(a.status);
                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          {a.reference}
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">
                          <div>{a.full_name}</div>
                          {a.region ? (
                            <div className="text-[10px] text-muted-foreground">
                              {a.region}
                            </div>
                          ) : null}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground space-y-0.5">
                          <div className="flex items-center gap-1 font-mono">
                            <Phone className="size-3" />
                            <span>{a.phone}</span>
                          </div>
                          {a.email ? (
                            <div className="flex items-center gap-1 text-[10px]">
                              <Mail className="size-3" />
                              <span className="truncate max-w-[140px]">
                                {a.email}
                              </span>
                            </div>
                          ) : null}
                        </td>
                        <td className="py-3 px-4 font-semibold uppercase text-[11px]">
                          {a.destination === "uae" ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              UAE
                            </span>
                          ) : (
                            <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              Europe
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {a.education || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.color}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(a.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/sos-office/applicants/${a.id}`}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-muted px-2.5 font-semibold text-primary hover:bg-primary hover:text-on-primary transition-colors text-[11px]"
                          >
                            <span>Manage</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Users className="size-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">No applicants found</p>
              <p className="mt-1">
                Try adjusting your search criteria or clear the filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {offset + 1} to{" "}
                {Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount}{" "}
                results
              </p>

              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link
                    href={`/sos-office/applicants?q=${encodeURIComponent(
                      q
                    )}&route=${encodeURIComponent(
                      route
                    )}&status=${encodeURIComponent(status)}&page=${page - 1}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-xs"
                  >
                    <ChevronLeft className="size-4" />
                  </Link>
                ) : (
                  <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 opacity-40 text-xs">
                    <ChevronLeft className="size-4" />
                  </span>
                )}

                <span className="px-3 text-xs font-semibold">
                  {page} / {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/sos-office/applicants?q=${encodeURIComponent(
                      q
                    )}&route=${encodeURIComponent(
                      route
                    )}&status=${encodeURIComponent(status)}&page=${page + 1}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-xs"
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 opacity-40 text-xs">
                    <ChevronRight className="size-4" />
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    route?: string;
    status?: string;
    page?: string;
  }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-muted-foreground">
          Loading applicants list...
        </div>
      }
    >
      <ApplicantsList searchParams={searchParams} />
    </Suspense>
  );
}
