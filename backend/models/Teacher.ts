import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  userId:mongoose.Types.ObjectId
  name: string;
  email: string;
  subject: string;
  phone?: string;
  qualification?: string;
  joiningDate?: Date;
  isActive: boolean;
  classIds?: mongoose.Schema.Types.ObjectId[]; // <-- ADD THIS
  classrooms:string[]
}

const teacherSchema = new Schema<ITeacher>(
  {

    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
     

    },
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    
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
     classrooms: [{ type: Schema.Types.ObjectId, ref: "Classroom" }],
  },
  
  { timestamps: true }
);

export default mongoose.model<ITeacher>("Teacher", teacherSchema);
