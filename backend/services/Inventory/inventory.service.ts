// src/services/inventory.service.ts
import { Item } from "../../models/Inventory/item.model";
import { Transaction } from "../../models/Inventory/transaction.model";

export async function createItem(data: {
  category: string;
  name: string;
  unit: string;
  price: number;
  vendor?: string;
  lowStockLimit: number;
}) {
  const item = await Item.create({
    ...data,
    totalItem: 0,
  });
  return item;
}

export async function stockIn(itemId: string, quantity: number, date?: Date) {
  const item = await Item.findById(itemId);
  if (!item) throw new Error("Item not found");

  item.totalItem += quantity;
  await item.save();

  await Transaction.create({
    item: item._id,
    type: "IN",
    quantity,
    date: date || new Date(),
  });

  return item;
}

export async function stockOut(itemId: string, quantity: number, date?: Date) {
  const item = await Item.findById(itemId);
  if (!item) throw new Error("Item not found");

  if (item.totalItem < quantity) {
    throw new Error("Not enough stock");
  }

  item.totalItem -= quantity;
  await item.save();

  await Transaction.create({
    item: item._id,
    type: "OUT",
    quantity,
    date: date || new Date(),
  });

  return item;
}
