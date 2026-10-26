"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Edit3, Key, Loader2, Sparkles } from "lucide-react";
import { updateAgentStatus, assignReferralCode } from "./actions";

interface AgentControlsProps {
  agentId: string;
  agentName: string;
  currentStatus: string;
  currentCode: string | null;
}

const statusOptions = [
  { value: "new", label: "New Lead", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "contacted", label: "Contacted", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { value: "approved", label: "Approved Agent", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { value: "rejected", label: "Rejected", color: "bg-rose-50 text-rose-800 border-rose-200" },
];

export function AgentStatusSelect({
  agentId,
  currentStatus,
}: {
  agentId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus || "new");
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const res = await updateAgentStatus(agentId, newStatus);
      if (!res.ok) {
        alert(res.error || "Failed to update status");
        setStatus(currentStatus);
      }
    });
  };

  const currentOption = statusOptions.find((s) => s.value === status) || statusOptions[0];

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className={`h-7 rounded-md border px-2 text-xs font-semibold uppercase tracking-wider outline-none transition-colors cursor-pointer ${currentOption.color} ${
          isPending ? "opacity-50" : ""
        }`}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-slate-800 font-normal normal-case">
            {opt.label}
          </option>
        ))}
      </select>
      {isPending ? <Loader2 className="size-3 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

export function AgentReferralManager({
  agentId,
  agentName,
  currentCode,
}: {
  agentId: string;
  agentName: string;
  currentCode: string | null;
}) {
  const [code, setCode] = useState(currentCode);
  const [isEditing, setIsEditing] = useState(!currentCode);
  const [inputVal, setInputVal] = useState(currentCode || "");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Generate a recommended code from name: e.g. "KWADJO-01"
  const generateSuggested = () => {
    const parts = agentName.trim().split(" ");
    const prefix = (parts[parts.length - 1] || parts[0] || "AGENT")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 8);
    const num = Math.floor(10 + Math.random() * 89);
    setInputVal(`${prefix}-${num}`);
  };

  const handleSave = () => {
    if (!inputVal.trim()) return;
    startTransition(async () => {
      const res = await assignReferralCode(agentId, inputVal.trim());
      if (res.ok && res.code) {
        setCode(res.code);
        setIsEditing(false);
      } else {
        alert(res.error || "Failed to assign referral code");
      }
    });
  };

  const copyLink = () => {
    if (!code) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://sosworkabroad.com";
    navigator.clipboard.writeText(`${origin}/?ref=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value.toUpperCase())}
          placeholder="e.g. ACCRA-01"
          className="h-7 w-28 rounded border border-border bg-white px-2 font-mono text-xs font-bold uppercase text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={generateSuggested}
          title="Auto-suggest code from name"
          className="inline-flex h-7 items-center gap-1 rounded border border-border bg-slate-50 px-2 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
        >
          <Sparkles className="size-3 text-amber-600" />
          <span>Suggest</span>
        </button>
        <button
          type="button"
          disabled={isPending || !inputVal.trim()}
          onClick={handleSave}
          className="inline-flex h-7 items-center justify-center rounded bg-primary px-2.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : "Save"}
        </button>
        {code ? (
          <button
            type="button"
            onClick={() => {
              setInputVal(code);
              setIsEditing(false);
            }}
            className="text-xs text-muted-foreground hover:underline"
          >
            Cancel
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
        {code}
      </span>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded transition-colors"
        title="Copy applicant referral link"
      >
        {copied ? (
          <>
            <Check className="size-3 text-emerald-600" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3" />
            <span>Copy Link</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          setInputVal(code || "");
          setIsEditing(true);
        }}
        className="text-muted-foreground hover:text-foreground"
        title="Edit Code"
      >
        <Edit3 className="size-3" />
      </button>
    </div>
  );
}
