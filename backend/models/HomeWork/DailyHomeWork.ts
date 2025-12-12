// models/HomeworkStatus.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IHomeworkRecord {
  studentId: mongoose.Types.ObjectId;
  status: "complete" | "incomplete";
}

export interface IHomeworkStatus extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date;              // that day
  markedBy: mongoose.Types.ObjectId;
  records: IHomeworkRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkRecordSchema = new Schema<IHomeworkRecord>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    status: {
      type: String,
      enum: ["complete", "incomplete"],
      required: true,
    },
  },
  { _id: false }
);

const HomeworkStatusSchema = new Schema<IHomeworkStatus>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    records: { type: [HomeworkRecordSchema], default: [] },
  },
  { timestamps: true }
);

// one homework doc per class per date
HomeworkStatusSchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IHomeworkStatus>(
  "HomeworkStatus",
  HomeworkStatusSchema
);
