// src/pages/Routes/RouteList.tsx
import React, { useEffect, useState } from "react";
import {
  getAllRoutes,
  createRouteApi,
  updateRouteApi,
  deleteRouteApi,
} from "../../api/routeApi";
import type { RouteType } from "../../types/types";

export default function RouteList() {
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<RouteType | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getAllRoutes();
      setRoutes(res.data.routes || []);
    } finally {
      setLoading(false);
    }
  }

  const resetModal = () => {
    setShowCreate(false);
    setEditing(null);
    setForm({ name: "", description: "" });
  };

  const create = async () => {
    try {
      const res = await createRouteApi(form);
      setRoutes((p) => [res.data.route, ...p]);
      resetModal();
    } catch (err) {
      console.error(err);
    }
  };

  const update = async () => {
    if (!editing) return;
    try {
      const res = await updateRouteApi(editing._id, form);
      setRoutes((p) =>
        p.map((r) => (r._id === editing._id ? res.data.route : r))
      );
      resetModal();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete route?")) return;
    try {
      await deleteRouteApi(id);
      setRoutes((p) => p.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Routes
          </h2>
          <p className="text-sm text-slate-400">
            Manage transport routes, descriptions and assigned stops.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreate(true);
            setForm({ name: "", description: "" });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-400 transition-all duration-150"
        >
          <span className="text-lg leading-none">＋</span>
          <span>Add Route</span>
        </button>
      </div>

      {/* Glass card wrapper */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
        {/* Top gradient strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />

        {/* Table container */}
        <div className="p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
            <span>Total Routes: {routes.length}</span>
            {loading && <span className="animate-pulse">Refreshing...</span>}
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
            <table className="min-w-full table-auto text-sm text-slate-200">
              <thead>
                <tr className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 text-left">Route Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center">Stops</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Loading routes...
                    </td>
                  </tr>
                ) : routes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No routes created yet. Click “Add Route” to get started.
                    </td>
                  </tr>
                ) : (
                  routes.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={`border-t border-white/5 ${
                        idx % 2 === 0
                          ? "bg-slate-900/40"
                          : "bg-slate-900/20"
                      } hover:bg-slate-800/40 transition-colors`}
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-50">
                            {r.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle max-w-xs">
                        <p className="line-clamp-2 text-xs text-slate-400">
                          {r.description || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center align-middle">
                        <span className="inline-flex items-center justify-center rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-300">
                          {(r as any).stops?.length ?? 0} stops
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <button
                          onClick={() => {
                            setEditing(r);
                            setForm({
                              name: r.name,
                              description: r.description || "",
                            });
                          }}
                          className="mr-2 rounded-lg border border-slate-500/60 px-3 py-1 text-xs font-medium text-slate-100 hover:border-sky-400 hover:text-sky-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(r._id)}
                          className="rounded-lg border border-red-500/50 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit glass modal */}
      {(showCreate || editing) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={resetModal}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/80 p-6 shadow-2xl shadow-sky-500/40 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editing ? "Edit Route" : "Create Route"}
                </h3>
                <p className="text-xs text-slate-400">
                  {editing
                    ? "Update the route details below."
                    : "Fill in the details to add a new route."}
                </p>
              </div>
              <button
                onClick={resetModal}
                className="rounded-full border border-white/20 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Name
                </label>
                <input
                  className="w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Eg. Route 1 - North Zone"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  className="min-h-[90px] w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Short description of this route..."
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editing ? update : create}
                className="rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-400 transition-all"
              >
                {editing ? "Update Route" : "Create Route"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
