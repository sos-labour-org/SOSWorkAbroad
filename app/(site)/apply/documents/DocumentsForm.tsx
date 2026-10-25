"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  GraduationCap,
  Loader2,
  Upload,
} from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";
import {
  documentTypes,
  formatBytes,
  MAX_FILE_BYTES,
  type DocumentType,
} from "@/lib/documents";
import { confirmUpload, requestUpload } from "./actions";

type Item = {
  status: "idle" | "uploading" | "done";
  fileName?: string;
  sizeBytes?: number;
  error?: string;
};

type SavedDoc = {
  type: string;
  original_name: string | null;
  size_bytes: number | null;
};

const icons = {
  passport: BookOpen,
  cv: FileText,
  certificate: GraduationCap,
};

export default function DocumentsForm({ saved }: { saved: SavedDoc[] }) {
  const [items, setItems] = useState<Record<DocumentType, Item>>(() => {
    const start = {} as Record<DocumentType, Item>;
    for (const def of documentTypes) {
      const existing = saved.find((d) => d.type === def.type);
      start[def.type] = existing
        ? {
            status: "done",
            fileName: existing.original_name ?? "Uploaded file",
            sizeBytes: existing.size_bytes ?? undefined,
          }
        : { status: "idle" };
    }
    return start;
  });

  const doneCount = documentTypes.filter(
    (d) => items[d.type].status === "done",
  ).length;
  const allDone = doneCount === documentTypes.length;

  function update(type: DocumentType, patch: Item) {
    setItems((current) => ({ ...current, [type]: patch }));
  }

  async function handleFile(type: DocumentType, file: File) {
    const def = documentTypes.find((d) => d.type === type)!;
    const previous = items[type];

    if (!def.mimes.includes(file.type)) {
      update(type, {
        ...previous,
        error: "This file type is not allowed. Use a JPG, PNG or PDF file.",
      });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      update(type, {
        ...previous,
        error: `This file is ${formatBytes(file.size)}. The limit is 10 MB.`,
      });
      return;
    }

    update(type, { status: "uploading", fileName: file.name });

    const ticket = await requestUpload(type, file.type, file.size);
    if (!ticket.ok) {
      update(type, { ...previous, error: ticket.error });
      return;
    }

    const supabase = createBrowserClient();
    const { error } = await supabase.storage
      .from("applicant-documents")
      .uploadToSignedUrl(ticket.path, ticket.token, file, {
        contentType: file.type,
      });
    if (error) {
      update(type, {
        ...previous,
        error: "The upload failed. Check your connection and try again.",
      });
      return;
    }

    const confirmed = await confirmUpload(type, ticket.path, file.name);
    if (!confirmed.ok) {
      update(type, { ...previous, error: confirmed.error });
      return;
    }

    update(type, {
      status: "done",
      fileName: file.name,
      sizeBytes: confirmed.sizeBytes,
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Your documents</h2>
        <p className="rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-primary">
          {doneCount} of {documentTypes.length} uploaded
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {documentTypes.map((def) => {
          const item = items[def.type];
          const Icon = icons[def.type];
          const uploading = item.status === "uploading";
          const done = item.status === "done";

          return (
            <li
              key={def.type}
              className={`rounded-2xl border-2 p-5 ${
                done ? "border-primary bg-muted/50" : "border-border bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    done
                      ? "bg-primary text-on-primary"
                      : "bg-muted text-primary"
                  }`}
                >
                  {done ? (
                    <Check size={24} aria-hidden="true" />
                  ) : (
                    <Icon size={24} aria-hidden="true" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">{def.label}</h3>
                  <p className="text-muted-foreground">{def.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {def.tips}
                  </p>

                  <div role="status" aria-live="polite" className="mt-3">
                    {uploading ? (
                      <p className="flex items-center gap-2 font-medium text-primary">
                        <Loader2
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                        Uploading {item.fileName}...
                      </p>
                    ) : null}
                    {done ? (
                      <p className="break-all font-medium">
                        {item.fileName}
                        {item.sizeBytes ? (
                          <span className="ml-2 font-normal text-muted-foreground">
                            {formatBytes(item.sizeBytes)}
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                    {item.error ? (
                      <p className="font-medium text-destructive">
                        {item.error}
                      </p>
                    ) : null}
                  </div>

                  <label
                    className={`mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 font-semibold focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                      uploading
                        ? "pointer-events-none opacity-60"
                        : done
                          ? "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary"
                          : "bg-primary text-on-primary hover:opacity-90"
                    }`}
                  >
                    <Upload size={18} aria-hidden="true" />
                    {done ? "Replace file" : "Choose file"}
                    <input
                      type="file"
                      className="sr-only"
                      accept={def.mimes.join(",")}
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) handleFile(def.type, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        {allDone ? (
          <Link
            href="/apply/review"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Continue to review
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-200 px-8 py-4 text-lg font-semibold text-slate-500"
          >
            Upload all {documentTypes.length} documents to continue
          </button>
        )}
      </div>
    </div>
  );
}