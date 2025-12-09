import { Schema, model, Document } from "mongoose";

export interface IExam extends Document {
  termId: Schema.Types.ObjectId;
  name: string; // Mid Term, Final Exam
  description?: string;
  startDate: Date;
  endDate: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    termId: { type: Schema.Types.ObjectId, ref: "Term", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<IExam>("Exam", ExamSchema);
