import { Schema, model, Document } from "mongoose";

export interface IStop extends Document {
  name: string;
  lat: number;
  lng: number;
  order: number;          // order in route
  routeId: Schema.Types.ObjectId;
}

const stopSchema = new Schema<IStop>(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    order: { type: Number, required: true },

    routeId: { type: Schema.Types.ObjectId, ref: "Route", required: true },
  },
  { timestamps: true }
);

export default model<IStop>("Stop", stopSchema);
