import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string; // Example: 1, 2, 3, 10
  section: string; // Example: A, B, C
  classTeacher?: mongoose.Types.ObjectId;
  subjectTeachers: { teacher: mongoose.Types.ObjectId; subject: string }[];
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, index: true },
    section: { type: String, required: true, index: true },

    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    subjectTeachers: [
      {
        teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
        subject: { type: String, required: true },
      },
    ],

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

// ⛔ Prevent duplicate Class + Section (Example: 10-A should be unique)
ClassSchema.index({ name: 1, section: 1 }, { unique: true });

export default mongoose.model<IClass>("Class", ClassSchema);
