import { Schema, model, Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  gstNumber?: string;
  notes?: string;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true, index: true },
    contact: {
      phone: String,
      email: String,
      address: String,
    },
    gstNumber: String,
    notes: String,
  },
  { timestamps: true }
);

export default model<ISupplier>("Supplier", SupplierSchema);
