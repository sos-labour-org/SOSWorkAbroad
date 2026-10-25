import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  User,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { statusInfo } from "@/lib/statuses";
import { formatBytes, documentTypes } from "@/lib/documents";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ApplicantStatusUpdater,
  ApplicantNotesForm,
} from "./ApplicantControls";

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const supabase = createAdminClient();

  const [applicantRes, docsRes, paymentsRes] = await Promise.all([
    supabase.from("applicants").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("documents")
      .select("*")
      .eq("applicant_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("payments")
      .select("*")
      .eq("applicant_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!applicantRes.data) {
    notFound();
  }

  const applicant = applicantRes.data;
  const docs = docsRes.data || [];
  const payments = paymentsRes.data || [];

  // Generate signed URLs for all uploaded documents (valid 1 hour)
  const docsWithSignedUrls = await Promise.all(
    docs.map(async (doc) => {
      const { data } = await supabase.storage
        .from("applicant-documents")
        .createSignedUrl(doc.storage_path, 3600);
      return {
        ...doc,
        signedUrl: data?.signedUrl || null,
      };
    })
  );

  const status = statusInfo(applicant.status);
  const pkg =
    applicant.destination === "uae"
      ? siteConfig.packages.uae
      : siteConfig.packages.europe;

  const cleanPhone = (applicant.phone || "").replace(/[^\d]/g, "");
  const whatsappNumber = (applicant.whatsapp || applicant.phone || "").replace(
    /[^\d]/g,
    ""
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation */}
      <div>
        <Link
          href="/sos-office/applicants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to all applicants</span>
        </Link>
      </div>

      {/* Candidate Header Card */}
      <Card className="shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight">
                  {applicant.full_name}
                </h1>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold text-primary mt-1">
                Ref: {applicant.reference}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-muted text-foreground">
                {applicant.destination === "uae" ? "🇦🇪 UAE Jobs" : "🇪🇺 European Jobs"}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Registered on{" "}
                {new Date(applicant.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Details + Quick Contact */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact & Personal Info */}
        <Card className="shadow-2xs md:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span>Candidate Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <p className="text-muted-foreground font-medium">Phone Number</p>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href={`tel:${applicant.phone}`}
                  className="font-mono font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {applicant.phone}
                </a>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">WhatsApp</p>
              <div className="mt-1">
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                  >
                    <span>+{whatsappNumber}</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">Email Address</p>
              <div className="mt-1">
                {applicant.email ? (
                  <a
                    href={`mailto:${applicant.email}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {applicant.email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">Location / Region</p>
              <p className="mt-1 font-semibold text-foreground">
                {applicant.region || "—"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">Education Level</p>
              <p className="mt-1 font-semibold text-foreground">
                {applicant.education || "—"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground font-medium">Referred By Agent</p>
              <p className="mt-1 font-mono font-semibold text-foreground">
                {applicant.referral_code ? (
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px]">
                    Code: {applicant.referral_code}
                  </span>
                ) : (
                  "Direct (No Agent)"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Package & Payment Status */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              <span>Travel Package</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div>
              <p className="text-muted-foreground">Package Fee</p>
              <p className="text-2xl font-bold text-primary mt-0.5">
                {formatPrice(pkg.amount, pkg.currency)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Covers flight, medicals, & processing
              </p>
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-muted-foreground font-medium">Payment History</p>
              {payments.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border border-border p-2.5 bg-muted/30"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{formatPrice(p.amount, p.currency)}</span>
                        <span
                          className={`uppercase text-[10px] px-2 py-0.5 rounded-full ${
                            p.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      {p.provider_reference ? (
                        <p className="text-[10px] font-mono text-muted-foreground mt-1 truncate">
                          Ref: {p.provider_reference}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-muted-foreground">
                  No payment record on file yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Documents Section */}
      <Card className="shadow-2xs">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <span>Uploaded Verification Documents</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Review uploaded files. Documents are kept private and accessible only via signed URLs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {documentTypes.map((dt) => {
              const uploaded = docsWithSignedUrls.find(
                (d) => d.type === dt.type
              );

              return (
                <div
                  key={dt.type}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                    uploaded
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-border bg-muted/20 opacity-70"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">
                        {dt.label}
                      </span>
                      {uploaded ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="size-3" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Missing
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {dt.description}
                    </p>

                    {uploaded ? (
                      <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                        <p className="truncate font-mono text-[10px]">
                          {uploaded.original_name}
                        </p>
                        <p>{formatBytes(uploaded.size_bytes)}</p>
                      </div>
                    ) : null}
                  </div>

                  {uploaded && uploaded.signedUrl ? (
                    <div className="mt-4 pt-2 flex items-center gap-2">
                      <a
                        href={uploaded.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        <span>View File</span>
                      </a>
                      <a
                        href={uploaded.signedUrl}
                        download={uploaded.original_name}
                        className="inline-flex h-8 size-8 items-center justify-center rounded-lg border border-border bg-white hover:bg-muted text-muted-foreground transition-colors"
                        title="Download file"
                      >
                        <Download className="size-3.5" />
                      </a>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status & Processing Action Card */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Control */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>Update Candidate Status</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Advance the candidate along the recruitment and departure pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <ApplicantStatusUpdater
              applicantId={applicant.id}
              currentStatus={applicant.status}
            />
          </CardContent>
        </Card>

        {/* Private Office Notes */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>Private Admin Notes</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Internal notes visible only to the SOS Office admin team.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <ApplicantNotesForm
              applicantId={applicant.id}
              initialNotes={applicant.notes}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
