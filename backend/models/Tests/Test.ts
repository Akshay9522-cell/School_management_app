// models/Test.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ITest extends Document {
  classId: Types.ObjectId;
  section: string; // section stored as string
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;

  testType:
    | "class_test"
    | "weekly_test"
    | "unit_test"
    | "monthly_test"
    | "mid_term"
    | "final_term";

  title: string;
  description?: string;

  date: Date;
  maxMarks: number;

  createdAt: Date;
  updatedAt: Date;
}

const testSchema = new Schema<ITest>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    testType: {
      type: String,
      enum: [
        "class_test",
        "weekly_test",
        "unit_test",
        "monthly_test",
        "mid_term",
        "final_term",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    date: {
      type: Date,
      required: true,
    },

    maxMarks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ITest>("Test", testSchema);
