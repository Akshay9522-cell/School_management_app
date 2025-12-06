import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PendingTeachers() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/teachers/user?role=teacher");
      setPending(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch pending teachers", error);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-200 via-slate-550 to-slate-600">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Pending Teachers
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Complete teacher profiles for pending registrations.
          </p>
        </div>

        {/* Glass table card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-slate-900/40">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />

          <div className="p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Total Pending: {pending.length}</span>
              {loading && <span className="animate-pulse">Loading...</span>}
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
              <table className="min-w-full table-auto text-sm text-slate-200">
                <thead>
                  <tr className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                        Loading pending teachers...
                      </td>
                    </tr>
                  ) : pending.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                        No pending teacher registrations.
                      </td>
                    </tr>
                  ) : (
                    pending.map((t, idx) => (
                      <tr
                        key={t._id}
                        className={`border-t border-white/5 ${
                          idx % 2 === 0
                            ? "bg-slate-900/40"
                            : "bg-slate-900/25"
                        } hover:bg-slate-800/40 transition-colors`}
                      >
                        <td className="px-6 py-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-50">
                              {t.name}
                            </span>
                            {t.createdAt && (
                              <span className="text-[11px] text-slate-400">
                                {new Date(t.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-middle">
                          <span className="text-sm text-slate-300 break-all">
                            {t.email}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right align-middle">
                          <Link
                            to={`/dashboard/add-teacher/?userId=${t._id}&name=${t.name}&email=${t.email}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/40 hover:from-orange-400 hover:to-amber-400 transition-all duration-150"
                          >
                            <span className="text-lg leading-none">✏️</span>
                            Complete Profile
                          </Link>
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
    </div>
  );
}
