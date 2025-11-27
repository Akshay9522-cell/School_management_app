import { Schema, model, Document, Types } from "mongoose";

export interface IInventoryItem extends Document {
  sku?: string;
  name: string;
  category?: Types.ObjectId;
  description?: string;
  unit: string;
  reorderLevel: number;
  currentQuantity: number;
  averageCost: number;
  lastPurchasedAt?: Date;
  location?: Types.ObjectId;
  customFields?: any;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    sku: { type: String, index: true, sparse: true },
    name: { type: String, required: true, index: "text" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "InventoryCategory",
      index: true,
    },
    description: String,
    unit: { type: String, default: "pcs" },
    reorderLevel: { type: Number, default: 0 },
    currentQuantity: { type: Number, default: 0, index: true },
    averageCost: { type: Number, default: 0 },
    lastPurchasedAt: Date,
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    customFields: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default model<IInventoryItem>(
  "InventoryItem",
  InventoryItemSchema
);
