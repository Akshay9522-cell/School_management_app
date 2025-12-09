import { Request, Response } from "express";
import ReturnService from "../../services/Inventory/return.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const ret = await ReturnService.processReturn(req.body);
      res.status(201).json(ret);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const returns = await ReturnService.getAllReturns();
    res.json(returns);
  },

  async getById(req: Request, res: Response) {
    const ret = await ReturnService.getReturnById(req.params.id);
    if (!ret) return res.status(404).json({ message: "Return not found" });
    res.json(ret);
  },

  async delete(req: Request, res: Response) {
    try {
      await ReturnService.deleteReturn(req.params.id);
      res.json({ message: "Return deleted and stock updated" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
