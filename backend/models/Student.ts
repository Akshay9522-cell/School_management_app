import { Schema, model, Document } from "mongoose";

export interface IMark {
  subject: string;
  totalMarks: number;
  practicalMarks: number;
  theoryMarks: number;
  obtained: number;
  percentage: number;
  grade: string;
  status: string;
}

export interface IReport {
  term?: string;
  createdAt?: Date;
  marks: IMark[];
  overallPercentage?: number;
  overallGrade?: string;
  passRate?: number;
}

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
  rollNo: number;
  address: string;
  parentName: string;
  parentPhone: string;
  admissionNo: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  profileImage?: string;
  status: "Active" | "Inactive";
  classId?: Schema.Types.ObjectId;
  parentUserId?: Schema.Types.ObjectId;
  pickupLocation?: string;
  dropLocation?: string;
  busId?: Schema.Types.ObjectId;
  routeId?: Schema.Types.ObjectId;
  isBusAssigned: boolean;

  reports?: IReport[];
}

/* ---------------------- Mark Schema ---------------------- */
const markSchema = new Schema<IMark>(
  {
    subject: { type: String, required: true },
    totalMarks: { type: Number, default: 100 },
    practicalMarks: { type: Number, default: 0 },
    theoryMarks: { type: Number, default: 0 },
    obtained: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    grade: { type: String, default: "" },
    status: { type: String, default: "" },
  },
  { _id: false }
);

/* ---------------------- Report Schema ---------------------- */
const reportSchema = new Schema<IReport>(
  {
    term: { type: String, default: "Term 1" },
    createdAt: { type: Date, default: Date.now },
    marks: { type: [markSchema], default: [] },
    overallPercentage: { type: Number, default: 0 },
    overallGrade: { type: String, default: "" },
    passRate: { type: Number, default: 0 },
  },
  { _id: true }
);

/* ---------------------- Student Schema ---------------------- */
const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    rollNo: { type: Number },
    address: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    admissionNo: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profileImage: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    classId: { type: Schema.Types.ObjectId, ref: "Class" },
    parentUserId: { type: Schema.Types.ObjectId, ref: "User" },
    pickupLocation: { type: String },
    dropLocation: { type: String },
    busId: { type: Schema.Types.ObjectId, ref: "Bus" },
    routeId: { type: Schema.Types.ObjectId, ref: "Route" },
    isBusAssigned: { type: Boolean, default: false },

    // NEW FIELD
    reports: { type: [reportSchema], default: [] },
  },
  { timestamps: true }
);

/* Index */
studentSchema.index({ classId: 1, rollNo: 1 }, { unique: true, sparse: true });

export default model<IStudent>("Student", studentSchema);
