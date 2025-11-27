import { Schema, model, Document, Types } from "mongoose";

export interface IPaymentRecord extends Document {
  amount: number;
  currency: string;
  paymentDate: Date;
  paidTo?: Types.ObjectId;
  reference?: string;
  paymentMode: string;
  note?: string;
  relatedStockTransaction?: Types.ObjectId;
  relatedItem?: Types.ObjectId;
  createdBy?: Types.ObjectId;
}

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentDate: { type: Date, default: Date.now },

    paidTo: { type: Schema.Types.ObjectId, ref: "Supplier" },

    reference: String,

    paymentMode: {
      type: String,
      enum: ["CASH", "BANK_TRANSFER", "CHEQUE", "CARD", "UPI", "OTHER"],
      default: "BANK_TRANSFER",
    },

    note: String,

    relatedStockTransaction: {
      type: Schema.Types.ObjectId,
      ref: "StockTransaction",
    },

    relatedItem: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model<IPaymentRecord>(
  "PaymentRecord",
  PaymentRecordSchema
);
