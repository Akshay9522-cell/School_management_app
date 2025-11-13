import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  sku: string;
  name: string;
  quantity: number;
  category: string;
}

const inventoryItemSchema = new Schema<IInventory>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  category: String
});

export default mongoose.model<IInventory>("InventoryItem", inventoryItemSchema);
