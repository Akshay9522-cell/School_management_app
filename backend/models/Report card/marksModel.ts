import { Schema, model, Document } from "mongoose";

export interface IMark extends Document {
  studentId: Schema.Types.ObjectId;
  examId: Schema.Types.ObjectId;
  classId: Schema.Types.ObjectId;
  subjectId: Schema.Types.ObjectId;
  marksObtained: number;
  maxMarks: number;
  grade?: string; // Optional, can calculate later
  remarks?: string;
}

const MarkSchema = new Schema<IMark>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    grade: { type: String, default: "" },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// Optional: Prevent duplicate entries for same student + exam + subject
MarkSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });

export default model<IMark>("Mark", MarkSchema);
