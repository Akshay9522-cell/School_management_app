import { Schema, model, Document, Types } from "mongoose";

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "very_short" | "short" | "long";

export interface IQuestion extends Document {
  academicClass: Types.ObjectId;
  subject: Types.ObjectId;
  chapter: Types.ObjectId;

  questionText: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;

  marks: number;
  difficulty: Difficulty;
  type: QuestionType;

  isActive: boolean;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    academicClass: {
      type: Schema.Types.ObjectId,
      ref: "AcademicClass",
      required: true,
      index: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: undefined,
    },

    correctAnswer: String,
    answer: String,

    marks: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    type: {
      type: String,
      enum: ["mcq", "very_short", "short", "long"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model<IQuestion>("Question", QuestionSchema);
