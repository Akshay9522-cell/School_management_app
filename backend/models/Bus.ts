import mongoose, { Document, Schema } from "mongoose";

export interface IBus extends Document {
  registrationNo: string;
  driverName: string;
  driverPhone: string;
  route: mongoose.Types.ObjectId;
  location: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
}

const busSchema = new Schema<IBus>({
  registrationNo: { type: String, required: true, unique: true },
  driverName: String,
  driverPhone: String,
  route: { type: Schema.Types.ObjectId, ref: "Route" },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    updatedAt: Date
  }
});

export default mongoose.model<IBus>("Bus", busSchema);
