import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  qualification?: string;
  joiningDate?: Date;
  isActive: boolean;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // helps faster search by email
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    phone: {
      type: String,
    },
    qualification: {
      type: String,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>("Teacher", teacherSchema);
