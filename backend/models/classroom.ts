import mongoose, { Schema, Document } from "mongoose";

export interface IClassroom extends Document<mongoose.Types.ObjectId> {
  name: string;
  code: string;
  location?: { lat: number; lng: number };
  _id: mongoose.Types.ObjectId;   // <-- FIX (important)
}

const ClassroomSchema = new Schema<IClassroom>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: {
    lat: Number,
    lng: Number,
  },
 
});

export default mongoose.model<IClassroom>("Classroom", ClassroomSchema);
