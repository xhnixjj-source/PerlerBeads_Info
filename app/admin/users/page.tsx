"use client";

import { useCallback, useEffect, useState } from "react";

type Row = {
  id: string;
  email: string;
  role: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

const ROLES = ["super_admin", "content_admin", "order_admin", "supplier_admin"] as const;

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<(typeof ROLES)[number]>("content_admin");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const json = (await res.json()) as { data?: Row[]; error?: { message?: string } };
      if (!res.ok) {
        setError(json.error?.message ?? "Failed to load users");
        return;
      }
      setRows(json.data ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail.trim().toLowerCase(),
        password: newPassword,
        role: newRole,
      }),
    });
    const json = (await res.json()) as { error?: { message?: string } };
    if (!res.ok) {
      setError(json.error?.message ?? "Create failed");
      return;
    }
    setNewEmail("");
    setNewPassword("");
    await load();
  }

  async function updateRole(id: string, role: string) {
    setError(null);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const json = (await res.json()) as { error?: { message?: string } };
    if (!res.ok) {
      setError(json.error?.message ?? "Update failed");
      return;
    }
    await load();
  }

  async function removeUser(id: string, email: string) {
    if (!window.confirm(`Delete admin user ${email}? This cannot be undone.`)) return;
    setError(null);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    const json = (await res.json()) as { error?: { message?: string } };
    if (!res.ok) {
      setError(json.error?.message ?? "Delete failed");
      return;
    }
    await load();
  }

  async function resetPassword(id: string, email: string) {
    const pwd = window.prompt(`New password for ${email} (min 8 characters):`);
    if (pwd === null) return;
    if (pwd.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!window.confirm(`Reset password for ${email}?`)) return;
    setError(null);
    const res = await fetch(`/api/admin/users/${id}/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    const json = (await res.json()) as { error?: { message?: string } };
    if (!res.ok) {
      setError(json.error?.message ?? "Reset failed");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Admin users</h1>
        <p className="mt-1 text-sm text-slate-400">Super admins only. Actions are logged.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6">
        <h2 className="text-sm font-semibold text-slate-200">Add user</h2>
        <form onSubmit={(e) => void createUser(e)} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm">
            <span className="text-slate-400">Email</span>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Role</span>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as (typeof ROLES)[number])}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500"
            >
              Create
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-700/80">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No users
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.role}
                      onChange={(e) => void updateRole(r.id, e.target.value)}
                      className="rounded-lg border border-slate-600 bg-slate-950 px-2 py-1 text-slate-100"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {r.last_login ? new Date(r.last_login).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void resetPassword(r.id, r.email)}
                        className="rounded-lg border border-slate-600 px-2 py-1 text-xs hover:bg-slate-800"
                      >
                        Reset password
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeUser(r.id, r.email)}
                        className="rounded-lg border border-red-800/80 px-2 py-1 text-xs text-red-300 hover:bg-red-950/50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
