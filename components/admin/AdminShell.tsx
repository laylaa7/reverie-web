import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Sidebar } from "./Sidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export async function AdminShell({ children }: AdminShellProps) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) redirect("/admin/login");
  const user = session.user;

  const serviceClient = createServiceClient();

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/admin/login");

  const [{ count: pendingCount }, { count: liveCount }] = await Promise.all([
    serviceClient
      .from("doctor_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    serviceClient
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "live"),
  ]);

  return (
    <div className="flex min-h-screen bg-[#060b18]">
      <Sidebar pendingCount={pendingCount ?? 0} liveCount={liveCount ?? 0} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">{children}</div>
    </div>
  );
}
