import mongoose, { Document, Schema } from "mongoose";

interface IPoint {
  lat: number;
  lng: number;
  name: string;
}

export interface IRoute extends Document {
  name: string;
  stops: IPoint[];
}

const routeSchema = new Schema<IRoute>({
  name: String,
  stops: [
    {
      lat: Number,
      lng: Number,
      name: String
    }
  ]
});

export default mongoose.model<IRoute>("Route", routeSchema);
