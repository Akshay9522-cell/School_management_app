import { Schema, model, Document, Types } from "mongoose";

export interface IExamPattern extends Document {
  board: string; // just string here
  academicClass: Types.ObjectId;
  subject: Types.ObjectId;

  totalMarks: number;
  sections: {
    name: string;
    marksPerQuestion: number;
    numberOfQuestions: number;
    difficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    questionType: string;
  }[];
}

const ExamPatternSchema = new Schema<IExamPattern>({
  board: { type: String, required: true },
  academicClass: { type: Schema.Types.ObjectId, ref: "AcademicClass", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },

  totalMarks: { type: Number, required: true },

  sections: [
    {
      name: String,
      marksPerQuestion: Number,
      numberOfQuestions: Number,
      questionType: String,
      difficulty: {
        easy: Number,
        medium: Number,
        hard: Number,
      },
    },
  ],
});

export default model<IExamPattern>("ExamPattern", ExamPatternSchema);
