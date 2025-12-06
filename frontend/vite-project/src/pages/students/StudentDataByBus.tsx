import React, { useEffect, useState } from "react";
import { getAllBuses } from "../../api/busApi";
import { getStudentByFilterOfRouteAndBus } from "../../api/assignStudentToBus";

interface Bus {
  _id: string;
  busNumber: string;
  driverName: string;
  routeId: { _id: string; name: string };
}

interface Student {
  _id: string;
  name: string;
  parentName: string;
  phone: string;
  classId: { name: string };
  busId: { busNumber: string; driverName: string };
}

export default function StudentDataByBus() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBusId, setSelectedBusId] = useState("");
  const [loading, setLoading] = useState(false);
  const [routeName, setRouteName] = useState("");

  useEffect(() => {
    const loadBuses = async () => {
      const res = await getAllBuses();
      setBuses(res.data.buses || []);
    };
    loadBuses();
  }, []);

  useEffect(() => {
    if (!selectedBusId) {
      setStudents([]);
      setRouteName("");
      return;
    }

    const loadStudents = async () => {
      setLoading(true);
      try {
        const res = await getStudentByFilterOfRouteAndBus(selectedBusId);
        setStudents(res.data.students || []);
        setRouteName(res.data.bus?.route?.name || "");
      } catch (err) {
        console.error("Error fetching students", err);
        setStudents([]);
        setRouteName("");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedBusId]);

  const card =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Student Bus Assignment
            </h1>
            <p className="text-sm text-slate-800">
              View all students assigned to a specific bus and route.
            </p>
          </div>

          {routeName && (
            <div className="rounded-full bg-slate-900/70 px-4 py-1 text-xs text-slate-200 border border-white/10">
              Route: <span className="font-semibold text-sky-300">{routeName}</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${card}`}>
          <div className="p-4 md:p-5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">
              Select Bus
            </label>
            <select
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 shadow-sm shadow-slate-900/50 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
            >
              <option value="" className="text-slate-700">
                -- Select Bus --
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
              Choose a bus to load assigned students and its current route.
            </p>
          </div>

          <div className="p-4 md:p-5 border-t md:border-t-0 md:border-l border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">
              Route
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500"
              value={routeName || "No route linked to this bus"}
              disabled
            />
            <p className="mt-2 text-[11px] text-slate-700">
              This route is fetched automatically based on the selected bus.
            </p>
          </div>
        </div>

        {/* Students table */}
        <div className={card}>
          <div className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Assigned Students
              </h2>
              <p className="text-[11px] text-slate-700">
                {students.length} student{students.length === 1 ? "" : "s"} found for the
                selected bus.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-b-2xl">
            <table className="min-w-full table-auto text-sm text-slate-200">
              <thead>
                <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Parent Name</th>
                  <th className="px-4 py-3 text-left">Parent Phone</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Bus Number</th>
                  <th className="px-4 py-3 text-left">Driver Name</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-700"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-700"
                    >
                      {selectedBusId
                        ? "No students assigned to this bus."
                        : "Select a bus to view assigned students."}
                    </td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr
                      key={s._id}
                      className={`border-t border-white/5 ${
                        idx % 2 === 0
                          ? "bg-slate-900/40"
                          : "bg-slate-900/25"
                      } hover:bg-slate-800/40 transition-colors`}
                    >
                      <td className="px-4 py-2 align-middle">
                        <span className="font-medium text-slate-50">
                          {s.name}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        {s.parentName}
                      </td>
                      <td className="px-4 py-2 align-middle">{s.phone}</td>
                      <td className="px-4 py-2 align-middle">
                        {s.classId?.name || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <span className="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200 border border-sky-500/30">
                          {s.busId?.busNumber || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        {s.busId?.driverName || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
