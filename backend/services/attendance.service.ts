// services/attendance.service.ts
import Teacher from "../models/Teacher";
import Classroom from "../models/classroom";
import TeacherAttendance from "../models/attandance/TeacherAttendance";
import { distanceInMeters } from "../utils/geo.util";
import { Types } from "mongoose";
import { verifyLocationRadius } from "../utils/location";

const DEFAULT_RADIUS_METERS = Number(process.env.ATTENDANCE_RADIUS_METERS || 10); // 10m default
const LATE_MINUTE_THRESHOLD = Number(process.env.ATTENDANCE_LATE_MINUTES || (9 * 60 + 15)); // default 9:15 AM

const todayDateString = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

// ---------- checkIn ----------
const checkIn = async (opts: {
  teacherId: string;
  classroomCode: string;
  lat: number;
  lng: number;
  performedBy?: string;
  radiusMeters?: number;
  checkInTime?: Date;
}) => {
  const { teacherId, classroomCode, lat, lng, performedBy, radiusMeters = DEFAULT_RADIUS_METERS, checkInTime = new Date() } = opts;

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) throw new Error("Classroom not found");

  const teacher = await Teacher.findById(teacherId);
  console.log(teacher)
  if (!teacher) throw new Error("Teacher not found");

  // Optional: enforce teacher-class assignment
  // if (teacher.classIds && !teacher.classIds.map(String).includes(String(classroom._id))) {
  //   throw new Error("Teacher is not assigned to this classroom");
  // }

  // Geo-fence check
  if (classroom.location && typeof classroom.location.lat === "number") {
    const d = distanceInMeters(lat, lng, classroom.location.lat, classroom.location.lng);
    if (d > radiusMeters) throw new Error("You are not near this classroom");
  }

  const date = todayDateString(checkInTime);

  const attendance = await TeacherAttendance.findOneAndUpdate(
  { teacherId: new Types.ObjectId(teacherId), date }, // filter
  {
    $setOnInsert: {
      classroomId: classroom._id,
      checkInTime,
      checkInLocation: { lat, lng },
      status: checkInTime.getHours() * 60 + checkInTime.getMinutes() > LATE_MINUTE_THRESHOLD ? "LATE" : "PRESENT",
      createdBy: performedBy ? new Types.ObjectId(performedBy) : undefined,
    }
  },
  { upsert: true, new: true,rawResult: true } // create if not exists, return the document
);

// Check if it was already existing (not inserted)
if (!attendance.isNew) {
  throw new Error("Already checked in today");
}

return attendance;
}

// ---------- checkOut ----------
const checkOut = async (opts: {
  teacherId: string;
  classroomCode: string;
  lat: number;
  lng: number;
  performedBy?: string;
  radiusMeters?: number;
  checkOutTime?: Date;
}) => {
  const { teacherId, classroomCode, lat, lng, performedBy, radiusMeters = DEFAULT_RADIUS_METERS, checkOutTime = new Date() } = opts;

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) throw new Error("Classroom not found");

  const date = todayDateString(checkOutTime);
   const attendance = await TeacherAttendance.findOneAndUpdate(
    { teacherId: new Types.ObjectId(teacherId), date, checkOutTime: { $exists: false } }, // only update if not checked out yet
    {
      $set: {
        checkOutTime,
        checkOutLocation: { lat, lng }
      }
    },
    { new: true }
  );

  if (!attendance) {
    // Could be: no check-in, or already checked out
    const existing = await TeacherAttendance.findOne({ teacherId, date });
    if (!existing || !existing.checkInTime) throw new Error("No check-in found for today");
    if (existing.checkOutTime) throw new Error("Already checked out for today");
    throw new Error("Unable to check-out. Try again.");
  }

  return attendance;
};

// ---------- getSummaryForDate ----------
const getSummaryForDate = async (dateStr?: string) => {
  const date = dateStr || todayDateString();
  const teachers = await Teacher.find().lean();
  const teacherIds = teachers.map((t) => String(t._id));

  const attendances = await TeacherAttendance.find({ date }).lean();

  const presentTeachers = attendances.filter((a) => a.checkInTime).map((a) => String(a.teacherId));
  const checkedOut = attendances.filter((a) => a.checkOutTime).map((a) => String(a.teacherId));
  const lateTeachers = attendances.filter((a) => a.status === "LATE").map((a) => String(a.teacherId));
  const missingCheckout = attendances.filter((a) => a.checkInTime && !a.checkOutTime).map((a) => String(a.teacherId));
  const completed = attendances.filter((a) => a.checkInTime && a.checkOutTime).map((a) => String(a.teacherId));

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
  };
};

// ---------- getHistoryForTeacher ----------
const getHistoryForTeacher = async (teacherId: string, from?: string, to?: string) => {
  const filters: any = { teacherId };
  if (from || to) filters.date = {};
  if (from) filters.date.$gte = from;
  if (to) filters.date.$lte = to;

  const history = await TeacherAttendance.find(filters).sort({ date: -1 }).lean();
  return history;
};

// ---------- Export as AttendanceService object ----------
const AttendanceService = {
  checkIn,
  checkOut,
  getSummaryForDate,
  getHistoryForTeacher,
};

export default AttendanceService;
