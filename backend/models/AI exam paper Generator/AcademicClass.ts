import { Schema, model, Document } from "mongoose";

export interface IAcademicClass extends Document {
  board: string;          // CBSE, MP Board
  className: string;      // 1, 2, 3, 10
}

const AcademicClassSchema = new Schema<IAcademicClass>(
  {
    board: { type: String, required: true, index: true },
    className: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

AcademicClassSchema.index(
  { board: 1, className: 1 },
  { unique: true }
);

export default model<IAcademicClass>(
  "AcademicClass",
  AcademicClassSchema
);
