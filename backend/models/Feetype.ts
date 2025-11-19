import mongoose, { Schema, Document } from "mongoose";

export interface IFeeType extends Document {
  name: string;
  description?: string;
  defaultAmount: number; // default amount (can be overridden in FeeStructure)
  createdAt: Date;
  updatedAt: Date;
}

const FeeTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    defaultAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// optional index for name lookup
FeeTypeSchema.index({ name: 1 });

export default mongoose.model<IFeeType>("FeeType", FeeTypeSchema);
