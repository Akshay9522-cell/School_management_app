import { z } from "zod";

/* ---------------------------------------------------
   ITEM CREATE / UPDATE SCHEMA
--------------------------------------------------- */
export const itemCreateSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
  sku: z.string().trim().optional(),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  
  reorderLevel: z.number().int().nonnegative().optional(),
  currentQuantity: z.number().int().nonnegative().optional(),
  averageCost: z.number().nonnegative().optional(),

  location: z.string().trim().optional(),

  // Better than z.any()
  customFields: z.any().optional(),
});
export const stockTransactionSchema = z.object({
  itemId: z.string().trim().min(1),

  type: z.enum(["IN", "OUT", "ADJUSTMENT", "TRANSFER"]),

  quantity: z.number().positive(),

  unitCost: z.number().nonnegative().optional(),

  supplier: z.string().trim().optional(),
  reference: z.string().trim().optional(),

  locationFrom: z.string().trim().optional(),
  locationTo: z.string().trim().optional(),

  reason: z.string().trim().optional(),
});
export const paymentCreateSchema = z.object({
  amount: z.number().positive(),

  currency: z.string().trim().default("INR"),

  paymentDate: z.string().datetime().optional(),

  paidTo: z.string().trim().optional(),
  reference: z.string().trim().optional(),

  paymentMode: z
    .enum(["CASH", "BANK_TRANSFER", "CHEQUE", "CARD", "UPI", "OTHER"])
    .optional(),

  note: z.string().trim().optional(),

  relatedStockTransaction: z.string().trim().optional(),
  relatedItem: z.string().trim().optional(),
});
