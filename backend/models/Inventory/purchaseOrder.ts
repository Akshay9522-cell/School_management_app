import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  vendor: mongoose.Types.ObjectId;
  items: {
    item: mongoose.Types.ObjectId;
    quantity: number;
 
  }[];
  status: "PENDING" | "APPROVED" | "RECEIVED" | "CANCELLED";
  orderedAt: Date;
  expectedArrival?: Date;
  receivedAt?: Date;
  remarks?: string;
}

const PurchaseOrderSchema: Schema = new Schema(
  {
    vendor: { type: mongoose.Types.ObjectId, ref: "Vendor", required: true },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true },
   
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "RECEIVED", "CANCELLED"],
      default: "PENDING",
    },
    orderedAt: { type: Date, default: Date.now },
    expectedArrival: { type: Date },
    receivedAt: { type: Date },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
