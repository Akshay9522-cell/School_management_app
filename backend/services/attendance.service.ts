import Teacher from "../models/Teacher";
import Classroom from "../models/classroom";
import TeacherAttendance from "../models/attandance/TeacherAttendance";
import { Types } from "mongoose";

const DEFAULT_RADIUS_METERS = Number(process.env.ATTENDANCE_RADIUS_METERS || 10);
const LATE_MINUTE_THRESHOLD = Number(process.env.ATTENDANCE_LATE_MINUTES || (9 * 60 + 15)); // in minutes from midnight

const todayDateString = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

// ---------- checkIn ----------
const checkIn = async (opts: {
  teacherId: string;
  classroomCode: string;
  lat?: number;
  lng?: number;
  performedBy?: string;
  radiusMeters?: number;
  checkInTime?: Date;
}) => {
  const {
    teacherId,
    classroomCode,
    lat,
    lng,
    performedBy,
    radiusMeters = DEFAULT_RADIUS_METERS,
    checkInTime = new Date()
  } = opts;

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) throw new Error("Classroom not found");

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new Error("Teacher not found");

  // Geo-fence check (if classroom has location)
  if (classroom.location && typeof classroom.location.lat === "number" && typeof lat === "number") {
    const distMeters = (() => {
      // distanceInMeters util may exist in your project; if so use it. Otherwise simple fallback:
      try {
        const { distanceInMeters } = require("../utils/geo.util");
        return distanceInMeters(lat, lng, classroom.location.lat, classroom.location.lng);
      } catch {
        return 0;
      }
    })();
    if (distMeters > radiusMeters) throw new Error("You are not near this classroom");
  }

  const date = todayDateString(checkInTime);

  // If a record already exists for teacher/date -> reject
  const existing = await TeacherAttendance.findOne({ teacherId: new Types.ObjectId(teacherId), date });
  if (existing && existing.checkInTime) {
    throw new Error("Already checked in today");
  }

  // Determine status based on minute threshold (minutes from midnight)
  const minutesFromMidnight = checkInTime.getHours() * 60 + checkInTime.getMinutes();
  const status = minutesFromMidnight > LATE_MINUTE_THRESHOLD ? "LATE" : "PRESENT";

  const created = await TeacherAttendance.create({
    teacherId: new Types.ObjectId(teacherId),
    classroomId: classroom._id,
    date,
    checkInTime,
    checkInLocation: (lat !== undefined && lng !== undefined) ? { lat, lng } : undefined,
    status,
    createdBy: performedBy ? new Types.ObjectId(performedBy) : undefined
  });

  // return populated document for UI convenience
  await created.populate([
  { path: "teacherId", select: "name email" },
  { path: "classroomId", select: "name code" }
]);

return created;

};

// ---------- checkOut ----------
const checkOut = async (opts: {
  teacherId: string;
  classroomCode: string;
  lat?: number;
  lng?: number;
  performedBy?: string;
  radiusMeters?: number;
  checkOutTime?: Date;
}) => {
  const {
    teacherId,
    classroomCode,
    lat,
    lng,
    performedBy,
    radiusMeters = DEFAULT_RADIUS_METERS,
    checkOutTime = new Date()
  } = opts;

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) throw new Error("Classroom not found");

  const date = todayDateString(checkOutTime);

  // Update only if there is a check-in and no checkOutTime yet
  const attendance = await TeacherAttendance.findOneAndUpdate(
    { teacherId: new Types.ObjectId(teacherId), date, checkOutTime: { $exists: false }, checkInTime: { $exists: true } },
    {
      $set: {
        checkOutTime,
        checkOutLocation: (lat !== undefined && lng !== undefined) ? { lat, lng } : undefined
      }
    },
    { new: true }
  );

  if (!attendance) {
    // Could be: no check-in, or already checked out
    const existing = await TeacherAttendance.findOne({ teacherId: new Types.ObjectId(teacherId), date });
    if (!existing || !existing.checkInTime) throw new Error("No check-in found for today");
    if (existing.checkOutTime) throw new Error("Already checked out for today");
    throw new Error("Unable to check-out. Try again.");
  }

  // Optionally compute total duration string (basic)
  if (attendance.checkInTime && attendance.checkOutTime) {
    const mins = Math.round((attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) / 60000);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    (attendance as any).totalHours = `${hours}h ${minutes}m`;
    await attendance.save();
  }

  await attendance.populate([
    { path: "teacherId", select: "name email" }, 
    { path: "classroomId", select: "name code" }
  ]);
  return attendance
};

// ---------- getSummaryForDate ----------
const getSummaryForDate = async (dateStr?: string) => {
  const date = dateStr || todayDateString();
  const teachers = await Teacher.find().lean();
  const teacherIds = teachers.map((t) => String(t._id));

  const attendances = await TeacherAttendance.find({ date })
    .populate("teacherId", "name email")
    .populate("classroomId", "name code")
    .lean();

  const presentTeachers = attendances.filter((a) => a.checkInTime).map((a) => String(a.teacherId._id || a.teacherId));
  const checkedOut = attendances.filter((a) => a.checkOutTime).map((a) => String(a.teacherId._id || a.teacherId));
  const lateTeachers = attendances.filter((a) => a.status === "LATE").map((a) => String(a.teacherId._id || a.teacherId));
  const missingCheckout = attendances.filter((a) => a.checkInTime && !a.checkOutTime).map((a) => String(a.teacherId._id || a.teacherId));
  const completed = attendances.filter((a) => a.checkInTime && a.checkOutTime).map((a) => String(a.teacherId._id || a.teacherId));

  const absentTeachers = teacherIds.filter((id) => !presentTeachers.includes(id));
  const teacherMap = new Map(teachers.map((t) => [String(t._id), t]));
  const mapIdsToTeachers = (ids: string[]) => ids.map((id) => ({ id, teacher: teacherMap.get(id) }));

  return {
    date,
    present: mapIdsToTeachers(presentTeachers),
    absent: mapIdsToTeachers(absentTeachers),
    late: mapIdsToTeachers(lateTeachers),
    missingCheckout: mapIdsToTeachers(missingCheckout),
    completed: mapIdsToTeachers(completed),
    checkedOut: mapIdsToTeachers(checkedOut),
    // include raw attendance records for UI if needed
    attendances,
  };
};

// ---------- getHistoryForTeacher ----------
const getHistoryForTeacher = async (teacherId: string, from?: string, to?: string) => {
  const filters: any = { teacherId: new Types.ObjectId(teacherId) };
  if (from || to) filters.date = {};
  if (from) filters.date.$gte = from;
  if (to) filters.date.$lte = to;

  const history = await TeacherAttendance.find(filters).sort({ date: -1 }).lean();
  return history;
};

const AttendanceService = {
  checkIn,
  checkOut,
  getSummaryForDate,
  getHistoryForTeacher,
};

export default AttendanceService;
