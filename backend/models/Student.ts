// models/Student.ts
import { Schema, model, Document } from "mongoose";

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
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNo: { type: Number, required: true },
    address: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    admissionNo: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    profileImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    classId: { type: Schema.Types.ObjectId, ref: "Class" },

    // Parent linking
    parentUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // Bus tracking fields
    pickupLocation: { type: String, default: "" },
    dropLocation: { type: String, default: "" },

    busId: { type: Schema.Types.ObjectId, ref: "Bus", default: null },
    routeId: { type: Schema.Types.ObjectId, ref: "Route", default: null },

    isBusAssigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique roll number inside class
studentSchema.index({ classId: 1, rollNo: 1 }, { unique: true, sparse: true });

export default model<IStudent>("Student", studentSchema);
