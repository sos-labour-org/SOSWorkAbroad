import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-lg font-bold">
          SOS <span className="text-primary">Office</span>
        </p>
        <h1 className="mt-4 text-2xl font-bold">Staff sign in</h1>
        <p className="mt-1 text-muted-foreground">
          Authorised staff only.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}