import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-guard";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "SOS Office",
  robots: { index: false, follow: false },
};

async function Shell({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return <AppShell>{children}</AppShell>;
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-svh w-full items-center justify-center bg-muted text-muted-foreground">
          <p className="text-sm">Loading SOS Office...</p>
        </div>
      }
    >
      <Shell>{children}</Shell>
    </Suspense>
  );
}