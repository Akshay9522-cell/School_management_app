import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  vendor?: mongoose.Types.ObjectId;
  currentStock: number;
  lowStockLimit: number;
  barcode?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    currentStock: { type: Number, default: 0 },
    lowStockLimit: { type: Number, default: 10 },
    barcode: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>("Item", ItemSchema);
