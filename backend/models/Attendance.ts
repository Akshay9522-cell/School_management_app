import mongoose, { Schema, Document } from "mongoose";

export interface ITest {
  subject: string;
  marks: number;
  total: number;
}

export interface IRecord {
  studentId: mongoose.Types.ObjectId;
  status: "present" | "absent" | "leave" | "late";
  homework: "done" | "not_done";
  note?: string;
  tests?: ITest[]; // ✅ new
}

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  markedBy: mongoose.Types.ObjectId;
  records: IRecord[];
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    subject: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const RecordSchema = new Schema<IRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "leave", "late"],
      required: true,
    },

    homework: {
      type: String,
      enum: ["done", "not_done"],
      default: "not_done",
    },

    note: {
      type: String,
      default: "",
    },

    tests: {
      type: [TestSchema],
      default: [], // ✅ tests array for each student
    },
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

AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);
