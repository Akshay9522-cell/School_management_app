import mongoose from "mongoose";
import StudentFee, { IStudentFee, IFeeItem } from "../models/StudentFee";

export const createStudentFeeService = async (data: Partial<IStudentFee>) => {
  const fee = new StudentFee(data);
  return await fee.save();
};

export const getStudentFeesService = async (filters: any) => {
  const query: any = {};

  if (filters.student) query.student = filters.student;
  if (filters.class) query.class = filters.class;
  if (filters.periodMonth) query.periodMonth = filters.periodMonth;
  if (filters.periodYear) query.periodYear = filters.periodYear;

  const fees = await StudentFee.find(query)
    .populate("student", "name rollNo")
    .populate("class", "name");

  return fees;
};

export const getStudentFeeByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid fee ID");

  const fee = await StudentFee.findById(id)
    .populate("student", "name rollNo")
    .populate("class", "name");

  return fee;
};

// ✅ Add payment to a student fee
export const addPaymentService = async (feeId: string, payment: {
  amount: number;
  date?: Date;
  method?: string;
  reference?: string;
  note?: string;
}) => {
  if (!mongoose.Types.ObjectId.isValid(feeId)) throw new Error("Invalid fee ID");

  const fee = await StudentFee.findById(feeId);
  if (!fee) throw new Error("Fee record not found");

  const paidAmount = payment.amount;
  fee.paidAmount += paidAmount;
  fee.dueAmount = fee.totalAmount - fee.paidAmount;

  // Update status
  if (fee.paidAmount >= fee.totalAmount) fee.status = "paid";
  else if (fee.paidAmount > 0) fee.status = "partial";
  else fee.status = "unpaid";

  // Add payment record
  fee.payments?.push({
    ...payment,
    paidAt: payment.date || new Date(),
  });

  await fee.save();
  return fee;
};

// Delete a fee
export const deleteStudentFeeService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid fee ID");

  const fee = await StudentFee.findByIdAndDelete(id);
  return fee;
};
