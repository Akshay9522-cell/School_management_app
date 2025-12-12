// models/TestResult.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IStudentTest {
  studentId: mongoose.Types.ObjectId;
  marks: number;
}

export interface ITestResult extends Document {
  classId: mongoose.Types.ObjectId;
  subject: string;
  date: Date;
  totalMarks: number;
  records: IStudentTest[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentTestSchema = new Schema<IStudentTest>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    marks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const TestResultSchema = new Schema<ITestResult>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subject: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    totalMarks: { type: Number, required: true, min: 1 },
    records: { type: [StudentTestSchema], default: [] },
  },
  { timestamps: true }
);

// allow multiple tests per day per subject if you want; otherwise you can index (classId, subject, date)
export default mongoose.model<ITestResult>("TestResult", TestResultSchema);
