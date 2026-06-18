import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { supabase, error: adminError } = await requireAdmin();
  if (adminError) return adminError;

  const [
    { count: totalDoctors },
    { count: pendingDoctors },
    { count: totalPatients },
    { count: totalSessions },
    { count: activeSessions },
    { data: recentApplications },
    { data: recentSessions },
  ] = await Promise.all([
    supabase.from("doctor_applications").select("*", { count: "exact", head: true }),
    supabase
      .from("doctor_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("consumer_profiles").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled"),
    supabase
      .from("doctor_applications")
      .select("id, full_name, specialization, email, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("appointments")
      .select("id, session_datetime, status, patient_name, doctor_name")
      .order("session_datetime", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    stats: {
      totalDoctors: totalDoctors ?? 0,
      pendingDoctors: pendingDoctors ?? 0,
      totalPatients: totalPatients ?? 0,
      totalSessions: totalSessions ?? 0,
      activeSessions: activeSessions ?? 0,
    },
    recentApplications: recentApplications ?? [],
    recentSessions: recentSessions ?? [],
  });
}
