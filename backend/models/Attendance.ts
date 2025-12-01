import mongoose, { Schema, Document } from "mongoose";

export interface IRecord {
  studentId: mongoose.Types.ObjectId;
  status: "present" | "absent" | "leave" | "late";
  note?: string;
}

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date; // date-only (normalized)
  markedBy: mongoose.Types.ObjectId;
  records: IRecord[];
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecordSchema = new Schema<IRecord>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "late"],
      required: true,
    },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    records: { type: [RecordSchema], default: [] },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique per class per date to prevent duplicates
AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);
