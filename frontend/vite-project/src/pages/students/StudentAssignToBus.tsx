import React, { useEffect, useState } from "react";
import { getStudents } from "../../api/studentApi";
import { getAllBuses } from "../../api/busApi";
import { assignBusInBulk, fetchRoute } from "../../api/assignStudentToBus";

export default function StudentAssignToBus() {
  const [students, setStudents] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busId, setBusId] = useState("");
  const [loading, setLoading] = useState(true);
  const [route,setRoute]=useState<any[]>([])

  // Load Students + Buses
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const s = await getStudents("");
    const b = await getAllBuses();
    const r = await fetchRoute()

    setStudents(s.data.data);
    setRoute(r.data)
    console.log(r.data)
    
    setBuses(b.data.buses);

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
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">🚍 Assign Students to Bus</h1>

      {/* Bus Selector */}
      <div className="bg-white shadow p-4 rounded-xl mb-5">
        <label className="block font-semibold mb-2">Select Bus</label>
        <select
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">-- Choose Bus --</option>
          {buses.map((bus) => (
            <option key={bus._id} value={bus._id}>
              {bus.busNumber} - {bus.driverName}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-xl">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="font-semibold text-lg">Student List</h2>
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:underline"
          >
            {selected.length === students.length ? "Unselect All" : "Select All"}
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-5 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        ) : (
          <ul className="divide-y max-h-[400px] overflow-y-auto">
            {students.map((s) => (
              <li
                key={s._id}
                className="flex items-center px-4 py-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s._id)}
                  onChange={() => toggleSelection(s._id)}
                  className="mr-3 h-4 w-4"
                />
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.parentName}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Button */}
    
  <button className="w-50 bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold"    onClick={handleAssign} >
 
    Assign Bus
  </button>




    </div>
  );
}
