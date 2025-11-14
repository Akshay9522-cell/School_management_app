import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  section: string;
  classTeacher: mongoose.Types.ObjectId; // Ref to Teacher
  students: mongoose.Types.ObjectId[]; // Ref to Students
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IClass>("Class", ClassSchema);
