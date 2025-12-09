import { Schema, model, Document } from "mongoose";

export interface IDateSheet extends Document {
  examId: Schema.Types.ObjectId; 
  classId: Schema.Types.ObjectId;
  subjectId: Schema.Types.ObjectId;
  examDate: Date;
  startTime: string; 
  endTime: string;
  room?: string;
}

const DateSheetSchema = new Schema<IDateSheet>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model<IDateSheet>("DateSheet", DateSheetSchema);
