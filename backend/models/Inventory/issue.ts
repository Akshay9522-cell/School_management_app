import mongoose, { Schema, Document } from "mongoose";

export interface IIssue extends Document {
  item: mongoose.Types.ObjectId;
  quantity: number;

  issuedTo: string; // teacher/staff/department

  issuedAt?: Date;
  remarks?: string;
}

const IssueSchema: Schema = new Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true },

    issuedTo: { type: String, required: true },
 
    issuedAt: { type: Date, default: Date.now },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IIssue>("Issue", IssueSchema);
