"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";

export function UsersTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (roleFilter !== "all") query = query.eq("role", roleFilter);
    const { data } = await query;
    setUsers(data ?? []);
    setLoading(false);
  }, [supabase, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  function roleBadge(role: string) {
    if (role === "admin") return "default";
    if (role === "doctor") return "verified";
    return "secondary";
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm h-9 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#2B4FD4]/60"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-white/[0.05] border border-white/10 text-white/70 text-sm focus:outline-none focus:border-[#2B4FD4]/60"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {["Name", "Email", "Role", "Onboarding Status", "Joined"].map((h) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-white/30 text-sm">
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                    {user.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={roleBadge(user.role) as "default" | "verified" | "secondary"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                    {user.onboarding_status || "—"}
                  </td>
                  <td className="px-4 py-3 text-white/40 whitespace-nowrap text-xs">
                    {new Date(user.created_at).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
