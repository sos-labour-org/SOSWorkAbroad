import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeleteMessageButton } from "./MessageControls";

const PAGE_SIZE = 15;

async function MessagesList({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = createAdminClient();

  const now = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // Metrics counts
  const [totalRes, todayRes, weekRes] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
  ]);

  let query = supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`
    );
  }

  const { data: messages, count } = await query.range(offset, offset + PAGE_SIZE - 1);

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Public Messages & Inquiries</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Incoming inquiries submitted through the public website contact form.
          </p>
        </div>
      </div>

      {/* Stats Cards - Clean Professional Monochrome */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Total Inquiries</p>
              <Mail className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{totalRes.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Received Today</p>
              <Clock className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{todayRes.count ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <p className="text-xs font-medium">Past 7 Days</p>
              <MessageSquare className="size-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mt-2">{weekRes.count ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-2xs">
        <CardContent className="p-4">
          <form method="GET" className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search sender name, phone, email, or message keyword..."
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-2xs shrink-0"
            >
              Search
            </button>
            {q ? (
              <Link
                href="/sos-office/messages"
                className="h-9 px-3 flex items-center justify-center rounded-lg border border-border bg-white text-xs font-medium text-muted-foreground hover:bg-muted transition-colors shrink-0"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const cleanPhone = (msg.phone || "").replace(/[^\d]/g, "");
            const whatsappGreeting = encodeURIComponent(
              `Hello ${msg.name}, thank you for reaching out to SOS Work Abroad. Regarding your inquiry: "${msg.message.slice(0, 100)}..." How can we assist you today?`
            );

            return (
              <Card key={msg.id} className="shadow-2xs hover:border-slate-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Sender Info & Contact */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {msg.name ? msg.name.slice(0, 2).toUpperCase() : <User className="size-3.5" />}
                        </div>
                        <h3 className="font-semibold text-sm text-foreground">{msg.name}</h3>
                        <span className="text-[11px] text-muted-foreground">•</span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                        <a
                          href={`tel:${msg.phone}`}
                          className="font-mono font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Phone className="size-3 text-slate-400" />
                          <span>{msg.phone}</span>
                        </a>

                        {msg.email ? (
                          <a
                            href={`mailto:${msg.email}`}
                            className="hover:text-primary transition-colors flex items-center gap-1 truncate max-w-[200px]"
                          >
                            <Mail className="size-3 text-slate-400" />
                            <span>{msg.email}</span>
                          </a>
                        ) : null}
                      </div>

                      {/* Message Content */}
                      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </div>
                    </div>

                    {/* Quick Response Actions */}
                    <div className="flex items-center md:flex-col gap-2 shrink-0 md:min-w-[140px] pt-1">
                      {cleanPhone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${whatsappGreeting}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <Send className="size-3" />
                          <span>Reply WhatsApp</span>
                        </a>
                      ) : null}

                      <a
                        href={`tel:${msg.phone}`}
                        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <Phone className="size-3 text-slate-400" />
                        <span>Call Sender</span>
                      </a>

                      <div className="md:w-full flex justify-end">
                        <DeleteMessageButton messageId={msg.id} senderName={msg.name} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="shadow-2xs">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              <Mail className="size-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-foreground">No messages found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {q ? "Try clearing your search keyword." : "Inquiries submitted through the public Contact page will appear here."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs bg-white rounded-xl shadow-2xs">
            <p className="text-muted-foreground">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              {page > 1 ? (
                <Link
                  href={`/sos-office/messages?page=${page - 1}&q=${encodeURIComponent(q)}`}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 hover:bg-muted font-medium text-foreground transition-colors"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Prev</span>
                </Link>
              ) : null}
              {page < totalPages ? (
                <Link
                  href={`/sos-office/messages?page=${page + 1}&q=${encodeURIComponent(q)}`}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 hover:bg-muted font-medium text-foreground transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">
          Loading messages inbox...
        </div>
      }
    >
      <MessagesList searchParams={searchParams} />
    </Suspense>
  );
}
