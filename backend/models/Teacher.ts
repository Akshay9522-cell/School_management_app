import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  qualification?: string;
  joiningDate?: Date;
  isActive: boolean;
  classIds?: mongoose.Schema.Types.ObjectId[]; // <-- ADD THIS
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
      index: true,
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

    // ✅ FIX: Add classId
   classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class",default:[]}],
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>("Teacher", teacherSchema);
