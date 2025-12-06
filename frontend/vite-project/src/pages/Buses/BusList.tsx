// src/pages/Buses/BusList.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { BusType, RouteType } from "../../types/types";
import {
  getAllBuses,
  createBusApi,
  updateBusApi,
  deleteBusApi,
  assignRouteApi,
} from "../../api/busApi";
import { getAllRoutes } from "../../api/routeApi";

const PAGE_SIZE = 10;

export default function BusList() {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // modals
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [editing, setEditing] = useState<BusType | null>(null);
  const [assigning, setAssigning] = useState<BusType | null>(null);

  const [form, setForm] = useState({
    busNumber: "",
    driverName: "",
    driverPhone: "",
    routeId: "",
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  async function load() {
    try {
      setLoading(true);
      const [bRes, rRes] = await Promise.all([getAllBuses(), getAllRoutes()]);
      setBuses(bRes.data.buses || []);
      setRoutes(rRes.data.routes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return buses;
    return buses.filter((b) => {
      return (
        b.busNumber.toLowerCase().includes(s) ||
        b.driverName.toLowerCase().includes(s) ||
        (b.routeId?.name || "").toLowerCase().includes(s) ||
        (b.driverPhone || "").toLowerCase().includes(s)
      );
    });
  }, [buses, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // create
  const openCreate = () => {
    setForm({ busNumber: "", driverName: "", driverPhone: "", routeId: "" });
    setShowCreate(true);
  };
  const doCreate = async () => {
    try {
      const res = await createBusApi({
        ...form,
        routeId: form.routeId || null,
      });
      setBuses((p) => [res.data.bus, ...p]);
      setShowCreate(false);
      setToast({ type: "success", message: "Bus created" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Create failed",
      });
    }
  };

  // edit
  const openEdit = (b: BusType) => {
    setEditing(b);
    setForm({
      busNumber: b.busNumber,
      driverName: b.driverName,
      driverPhone: b.driverPhone || "",
      routeId: b.routeId?._id || "",
    });
    setShowEdit(true);
  };
  const doUpdate = async () => {
    if (!editing) return;
    try {
      const res = await updateBusApi(editing._id, {
        ...form,
        routeId: form.routeId || null,
      });
      setBuses((p) =>
        p.map((x) => (x._id === editing._id ? res.data.bus : x))
      );
      setShowEdit(false);
      setEditing(null);
      setToast({ type: "success", message: "Bus updated" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Update failed",
      });
    }
  };

  const doDelete = async (id: string) => {
    if (!confirm("Delete this bus?")) return;
    try {
      await deleteBusApi(id);
      setBuses((p) => p.filter((x) => x._id !== id));
      setToast({ type: "success", message: "Bus deleted" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Delete failed",
      });
    }
  };

  const openAssign = (b: BusType) => {
    setAssigning(b);
    setForm((f) => ({ ...f, routeId: b.routeId?._id || "" }));
    setShowAssign(true);
  };
  const doAssign = async () => {
    if (!assigning) return;
    try {
      const res = await assignRouteApi({
        busId: assigning._id,
        routeId: form.routeId || null,
      });
      setBuses((p) =>
        p.map((x) => (x._id === assigning._id ? res.data.bus : x))
      );
      setShowAssign(false);
      setAssigning(null);
      setToast({ type: "success", message: "Route assigned" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Assign failed",
      });
    }
  };

  const inputGlass =
    "w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="max-w-7xl mx-auto">
        {/* Header + search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-black tracking-tight">
              Buses
            </h2>
            <p className="text-sm text-slate-400">
              Manage buses, drivers and route assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search bus, driver, route..."
              className="w-64 rounded-full border border-white/15 bg-slate-900/70 px-4 py-2 text-sm text-white placeholder:text-slate-1000 shadow-sm shadow-slate-900/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-400 transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              Add Bus
            </button>
          </div>
        </div>

        {/* Glass table card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-sky-500 to-indigo-500" />

          <div className="p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>Total Buses: {filtered.length}</span>
              <span className="hidden sm:inline">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
              <table className="min-w-full table-auto text-sm text-slate-200">
                <thead>
                  <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-3 text-left">Bus</th>
                    <th className="px-6 py-3 text-left">Driver</th>
                    <th className="px-6 py-3 text-left">Phone</th>
                    <th className="px-6 py-3 text-left">Route</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td colSpan={6} className="px-6 py-5">
                            <div className="h-3 w-1/3 rounded bg-slate-700/50 animate-pulse" />
                          </td>
                        </tr>
                      ))
                    : pageItems.length === 0
                    ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-6 text-center text-slate-500"
                        >
                          No buses found. Try a different search.
                        </td>
                      </tr>
                      )
                    : pageItems.map((b, idx) => (
                        <tr
                          key={b._id}
                          className={`border-t border-white/5 ${
                            idx % 2 === 0
                              ? "bg-slate-900/40"
                              : "bg-slate-900/25"
                          } hover:bg-slate-800/40 transition-colors`}
                        >
                          <td className="px-6 py-4 align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-50">
                                {b.busNumber}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {b.createdAt
                                  ? new Date(
                                      b.createdAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <span className="text-sm text-slate-200">
                              {b.driverName}
                            </span>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <span className="text-sm text-slate-300">
                              {b.driverPhone || "-"}
                            </span>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200 border border-sky-500/30">
                              {b.routeId?.name || "No route"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center align-middle">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                                b.isOnline
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                  : "bg-slate-600/25 text-slate-200 border border-slate-500/40"
                              }`}
                            >
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                              {b.isOnline ? "Online" : "Offline"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right align-middle">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => openAssign(b)}
                                className="rounded-lg border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-500/25 transition-colors"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => openEdit(b)}
                                className="rounded-lg border border-amber-400/60 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200 hover:bg-amber-500/25 transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => doDelete(b._id)}
                                className="rounded-lg border border-rose-500/70 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200 hover:bg-rose-500/25 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 border border-white/10">
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-sky-200 font-semibold">
                      {page}
                    </span>
                    <span className="text-slate-400">/ {totalPages}</span>
                  </div>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 hover:bg-slate-800/80 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-xl px-4 py-2 text-sm shadow-lg backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-white/80" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create Bus" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bus Number
              </label>
              <input
                value={form.busNumber}
                onChange={(e) =>
                  setForm({ ...form, busNumber: e.target.value })
                }
                className={inputGlass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Name
              </label>
              <input
                value={form.driverName}
                onChange={(e) =>
                  setForm({ ...form, driverName: e.target.value })
                }
                className={inputGlass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Phone
              </label>
              <input
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
                className={inputGlass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assign Route (optional)
              </label>
              <select
                value={form.routeId}
                onChange={(e) =>
                  setForm({ ...form, routeId: e.target.value })
                }
                className={`${inputGlass} pr-8`}
              >
                <option value="" className="text-slate-700">
                  -- No route --
                </option>
                {routes.map((r) => (
                  <option
                    key={r._id}
                    value={r._id}
                    className="text-slate-900"
                  >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doCreate}
                className="rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-400 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && editing && (
        <Modal
          title="Edit Bus"
          onClose={() => {
            setShowEdit(false);
            setEditing(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bus Number
              </label>
              <input
                value={form.busNumber}
                onChange={(e) =>
                  setForm({ ...form, busNumber: e.target.value })
                }
                className={inputGlass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Name
              </label>
              <input
                value={form.driverName}
                onChange={(e) =>
                  setForm({ ...form, driverName: e.target.value })
                }
                className={inputGlass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver Phone
              </label>
              <input
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
                className={inputGlass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assign Route
              </label>
              <select
                value={form.routeId}
                onChange={(e) =>
                  setForm({ ...form, routeId: e.target.value })
                }
                className={`${inputGlass} pr-8`}
              >
                <option value="" className="text-slate-700">
                  -- No route --
                </option>
                {routes.map((r) => (
                  <option
                    key={r._id}
                    value={r._id}
                    className="text-slate-900"
                  >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => {
                  setShowEdit(false);
                  setEditing(null);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doUpdate}
                className="rounded-xl bg-gradient-to-tr from-amber-400 to-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-400/40 hover:from-amber-300 hover:to-sky-400 transition-all"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Modal */}
      {showAssign && assigning && (
        <Modal
          title={`Assign route to ${assigning.busNumber}`}
          onClose={() => {
            setShowAssign(false);
            setAssigning(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Route
              </label>
              <select
                value={form.routeId}
                onChange={(e) =>
                  setForm({ ...form, routeId: e.target.value })
                }
                className={`${inputGlass} pr-8`}
              >
                <option value="" className="text-slate-700">
                  -- Select route --
                </option>
                {routes.map((r) => (
                  <option
                    key={r._id}
                    value={r._id}
                    className="text-slate-900"
                  >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => {
                  setShowAssign(false);
                  setAssigning(null);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doAssign}
                className="rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-sky-400 transition-all"
              >
                Assign
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Glass modal with subtle scale/fade */
function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-6">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative mt-16 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950/85 shadow-2xl shadow-sky-500/40 backdrop-blur-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-[11px] text-slate-400">
              Update bus details and assignments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-1.5 text-slate-300 hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
