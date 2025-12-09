import { Schema, model, Document } from "mongoose";

export interface ITerm extends Document {
  name: string; // Term 1, Term 2, Mid Term
  academicYear: string; // 2024-2025
  startDate: Date;
  endDate: Date;
}

const TermSchema = new Schema<ITerm>(
  {
    name: { type: String, required: true },
    academicYear: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<ITerm>("Term", TermSchema);
