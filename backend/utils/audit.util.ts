import { Types } from "mongoose";
import AuditLog from "../models/Inventory/AuditLog";

export type AuditPayload = {
  entity: string;
  entityId: string | Types.ObjectId;
  action: string;
  before?: any;
  after?: any;
  performedBy?: string | Types.ObjectId;
  meta?: any;
};

export const createAudit = async (payload: AuditPayload) => {
  const entityId =
    typeof payload.entityId === "string" ? new Types.ObjectId(payload.entityId) : payload.entityId;

  const performedBy =
    payload.performedBy && typeof payload.performedBy === "string"
      ? new Types.ObjectId(payload.performedBy)
      : payload.performedBy;

  return AuditLog.create({
    entity: payload.entity,
    entityId,
    action: payload.action,
    before: payload.before,
    after: payload.after,
    performedBy,
    performedAt: new Date(),
    meta: payload.meta,
  });
};
