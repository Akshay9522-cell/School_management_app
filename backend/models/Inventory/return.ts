import mongoose, { Schema, Document } from "mongoose";

export interface IReturn extends Document {
  issue: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  quantity: number;
  returnedBy: string;
  returnedAt?: Date;
  condition: "GOOD" | "DAMAGED" | "REPAIR";
  remarks?: string;
}

const ReturnSchema: Schema = new Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true },
    returnedBy: { type: String, required: true },
    returnedAt: { type: Date, default: Date.now },
    condition: { type: String, enum: ["GOOD", "DAMAGED", "REPAIR"], required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReturn>("Return", ReturnSchema);
