// models/MeetingSOS.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IMeetingSOS extends Document {
  adminId: Types.ObjectId;
  teacherIds: Types.ObjectId[];
  message: string;
  channel: "web" | "whatsapp" | "sms";
  statusByTeacher: {
    teacher: Types.ObjectId;
    status: "queued" | "sent" | "seen" | "failed";
    seenAt?: Date;
    error?: string;
  }[];
  createdAt: Date;
}

const MeetingSOSSchema = new Schema<IMeetingSOS>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherIds: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: true }],
    message: { type: String, required: true },
    channel: { type: String, enum: ["web", "whatsapp", "sms"], default: "web" },
    statusByTeacher: [
      {
        teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
        status: {
          type: String,
          enum: ["queued", "sent", "seen", "failed"],
          default: "queued",
        },
        seenAt: Date,
        error: String,
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const MeetingSOS = model<IMeetingSOS>("MeetingSOS", MeetingSOSSchema);
