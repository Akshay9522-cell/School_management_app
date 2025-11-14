// models/Student.ts
import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
  class: string; // Display name like "10A"
  rollNo: number;
  address: string;
  parentName: string;
  parentPhone: string;
  classId?: Schema.Types.ObjectId; // 🔗 Reference to Class
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    class: { type: String, required: true, index: true },
    rollNo: { type: Number, required: true, index: true },
    address: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class", // 👈 Student belongs to a Class
    },
  },
  { timestamps: true }
);

studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

export default model<IStudent>("Student", studentSchema);
