import mongoose, { Schema, Document } from "mongoose";

export interface IHomework extends Document {
  classId: Schema.Types.ObjectId;   
  subject: string;
  teacherId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  attachment?: string;
  dueDate?: Date;
  expiresAt?:Date
}

const homeworkSchema = new Schema<IHomework>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subject: { type: String, required: true },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    title: { type: String, required: true },

    description: { type: String },

    attachment: { type: String },

    dueDate: { type: Date },
     expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expires: "0s" } // delete exactly on expiresAt
    }
  },
  { timestamps: true }
);

export default mongoose.model<IHomework>("Homework", homeworkSchema);
 