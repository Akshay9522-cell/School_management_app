import { Schema, model, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  entity: string;
  entityId: Types.ObjectId;
  action: string;
  before?: any;
  after?: any;
  performedBy?: Types.ObjectId;
  performedAt: Date;
  meta?: any;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    performedAt: { type: Date, default: Date.now },
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default model<IAuditLog>("AuditLog", AuditLogSchema);
