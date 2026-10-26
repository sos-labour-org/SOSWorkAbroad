"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMessage } from "./actions";

export function DeleteMessageButton({ messageId, senderName }: { messageId: string; senderName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete the message from "${senderName}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteMessage(messageId);
      if (!res.ok) {
        alert(res.error || "Failed to delete message");
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
      title="Delete message"
    >
      {isPending ? <Loader2 className="size-3.5 animate-spin text-red-600" /> : <Trash2 className="size-3.5" />}
    </button>
  );
}
