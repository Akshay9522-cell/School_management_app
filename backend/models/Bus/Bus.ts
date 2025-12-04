import { Schema, model, Document } from "mongoose";

export interface IBus extends Document {
  busNumber: string;
  driverName: string;
  driverPhone: string;

  deviceId?: string;     // for GPS device or driver app
  isOnline: boolean;

  currentLat?: number;
  currentLng?: number;
  lastUpdated?: Date;
  currentStopIndex?: number;

  routeId?: Schema.Types.ObjectId; // assigned route
}

const busSchema = new Schema<IBus>(
  {
    busNumber: { type: String, required: true, unique: true },

    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },

    deviceId: { type: String, default: null },

    isOnline: { type: Boolean, default: false },

    currentLat: { type: Number, default: null },
    currentLng: { type: Number, default: null },
    lastUpdated: { type: Date, default: null },

    routeId: { type: Schema.Types.ObjectId, ref: "Route", default: null },
    currentStopIndex: { type: Number, default: 0 },

  },
  { timestamps: true }
);

export default model<IBus>("Bus", busSchema);
