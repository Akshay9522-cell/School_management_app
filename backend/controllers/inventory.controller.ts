import { Request, Response } from "express";
import * as InventoryService from "../services/inventory.service";

const getPerformedBy = (req: any) => req.user?._id;

/* ------------------------ ITEMS ------------------------ */
export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await InventoryService.createItem(req.body, getPerformedBy(req));
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await InventoryService.updateItem(
      req.params.id,
      req.body,
      getPerformedBy(req)
    );
    res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listItems = async (req: Request, res: Response) => {
  try {
    const items = await InventoryService.listItems(req.query);
    res.status(200).json({ success: true, ...items });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ------------------------ STOCK ------------------------ */
export const createStockIn = async (req: Request, res: Response) => {
  try {
    const stock = await InventoryService.createStockIn({
      ...req.body,
      performedBy: getPerformedBy(req),
    });
    res.status(201).json({ success: true, data: stock });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createStockOut = async (req: Request, res: Response) => {
  try {
    const stock = await InventoryService.createStockOut({
      ...req.body,
      performedBy: getPerformedBy(req),
    });
    res.status(201).json({ success: true, data: stock });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await InventoryService.listTransactions(req.query);
    res.status(200).json({ success: true, ...transactions });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ------------------------ PAYMENTS ------------------------ */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await InventoryService.createPayment({
      ...req.body,
      createdBy: getPerformedBy(req),
    });
    res.status(201).json({ success: true, data: payment });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listPayments = async (req: Request, res: Response) => {
  try {
    const payments = await InventoryService.listPayments(req.query);
    res.status(200).json({ success: true, ...payments });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
