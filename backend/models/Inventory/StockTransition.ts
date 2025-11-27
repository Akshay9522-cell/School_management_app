import { Schema, model, Document, Types } from "mongoose";

export interface IStockTransaction extends Document {
  itemId: Types.ObjectId;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  locationFrom?: Types.ObjectId;
  locationTo?: Types.ObjectId;
  reference?: string;
  supplier?: Types.ObjectId;
  reason?: string;
  performedBy?: Types.ObjectId;
  performedAt: Date;
}

const StockTransactionSchema = new Schema<IStockTransaction>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT", "ADJUSTMENT", "TRANSFER"],
      required: true,
    },
    quantity: { type: Number, required: true },
    unitCost: Number,
    totalCost: Number,

    locationFrom: { type: Schema.Types.ObjectId, ref: "Location" },
    locationTo: { type: Schema.Types.ObjectId, ref: "Location" },

    reference: String,

    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      index: true,
    },

    reason: String,

    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    performedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IStockTransaction>(
  "StockTransaction",
  StockTransactionSchema
);
