import { Request, Response } from "express";
import ItemService from "../../services/Inventory/items.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const item = await ItemService.createItem(req.body);
         
      res.status(201).json(item);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const items = await ItemService.getAllItems();
    res.json(items);
  },

  async getById(req: Request, res: Response) {
    const item = await ItemService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  },

  async update(req: Request, res: Response) {
    try {
      const item = await ItemService.updateItem(req.params.id, req.body);
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await ItemService.deleteItem(req.params.id);
      res.json({ message: "Item deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
