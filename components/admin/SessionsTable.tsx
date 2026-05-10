"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/lib/types";

export function SessionsTable() {
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("session_datetime", { ascending: false });
    setSessions(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  function statusBadge(status: string) {
    if (status === "live") return "live";
    if (status === "completed") return "approved";
    if (status === "cancelled") return "rejected";
    return "secondary";
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {["Patient", "Doctor", "Date & Time", "Status", "VR Scene", "Link"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-white/30 text-sm">
                Loading…
              </td>
            </tr>
          )}
          {!loading && sessions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-white/30 text-sm">
                No sessions yet
              </td>
            </tr>
          )}
          {sessions.map((s) => {
            const dt = s.session_datetime ? new Date(s.session_datetime) : null;
            const dateStr = dt
              ? dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "—";
            const timeStr = dt
              ? dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
              : "";

            return (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                  {s.patient_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                  {s.doctor_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                  <div>{dateStr}</div>
                  {timeStr && <div className="text-white/30 text-xs">{timeStr}</div>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant={
                      statusBadge(s.status) as
                        | "live"
                        | "approved"
                        | "rejected"
                        | "secondary"
                    }
                  >
                    {s.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                  {s.vr_scene_title ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {s.appointment_link ? (
                    <a
                      href={s.appointment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6B8AFF] hover:underline text-xs"
                    >
                      Join
                    </a>
                  ) : (
                    <span className="text-white/20 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
