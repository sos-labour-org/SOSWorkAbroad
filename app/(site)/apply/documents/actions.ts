"use server";

import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentApplicant } from "@/lib/applicant-session";
import {
  documentTypes,
  extensionForMime,
  getDocumentType,
  MAX_FILE_BYTES,
} from "@/lib/documents";

const BUCKET = "applicant-documents";
const EDITABLE = ["registered", "documents_complete"];

type Fail = { ok: false; error: string };

export async function requestUpload(
  type: string,
  mime: string,
  size: number,
): Promise<{ ok: true; path: string; token: string } | Fail> {
  const applicant = await getCurrentApplicant();
  if (!applicant) {
    return { ok: false, error: "Your session has expired. Please start again." };
  }
  if (!EDITABLE.includes(applicant.status)) {
    return { ok: false, error: "Your documents have already been submitted." };
  }

  const def = getDocumentType(type);
  if (!def) return { ok: false, error: "Unknown document type." };
  if (!def.mimes.includes(mime)) {
    return { ok: false, error: "This file type is not allowed for this document." };
  }
  if (!(size > 0) || size > MAX_FILE_BYTES) {
    return { ok: false, error: "The file is too large. The limit is 10 MB." };
  }

  const path = `${applicant.id}/${type}-${randomUUID()}.${extensionForMime[mime]}`;
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, error: "Could not start the upload. Please try again." };
  }
  return { ok: true, path, token: data.token };
}

export async function confirmUpload(
  type: string,
  path: string,
  originalName: string,
): Promise<{ ok: true; sizeBytes: number } | Fail> {
  const applicant = await getCurrentApplicant();
  if (!applicant) {
    return { ok: false, error: "Your session has expired. Please start again." };
  }
  if (!EDITABLE.includes(applicant.status)) {
    return { ok: false, error: "Your documents have already been submitted." };
  }

  const def = getDocumentType(type);
  if (!def) return { ok: false, error: "Unknown document type." };

  // The file must be inside this applicant's own folder
  const prefix = `${applicant.id}/${type}-`;
  if (!path.startsWith(prefix)) {
    return { ok: false, error: "Invalid file." };
  }

  const supabase = createAdminClient();
  const fileName = path.slice(applicant.id.length + 1);

  // Check the file really arrived, and read its true size and type
  const { data: found } = await supabase.storage
    .from(BUCKET)
    .list(applicant.id, { search: fileName });
  const file = found?.find((f) => f.name === fileName);
  if (!file) {
    return { ok: false, error: "We could not find your upload. Please try again." };
  }

  const sizeBytes = Number(file.metadata?.size ?? 0);
  const mime = String(file.metadata?.mimetype ?? "");
  if (!def.mimes.includes(mime) || sizeBytes > MAX_FILE_BYTES) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: "That file isn't allowed. Please choose another." };
  }

  const { data: previous } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("applicant_id", applicant.id)
    .eq("type", type)
    .maybeSingle();

  const { error } = await supabase.from("documents").upsert(
    {
      applicant_id: applicant.id,
      type,
      storage_path: path,
      original_name: originalName.slice(0, 200),
      size_bytes: sizeBytes,
      mime_type: mime,
    },
    { onConflict: "applicant_id,type" },
  );

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: "We couldn't save your document. Please try again." };
  }

  // Replaced a document: delete the old file
  if (previous && previous.storage_path !== path) {
    await supabase.storage.from(BUCKET).remove([previous.storage_path]);
  }

  // All three in? Mark the application as documents complete
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", applicant.id);

  if ((count ?? 0) >= documentTypes.length && applicant.status === "registered") {
    await supabase
      .from("applicants")
      .update({ status: "documents_complete" })
      .eq("id", applicant.id);
  }

  return { ok: true, sizeBytes };
}