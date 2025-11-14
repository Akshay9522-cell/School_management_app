import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList } from "react-icons/fa";
import { 
  getStudentCount, 
  getTeacherCount, 
  getClassCount, 
  getTodayAttendanceCount 
} from "../api/dashboard";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    todayAttendance: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [studentRes, teacherRes, classRes, attendanceRes] = await Promise.all([
        getStudentCount(),
        getTeacherCount(),
        getClassCount(),
        getTodayAttendanceCount()
      ]);

      setStats({
        students: studentRes.data.total || studentRes.data.length || 0,
        teachers: teacherRes.data.total || teacherRes.data.length || 0,
        classes: classRes.data.total || classRes.data.length || 0,
        todayAttendance: attendanceRes.data.total || attendanceRes.data.length || 0
      });

    } catch (err) {
      console.error("Dashboard API failed:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "Students", count: stats.students, icon: <FaUsers />, color: "text-blue-500" },
    { title: "Teachers", count: stats.teachers, icon: <FaChalkboardTeacher />, color: "text-green-500" },
    { title: "Classes", count: stats.classes, icon: <FaSchool />, color: "text-purple-500" },
    { title: "Today's Attendance", count: stats.todayAttendance, icon: <FaClipboardList />, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-xl font-semibold">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-lg shadow flex items-center gap-4 border"
          >
            <div className={`text-4xl ${card.color}`}>
              {card.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-3xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
