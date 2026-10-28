import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdminAnyState } from "@/lib/admin-guard";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

async function Content() {
  await requireAdminAnyState();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-lg font-bold">
          SOS <span className="text-primary">Office</span>
        </p>
        <h1 className="mt-4 text-2xl font-bold">Choose a new password</h1>
        <p className="mt-1 text-muted-foreground">
          You signed in with a temporary password. Choose your own to continue.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}