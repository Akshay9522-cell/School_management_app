// models/ClassCounter.ts
import { Schema, model, Document } from "mongoose";

export interface IClassCounter extends Document {
  classId: Schema.Types.ObjectId;
  lastRollNo: number;
}

const classCounterSchema = new Schema<IClassCounter>({
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true, unique: true },
  lastRollNo: { type: Number, default: 0 },
});

export default model<IClassCounter>("ClassCounter", classCounterSchema);
