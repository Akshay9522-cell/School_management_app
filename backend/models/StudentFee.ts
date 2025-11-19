import mongoose, { Schema, Document } from "mongoose";

// -------------------
// Interfaces
// -------------------
export interface IFeeItem {
  feeType: mongoose.Types.ObjectId; // ref FeeType
  label?: string; // friendly label (copied from FeeType)
  amount: number;
}

export type FeeStatus = "unpaid" | "partial" | "paid";

export interface IPayment {
  amount: number;
  paidAt: Date;
  method?: string;      // cash, card, UPI
  reference?: string;
  note?: string;
  paidBy?: mongoose.Types.ObjectId; // ref User who made the payment
}

export interface IStudentFee extends Document {
  student: mongoose.Types.ObjectId; // ref Student
  class: mongoose.Types.ObjectId;   // ref Class (snapshot)
  periodMonth: number;              // 1-12
  periodYear: number;               // yyyy
  feeItems: IFeeItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: FeeStatus;
  payments?: IPayment[];
  createdAt: Date;
  updatedAt: Date;
}

// -------------------
// Schemas
// -------------------
const FeeItemSchema = new Schema<IFeeItem>(
  {
    feeType: { type: Schema.Types.ObjectId, ref: "FeeType", required: true },
    label: { type: String },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const PaymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: Date.now },
    method: { type: String },
    reference: { type: String },
    note: { type: String },
    paidBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const StudentFeeSchema: Schema<IStudentFee> = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    periodMonth: { type: Number, required: true, min: 1, max: 12 },
    periodYear: { type: Number, required: true },
    feeItems: { type: [FeeItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    payments: { type: [PaymentSchema], default: [] },
  },
  { timestamps: true }
);

// Prevent duplicate invoice per student per month/year
StudentFeeSchema.index({ student: 1, periodMonth: 1, periodYear: 1 }, { unique: true });

// -------------------
// Export model
// -------------------
export default mongoose.model<IStudentFee>("StudentFee", StudentFeeSchema);
