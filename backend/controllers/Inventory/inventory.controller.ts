// src/controllers/inventory.controller.ts
import { Request, Response } from "express";
import { Item } from "../../models/Inventory/item.model";
import { createItem, stockIn, stockOut } from "../../services/Inventory/inventory.service";

// Create item
export const createItemController = async (req: Request, res: Response) => {
  try {
    const item = await createItem(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// List items with low stock flag
export const getItemsController = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find().lean();

    const result = items.map((i: any) => ({
      ...i,
      totalPrice: i.price * i.totalItem,
      lowStock: i.totalItem <= i.lowStockLimit,
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Stock IN
export const stockInController = async (req: Request, res: Response) => {
  try {
    const { quantity, date } = req.body;
    const item = await stockIn(req.params.id, Number(quantity), date);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Stock OUT
export const stockOutController = async (req: Request, res: Response) => {
  try {
    const { quantity, date } = req.body;
    const item = await stockOut(req.params.id, Number(quantity), date);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
