import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoute extends Document {
  name: string;
  description?: string;
  busId?: Schema.Types.ObjectId;
  stops: Types.ObjectId[];
}

const routeSchema = new Schema<IRoute>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    busId: { type: Schema.Types.ObjectId, ref: "Bus", default: null },
    stops: [{ type: Schema.Types.ObjectId, ref: "Stop", default: [] }]
  },
  { timestamps: true }
);

// ✅ Type-safe model exporting
const RouteModel: mongoose.Model<IRoute> =
  (mongoose.models.Route as mongoose.Model<IRoute>) ||
  mongoose.model<IRoute>("Route", routeSchema);

export default RouteModel;
