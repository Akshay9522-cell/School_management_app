import mongoose from "mongoose";
import StudentFee from "../models/StudentFee";

type PaymentPayload = {
  amount: number;
  method?: string; // Cash, Online, etc.
  reference?: string;
  note?: string;
  paidBy?: string; // userId for audit
};

export const recordPaymentService = async (feeId: string, payload: PaymentPayload) => {
  if (!mongoose.Types.ObjectId.isValid(feeId)) throw new Error("Invalid feeId");

  const fee = await StudentFee.findById(feeId);
  if (!fee) throw new Error("Student fee not found");

  const { amount, method, reference, note, paidBy } = payload;

  if (amount <= 0) throw new Error("Payment amount must be greater than 0");

    if (!fee.payments) {
    fee.payments = [];
  }
  // Update paid amount
  fee.paidAmount += amount;
  fee.dueAmount = Math.max(fee.totalAmount - fee.paidAmount, 0);

  // Update status
  fee.status = fee.dueAmount === 0 ? "paid" : "partial";

  // Push to payments array
  fee.payments.push({
    amount,
    method: method || "cash",
    reference,
    note,
    paidBy: paidBy ? new mongoose.Types.ObjectId(paidBy) : undefined,
    paidAt: new Date(),
  });
 // Update paid amount & status AFTER adding payment
  fee.paidAmount = fee.payments.reduce((acc, p) => acc + p.amount, 0);
  fee.dueAmount = Math.max(fee.totalAmount - fee.paidAmount, 0);
  fee.status = fee.dueAmount === 0 ? "paid" : "partial";
  await fee.save();

  return fee;
};
