import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
  class: string;
  rollNo: number;
  address: string;
  parentName: string;
  parentPhone: string;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    class: { type: String, required: true },
    rollNo: { type: Number, required: true },
    address: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IStudent>("Student", studentSchema);
