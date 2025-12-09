import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VendorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    contactPerson: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IVendor>("Vendor", VendorSchema);
