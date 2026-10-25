import "server-only";
import { redirect } from "next/navigation";
import { getCurrentApplicant } from "@/lib/applicant-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { documentTypes } from "@/lib/documents";

const PAID_STATUSES = ["paid", "medicals", "visa", "flight_booked", "deployed"];

export function hasPaid(status: string) {
  return PAID_STATUSES.includes(status);
}

export async function requireApplicant() {
  const applicant = await getCurrentApplicant();
  if (!applicant) redirect("/#packages");
  return applicant;
}

// For the review and payment steps: documents must be complete
export async function requireDocumentsComplete() {
  const applicant = await requireApplicant();
  if (hasPaid(applicant.status)) redirect("/apply/done");

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", applicant.id);

  if ((count ?? 0) < documentTypes.length) redirect("/apply/documents");
  return applicant;
}