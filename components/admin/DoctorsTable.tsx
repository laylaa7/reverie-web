"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import type { DoctorProfile } from "@/lib/types";

type VerificationStatus = "pending" | "verified" | "rejected";

const STATUS_CYCLE: Record<VerificationStatus, VerificationStatus> = {
  pending: "verified",
  verified: "rejected",
  rejected: "pending",
};

export function DoctorsTable() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("doctor_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setDoctors(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  async function toggleVerification(id: string, current: VerificationStatus) {
    setToggling(id);
    const next = STATUS_CYCLE[current];
    await supabase.from("doctor_profiles").update({ verification_status: next }).eq("id", id);
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verification_status: next } : d))
    );
    setToggling(null);
  }

  function verBadge(v: string) {
    if (v === "verified") return "verified";
    if (v === "rejected") return "rejected";
    return "pending";
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-x-auto">
      <table className="w-full text-sm min-w-[750px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {["Name", "Specialization", "Verification", "Rating", "Exp.", "Languages", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-white/30 text-sm">
                Loading…
              </td>
            </tr>
          )}
          {!loading && doctors.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-white/30 text-sm">
                No doctors yet
              </td>
            </tr>
          )}
          {doctors.map((doc) => (
            <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{doc.full_name}</td>
              <td className="px-4 py-3 text-white/70 whitespace-nowrap">{doc.specialization}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge
                  variant={
                    verBadge(doc.verification_status) as "verified" | "rejected" | "pending"
                  }
                >
                  {doc.verification_status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                {doc.rating != null ? doc.rating.toFixed(1) : "—"}
              </td>
              <td className="px-4 py-3 text-white/60 whitespace-nowrap">{doc.experience}y</td>
              <td className="px-4 py-3 text-white/50 whitespace-nowrap">{doc.languages}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() =>
                    toggleVerification(doc.id, doc.verification_status as VerificationStatus)
                  }
                  disabled={toggling === doc.id}
                  className="px-3 py-1 rounded-md border border-white/10 text-white/60 text-xs hover:border-[#2B4FD4]/50 hover:text-white transition-colors disabled:opacity-40"
                >
                  {toggling === doc.id
                    ? "Saving…"
                    : `→ ${STATUS_CYCLE[doc.verification_status as VerificationStatus]}`}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
