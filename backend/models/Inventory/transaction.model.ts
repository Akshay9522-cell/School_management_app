// src/models/transaction.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  item: Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  date: Date;
}

const transactionSchema = new Schema<ITransaction>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
