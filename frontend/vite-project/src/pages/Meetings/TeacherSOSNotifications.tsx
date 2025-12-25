// pages/teacher/TeacherSOSNotifications.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/api";
import { getToken } from "../../utils/auth";

interface SOS {
  _id: string;
  message: string;
  statusByTeacher: { status: string; seenAt?: string }[];
  createdAt: string;
}

const TeacherSOSNotifications: React.FC = () => {
  const [sosList, setSosList] = useState<SOS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSOS();
  }, []);

  const fetchSOS = async () => {
    try {
      const res = await api.get("/meeting-sos/history");
      setSosList(res.data.list);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markSeen = async (sosId: string) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("please login again");
        return;
      }

      await api.post(`/meeting-sos/${sosId}/seen`);
      toast.success("Marked as seen!");
      fetchSOS();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark seen");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl lg:max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
          🚨 SOS Notifications
        </h1>
        <p className="text-sm sm:text-xl text-gray-600">
          Emergency meeting alerts from admin
        </p>
      </div>

      <div className="space-y-4">
        {sosList.length === 0 ? (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 sm:p-16 text-center border-2 border-dashed border-gray-300">
            <div className="text-4xl sm:text-6xl mb-4">📭</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              You're all caught up!
            </p>
          </div>
        ) : (
          sosList.map((sos) => (
            <div
              key={sos._id}
              className="group bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border border-red-200/50 rounded-3xl p-5 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-xl sm:text-2xl text-white">🚨</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                    {sos.message}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Sent: {new Date(sos.createdAt).toLocaleString()}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      onClick={() => markSeen(sos._id)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
                    >
                      {sos.statusByTeacher[0]?.status === "seen"
                        ? "✅ Seen"
                        : "👁️ Mark Seen"}
                    </button>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sos.statusByTeacher[0]?.status === "seen"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {sos.statusByTeacher[0]?.status?.toUpperCase() ||
                        "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherSOSNotifications;
