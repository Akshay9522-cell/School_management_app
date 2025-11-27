// inventory.service.ts
import mongoose, { Types } from "mongoose";
import InventoryItem, { IInventoryItem } from "../models/Inventory/InventoryItem";
import StockTransaction, { IStockTransaction } from "../models/Inventory/StockTransition";
import PaymentRecord, { IPaymentRecord } from "../models/Inventory/PaymentRecord";
import { createAudit } from "../utils/audit.util";

/* ------------------------------------------------------
   CREATE INVENTORY ITEM
------------------------------------------------------ */
export const createItem = async (payload: Partial<IInventoryItem>, performedBy?: string) => {
  const item = await InventoryItem.create(payload);

  await createAudit({
    entity: "InventoryItem",
    entityId: item._id as Types.ObjectId,
    action: "CREATE",
    after: item,
    performedBy,
  });

  return item;
};

/* ------------------------------------------------------
   UPDATE INVENTORY ITEM
------------------------------------------------------ */
export const updateItem = async (id: string, payload: Partial<IInventoryItem>, performedBy?: string) => {
  const prev = await InventoryItem.findById(id);
  const item = await InventoryItem.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  await createAudit({
    entity: "InventoryItem",
    entityId: id,
    action: "UPDATE",
    before: prev,
    after: item,
    performedBy,
  });

  return item;
};

/* ------------------------------------------------------
   STOCK IN (PURCHASE)
------------------------------------------------------ */
export const createStockIn = async (payload: {
  itemId: string;
  quantity: number;
  unitCost?: number;
  supplier?: string;
  reference?: string;
  performedBy?: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId, quantity, unitCost, supplier, reference, performedBy } = payload;

    const item = await InventoryItem.findById(itemId).session(session);
    if (!item) throw new Error("Inventory item not found");

    // Create Stock Transaction
    const tx = await StockTransaction.create(
      [
        {
          itemId,
          type: "IN",
          quantity,
          unitCost,
          totalCost: unitCost ? unitCost * quantity : undefined,
          supplier,
          reference,
          performedBy,
        },
      ],
      { session }
    );

    const oldQty = item.currentQuantity || 0;
    const oldAvg = item.averageCost || 0;
    const newQty = oldQty + quantity;

    // Weighted average cost
    if (unitCost !== undefined) {
      item.averageCost = ((oldQty * oldAvg) + (quantity * unitCost)) / newQty;
    }

    item.currentQuantity = newQty;
    item.lastPurchasedAt = new Date();
    await item.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Audit logs
    await createAudit({
      entity: "StockTransaction",
      entityId: tx[0]._id as Types.ObjectId,
      action: "STOCK_IN",
      after: tx[0],
      performedBy,
      meta: { oldQty, newQty, newAvg: item.averageCost },
    });

    await createAudit({
      entity: "InventoryItem",
      entityId: item._id as Types.ObjectId,
      action: "UPDATE_AFTER_STOCK_IN",
      after: item,
      performedBy,
    });

    return { transaction: tx[0], item };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ------------------------------------------------------
   STOCK OUT (ISSUE)
------------------------------------------------------ */
export const createStockOut = async (payload: {
  itemId: string;
  quantity: number;
  reason?: string;
  reference?: string;
  performedBy?: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId, quantity, reason, reference, performedBy } = payload;

    const item = await InventoryItem.findById(itemId).session(session);
    if (!item) throw new Error("Inventory item not found");

    const oldQty = item.currentQuantity || 0;
    if (quantity > oldQty) throw new Error("Insufficient stock");

    const tx = await StockTransaction.create(
      [
        {
          itemId,
          type: "OUT",
          quantity,
          totalCost: (item.averageCost || 0) * quantity,
          reason,
          reference,
          performedBy,
        },
      ],
      { session }
    );

    item.currentQuantity = oldQty - quantity;
    await item.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Audit logs
    await createAudit({
      entity: "StockTransaction",
      entityId: tx[0]._id as Types.ObjectId,
      action: "STOCK_OUT",
      after: tx[0],
      performedBy,
      meta: { oldQty, newQty: item.currentQuantity },
    });

    return { transaction: tx[0], item };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ------------------------------------------------------
   LIST ITEMS
------------------------------------------------------ */
export const listItems = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: any = {};

  if (query.q) {
    filters.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { sku: { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.category) filters.category = query.category;
  if (query.location) filters.location = query.location;

  if (query.reorderOnly === "true") {
    filters.$expr = { $lt: ["$currentQuantity", "$reorderLevel"] };
  }

  const [items, total] = await Promise.all([
    InventoryItem.find(filters).skip(skip).limit(limit).lean(),
    InventoryItem.countDocuments(filters),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

/* ------------------------------------------------------
   LIST STOCK TRANSACTIONS
------------------------------------------------------ */
export const listTransactions = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: any = {};
  if (query.q) {
    filters.$or = [
      { type: { $regex: query.q, $options: "i" } },
      { reference: { $regex: query.q, $options: "i" } },
    ];
  }
  if (query.itemId) filters.itemId = query.itemId;

  const [transactions, total] = await Promise.all([
    StockTransaction.find(filters).skip(skip).limit(limit).lean(),
    StockTransaction.countDocuments(filters),
  ]);

  return { transactions, total, page, limit, pages: Math.ceil(total / limit) };
};

/* ------------------------------------------------------
   CREATE PAYMENT (FINAL CLEAN VERSION)
------------------------------------------------------ */
export const createPayment = async (payload: Partial<IPaymentRecord>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await PaymentRecord.create(
      [
        {
          amount: payload.amount,
          currency: payload.currency || "INR",
          paymentDate: payload.paymentDate ? new Date(payload.paymentDate) : new Date(),
          paidTo: payload.paidTo,
          reference: payload.reference,
          paymentMode: payload.paymentMode || "CASH",
          note: payload.note,
          relatedItem: payload.relatedItem,
          relatedStockTransaction: payload.relatedStockTransaction,
          createdBy: payload.createdBy,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await createAudit({
      entity: "PaymentRecord",
      entityId: payment[0]._id as Types.ObjectId,
      action: "CREATE",
      after: payment[0],
      performedBy: payload.createdBy,
    });

    return payment[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ------------------------------------------------------
   LIST PAYMENTS
------------------------------------------------------ */
export const listPayments = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: any = {};

  if (query.paidTo) filters.paidTo = query.paidTo;
  if (query.relatedItem) filters.relatedItem = query.relatedItem;

  if (query.from || query.to) {
    filters.paymentDate = {};
    if (query.from) filters.paymentDate.$gte = new Date(query.from);
    if (query.to) filters.paymentDate.$lte = new Date(query.to);
  }

  const [payments, total] = await Promise.all([
    PaymentRecord.find(filters).skip(skip).limit(limit).sort({ paymentDate: -1 }).lean(),
    PaymentRecord.countDocuments(filters),
  ]);

  return { payments, total, page, limit, pages: Math.ceil(total / limit) };
};
