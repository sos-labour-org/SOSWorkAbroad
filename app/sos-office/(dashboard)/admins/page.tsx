import { Suspense } from "react";
import { requireOwner } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddAdminForm, RemoveAdminButton } from "./AdminControls";

async function AdminsContent() {
  const me = await requireOwner();

  const { data: admins } = await createAdminClient()
    .from("admins")
    .select("user_id, email, full_name, is_owner, must_change_password, created_at")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admins</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add the people who can sign in to the SOS Office. They get a temporary
          password and must choose their own at first sign in.
        </p>
      </div>

      <Card className="shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Add a new admin</CardTitle>
          <CardDescription className="text-xs">
            Send the temporary password to them yourself, for example on WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddAdminForm />
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-2xs">
        <CardHeader className="border-b border-border p-4 pb-2">
          <CardTitle className="text-sm font-semibold">
            Current admins ({admins?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50 font-semibold text-muted-foreground">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(admins ?? []).map((a) => {
                  const isMe = a.user_id === me.user.id;
                  return (
                    <tr key={a.user_id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {a.full_name || "—"}
                        {isMe ? (
                          <span className="ml-2 text-[10px] text-muted-foreground">
                            (you)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {a.is_owner ? "Owner" : "Admin"}
                      </td>
                      <td className="px-4 py-3">
                        {a.must_change_password ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            Needs new password
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isMe ? null : (
                          <RemoveAdminButton
                            userId={a.user_id}
                            name={a.full_name || a.email || "this admin"}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-muted-foreground">
          Loading admins...
        </div>
      }
    >
      <AdminsContent />
    </Suspense>
  );
}