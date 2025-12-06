// src/pages/Stops/StopList.tsx
import React, { useEffect, useState } from "react";
import { getAllStops, createStopApi, updateStopApi, deleteStopApi } from "../../api/stopApi";
import { getAllRoutes } from "../../api/routeApi";

export default function StopList() {
  const [stops, setStops] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", lat: "", lng: "", order: 0, routeId: "" });
  const [editing, setEditing] = useState<any | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [s, r] = await Promise.all([getAllStops(), getAllRoutes()]);
    setStops(s.data.stops || []);
    setRoutes(r.data.routes || []);
    setLoading(false);
  }

  const create = async () => {
    try {
      const payload = { name: form.name, lat: Number(form.lat), lng: Number(form.lng), order: form.order, routeId: form.routeId };
      const res = await createStopApi(payload);
      setStops((p) => [res.data.stop, ...p]);
      setShow(false);
    } catch (err) { console.error(err); }
  };
  const update = async () => {
    if (!editing) return;
    try {
      const res = await updateStopApi(editing._id, { name: form.name, lat: Number(form.lat), lng: Number(form.lng), order: form.order, routeId: form.routeId });
      setStops((p) => p.map(x => x._id === editing._id ? res.data.stop : x));
      setEditing(null); setShow(false);
    } catch (err) { console.error(err); }
  };
  const remove = async (id: string) => { if (!confirm("Delete stop?")) return; await deleteStopApi(id); setStops(p => p.filter(x => x._id !== id)); };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Stops</h2><button onClick={() => { setShow(true); setEditing(null); setForm({ name: "", lat: "", lng: "", order: 0, routeId: "" }); }} className="px-3 py-1 bg-slate-900 text-white rounded">Add Stop</button></div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead><tr className="bg-gray-50"><th className="px-4 py-2">Name</th><th className="px-4 py-2">Lat/Lng</th><th className="px-4 py-2">Route</th><th className="px-4 py-2">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="p-4">Loading...</td></tr> : stops.map(s => (
              <tr key={s._id} className="border-t">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.lat}, {s.lng}</td>
                <td className="px-4 py-3">{s.routeId?.name || "-"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => { setEditing(s); setForm({ name: s.name, lat: s.lat?.toString() || "", lng: s.lng?.toString() || "", order: s.order || 0, routeId: s.routeId?._id || "" }); setShow(true); }} className="mr-2 px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => remove(s._id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {show && (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShow(false)} />
          <div className="relative bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit Stop" : "Add Stop"}</h3>
            <label className="block text-sm">Name</label>
            <input className="w-full border p-2 rounded mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="block text-sm">Lat</label>
            <input className="w-full border p-2 rounded mb-2" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <label className="block text-sm">Lng</label>
            <input className="w-full border p-2 rounded mb-2" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            <label className="block text-sm">Route</label>
            <select className="w-full border p-2 rounded mb-2" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })}>
              <option value="">-- Select --</option>
              {routes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShow(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={editing ? update : create} className="px-3 py-1 bg-slate-900 text-white rounded">{editing ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
