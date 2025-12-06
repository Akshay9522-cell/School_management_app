import React, { useEffect, useState } from "react";
import { getStudents } from "../../api/studentApi";
import { getAllBuses } from "../../api/busApi";
import { assignBusInBulk, fetchRoute } from "../../api/assignStudentToBus";

export default function StudentAssignToBus() {
  const [students, setStudents] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [busId, setBusId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const s = await getStudents("");
    const b = await getAllBuses();
    const r = await fetchRoute();

    setStudents(s.data.data || []);
    setRoutes(r.data.routes || []);
    setBuses(b.data.buses || []);
    setLoading(false);
  };

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === students.length) {
      setSelected([]);
    } else {
      setSelected(students.map((s) => s._id));
    }
  };

  const handleAssign = async () => {
    if (!busId || selected.length === 0) {
      alert("Please select a bus and at least one student.");
      return;
    }

    await assignBusInBulk(busId, selected);
    alert("Bus Assigned Successfully!");
    setSelected([]);
  };

  const cardClass =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40";

  return (
    <div className="p-6 md:p-8 lg:p-10  bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Assign Students to Bus
            </h1>
            <p className="text-sm text-slate-700">
              Select a route, choose a bus, then pick students to assign.
            </p>
          </div>
          <div className="rounded-full bg-slate-900/70 px-4 py-1 text-xs text-slate-300 border border-white/10">
            Selected:{" "}
            <span className="font-semibold text-sky-300">
              {selected.length}
            </span>
          </div>
        </div>

        {/* Top selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Route card */}
          <div className={cardClass}>
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />
            <div className="p-4 md:p-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                Route
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="" className="text-slate-700">
                  -- Choose Route --
                </option>
                {routes.map((rt) => (
                  <option
                    key={rt._id}
                    value={rt._id}
                    className="text-slate-900"
                  >
                    {rt.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] text-slate-700">
                Optional filter; helps you visually group students by route
                plan.
              </p>
            </div>
          </div>

          {/* Bus card */}
          <div className={cardClass}>
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />
            <div className="p-4 md:p-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">
                Bus
              </label>
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="" className="text-slate-700">
                  -- Choose Bus --
                </option>
                {buses.map((bus) => (
                  <option
                    key={bus._id}
                    value={bus._id}
                    className="text-slate-900"
                  >
                    {bus.busNumber} – {bus.driverName}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] text-slate-700">
                Students selected below will be assigned to this bus.
              </p>
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className={cardClass}>
          <div className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Student List
              </h2>
              <p className="text-[11px] text-slate-700">
                Scroll and toggle the checkboxes to select students.
              </p>
            </div>
            <button
              onClick={selectAll}
              className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-500/25 transition-colors"
            >
              {selected.length === students.length && students.length > 0
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>

          {loading ? (
            <div className="p-4 md:p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-5 bg-slate-700/50 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
              {students.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-slate-400">
                  No students available.
                </li>
              ) : (
                students.map((s) => (
                  <li
                    key={s._id}
                    className={`flex items-center px-4 py-3 md:px-6 hover:bg-slate-900/40 transition-colors ${
                      selected.includes(s._id) ? "bg-slate-900/60" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(s._id)}
                      onChange={() => toggleSelection(s._id)}
                      className="mr-3 h-4 w-4 rounded border border-white/30 bg-slate-900/70 text-sky-500 focus:ring-sky-500"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-50">{s.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>{s.parentName}</span>
                        {s.classId && (
                          <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-sky-200 border border-sky-500/30">
                            {s.classId.name} – {s.classId.section}
                          </span>
                        )}
                        {s.admissionNo && (
                          <span className="rounded-full bg-slate-800/60 px-2 py-0.5">
                            Adm: {s.admissionNo}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Assign button */}
        <div className="flex justify-end">
          <button
            className="rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/40 hover:from-sky-400 hover:via-indigo-400 hover:to-fuchsia-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleAssign}
            disabled={!busId || selected.length === 0}
          >
            Assign Bus to {selected.length || 0} Student
            {selected.length === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}
