import mongoose, { Schema, Document } from "mongoose";

export interface IFeeStructure extends Document {
  classId: mongoose.Types.ObjectId;
  fees: {
    feeTypeId: mongoose.Types.ObjectId;
    amount: number;
  }[];
}

const FeeStructureSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    fees: [
      {
        feeTypeId: {
          type: Schema.Types.ObjectId,
          ref: "FeeType",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IFeeStructure>("FeeStructure", FeeStructureSchema);
