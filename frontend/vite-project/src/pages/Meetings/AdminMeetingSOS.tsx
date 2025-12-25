// pages/admin/AdminMeetingSOS.tsx - FIXED
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/api";
import { getTeachers } from "../../api/teacherApi";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface StatusByTeacher {
  teacher: string;
  status: "queued" | "sent" | "seen" | "failed"; // ✅ Fixed from backend
  seenAt?: string;
}

interface RecentSOS {
  _id: string;
  message: string;
  statusByTeacher: StatusByTeacher[];
}

const AdminMeetingSOS: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [message, setMessage] = useState("Emergency Staff Meeting - Conference Room NOW!");
  const [loading, setLoading] = useState(false);
  const [recentSOS, setRecentSOS] = useState<RecentSOS | null>(null);

  useEffect(() => {
    fetchTeachers();
    fetchRecentSOS();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getTeachers({ page: 1, limit: 1000 });
      setTeachers(res.data.data);
      console.log(res.data);
    } catch (err) {
      toast.error("Failed to load teachers");
    }
  };

  const fetchRecentSOS = async () => {
    try {
      const res = await api.get("/meeting-sos/active");
      setRecentSOS(res.data);
    } catch (err) {
      console.log("No active SOS");
    }
  };

  const sendSOS = async () => {
    if (selectedTeachers.length === 0) {
      toast.error("Select at least one teacher");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/meeting-sos", {
        teacherIds: selectedTeachers,
        message,
      });
      toast.success(`SOS sent to ${res.data.totalTeachers} teachers!`);
      setSelectedTeachers([]);
      setMessage("Emergency Staff Meeting - Conference Room NOW!");
      fetchRecentSOS(); // Refresh status
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send SOS");
    }
    setLoading(false);
  };

  // 🔥 FIXED: Correct status counters
  const getStatusCounts = () => {
    if (!recentSOS?.statusByTeacher) return { seen: 0, pending: 0, failed: 0 };

    const seen = recentSOS.statusByTeacher.filter(s => s.status === 'seen').length;
    const pending = recentSOS.statusByTeacher.filter(s => s.status === 'queued' || s.status === 'sent').length;
    const failed = recentSOS.statusByTeacher.filter(s => s.status === 'failed').length;
    
    return { seen, pending, failed };
  };

  const { seen, pending, failed } = recentSOS ? getStatusCounts() : { seen: 0, pending: 0, failed: 0 };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEND SOS SECTION */}
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg border border-red-200/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
            🚨 Emergency SOS
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-red-500/20 focus:border-transparent bg-white/50 backdrop-blur-sm min-h-[100px] text-lg"
                placeholder="Emergency Staff Meeting NOW!"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Select Teachers ({selectedTeachers.length} selected)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {teachers.map((teacher) => (
                  <label key={teacher._id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50/50 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher._id)}
                      onChange={(e) => {
                        const id = teacher._id;
                        setSelectedTeachers(
                          e.target.checked
                            ? [...selectedTeachers, id]
                            : selectedTeachers.filter((t) => t !== id)
                        );
                      }}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="font-medium text-gray-900 group-hover:text-red-900 ">
                      {teacher.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={sendSOS}
              disabled={loading || selectedTeachers.length === 0}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:from-red-700 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "🚨 SENDING..." : `🚨 SEND SOS TO ${selectedTeachers.length} TEACHERS`}
            </button>
          </div>
        </div>

        {/* 🔥 FIXED LIVE STATUS */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-lg border border-emerald-200/50 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">📊 Live Status</h3>
            {recentSOS ? (
              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Sent: <span className="font-bold text-gray-900">{recentSOS.message}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Total: {recentSOS.statusByTeacher.length} teachers
                  </p>
                  
                  {/* 🔥 CORRECT COUNTERS */}
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="bg-gradient-to-r from-emerald-500/20 p-4 rounded-2xl border-2 border-emerald-200/50">
                      <div className="text-3xl font-black text-emerald-600 mb-1">{seen}</div>
                      <div className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Seen</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-400/20 p-4 rounded-2xl border-2 border-yellow-200/50">
                      <div className="text-3xl font-black text-yellow-600 mb-1">{pending}</div>
                      <div className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">Pending</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-400/20 p-4 rounded-2xl border-2 border-red-200/50">
                      <div className="text-3xl font-black text-red-600 mb-1">{failed}</div>
                      <div className="text-sm font-semibold text-red-800 uppercase tracking-wide">Failed</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.round((seen / recentSOS.statusByTeacher.length) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Active SOS</h3>
                <p className="text-lg">Send your first emergency notification!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMeetingSOS;
