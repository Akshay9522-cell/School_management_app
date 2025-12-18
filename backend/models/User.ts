import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "parent" | "student";

  children?: Schema.Types.ObjectId[];
  profileCompleted?: boolean; // ✅ new
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "teacher", "parent", "student"],
    default: "teacher",
  },

  children: [{ type: Schema.Types.ObjectId, ref: "Student", default: [] }],

  // ✅ new field – used for teachers to track profile completion
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
