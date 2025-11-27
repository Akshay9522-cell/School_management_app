import { Schema, model, Document } from "mongoose";

export interface IInventoryCategory extends Document {
  name: string;
  description?: string;
}

const InventoryCategorySchema = new Schema<IInventoryCategory>(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: String,
  },
  { timestamps: true }
);

export default model<IInventoryCategory>(
  "InventoryCategory",
  InventoryCategorySchema
);
