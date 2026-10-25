"use client";

import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { applicantStatuses } from "@/lib/statuses";
import { updateApplicantStatus, updateApplicantNotes } from "../actions";

export function ApplicantStatusUpdater({
  applicantId,
  currentStatus,
}: {
  applicantId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) return;
    setStatus(newStatus);
    setLoading(true);
    setMessage(null);

    const res = await updateApplicantStatus(applicantId, newStatus);
    setLoading(false);

    if (res.error) {
      setMessage({ text: res.error, error: true });
    } else {
      setMessage({ text: "Status updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {applicantStatuses.map((s) => {
          const isSelected = status === s.value;
          return (
            <button
              key={s.value}
              type="button"
              disabled={loading}
              onClick={() => handleStatusChange(s.value)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-on-primary ring-2 ring-primary/30 shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {isSelected ? <Check className="size-3.5" /> : null}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>Saving status change...</span>
        </p>
      ) : null}

      {message ? (
        <p
          className={`text-xs font-medium ${
            message.error ? "text-destructive" : "text-emerald-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}

export function ApplicantNotesForm({
  applicantId,
  initialNotes,
}: {
  applicantId: string;
  initialNotes?: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateApplicantNotes(applicantId, notes);
    setLoading(false);

    if (res.error) {
      setMessage({ text: res.error, error: true });
    } else {
      setMessage({ text: "Notes saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Add private office notes (e.g. passport verified with boss, called on WhatsApp for medicals appointment, batch assignment)..."
        className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
      />

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          <span>Save Notes</span>
        </button>

        {message ? (
          <p
            className={`text-xs font-medium ${
              message.error ? "text-destructive" : "text-emerald-700"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
