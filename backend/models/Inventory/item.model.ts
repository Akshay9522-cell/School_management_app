// src/models/item.model.ts
import { Schema, model, Document } from "mongoose";

export interface IItem extends Document {
  category: string;
  name: string;       // item
  unit: string;       // pcs, box, kg...
  price: number;      // per unit
  totalItem: number;  // current stock
  vendor?: string;
  lowStockLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    category: { type: String, required: true },
    name:     { type: String, required: true },
    unit:     { type: String, required: true },
    price:    { type: Number, required: true },
    totalItem:{ type: Number, required: true, default: 0 },
    vendor:   { type: String },
    lowStockLimit: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Item = model<IItem>("Item", itemSchema);
