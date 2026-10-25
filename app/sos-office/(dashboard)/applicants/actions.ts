"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicantStatuses } from "@/lib/statuses";

export async function updateApplicantStatus(
  applicantId: string,
  newStatus: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await requireAdmin();

    const valid = applicantStatuses.some((s) => s.value === newStatus);
    if (!valid) {
      return { error: "Invalid status value selected." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("applicants")
      .update({ status: newStatus })
      .eq("id", applicantId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/sos-office/applicants");
    revalidatePath(`/sos-office/applicants/${applicantId}`);
    revalidatePath("/sos-office");

    return { success: true };
  } catch {
    return { error: "Failed to update applicant status." };
  }
}

export async function updateApplicantNotes(
  applicantId: string,
  notes: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("applicants")
      .update({ notes: notes.trim() })
      .eq("id", applicantId);

    if (error) {
      if (error.code === "PGRST204" || error.message.includes("column")) {
        return {
          error:
            "The notes column does not exist in Supabase yet. Run: ALTER TABLE public.applicants ADD COLUMN IF NOT EXISTS notes text;",
        };
      }
      return { error: error.message };
    }

    revalidatePath(`/sos-office/applicants/${applicantId}`);
    return { success: true };
  } catch {
    return { error: "Failed to update notes." };
  }
}
