// models/TeacherAttendance.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ITeacherAttendance extends Document {
  teacherId: Types.ObjectId;
  classroomId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  checkInTime?: Date;
  checkOutTime?: Date;
  checkInLocation?: { lat: number; lng: number };
  checkOutLocation?: { lat: number; lng: number };
  status?: "PRESENT" | "LATE" | "ABSENT";
  createdBy?: Types.ObjectId;
}

const TeacherAttendanceSchema = new Schema<ITeacherAttendance>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
    classroomId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    checkInTime: Date,
    checkOutTime: Date,
    checkInLocation: { lat: Number, lng: Number },
    checkOutLocation: { lat: Number, lng: Number },
    status: { type: String, enum: ["PRESENT", "LATE", "ABSENT"], default: "PRESENT" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Ensure one attendance record per teacher per date
TeacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

export default model<ITeacherAttendance>("TeacherAttendance", TeacherAttendanceSchema);
