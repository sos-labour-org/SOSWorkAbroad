"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/sos-office/login/actions";

export function NavUser() {
  return (
    <div className="flex items-center justify-between gap-2.5 border-t border-border px-3 py-2.5 bg-background">
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar className="size-8 rounded-lg shrink-0">
          <AvatarFallback className="bg-primary text-on-primary text-xs font-bold rounded-lg">
            SA
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left leading-tight truncate">
          <span className="truncate font-semibold text-xs text-foreground">SOS Admin</span>
          <span className="truncate text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <ShieldCheck className="size-3 text-primary shrink-0" />
            <span>Verified Officer</span>
          </span>
        </div>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          title="Sign out of SOS Office"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-white text-slate-400 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer shadow-2xs"
        >
          <LogOut className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
