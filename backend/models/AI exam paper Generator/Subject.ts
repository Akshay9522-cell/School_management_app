import { Schema, model, Document, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;                 // English, Maths, Science
  academicClass: Types.ObjectId; // Link to AcademicClass
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    academicClass: {
      type: Schema.Types.ObjectId,
      ref: "AcademicClass",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ⛔ Prevent duplicate subjects in same class
// Example: Class 5 cannot have English twice
SubjectSchema.index(
  { name: 1, academicClass: 1 },
  { unique: true }
);

export default model<ISubject>("Subject", SubjectSchema);
