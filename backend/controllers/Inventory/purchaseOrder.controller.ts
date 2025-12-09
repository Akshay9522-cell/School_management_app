import { Request, Response } from "express";
import POService from "../../services/Inventory/purchaseOrder.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const po = await POService.createPO(req.body);
      console.log(req.body)
      res.status(201).json(po);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const pos = await POService.getAllPOs();
    res.json(pos);
  },

  async getById(req: Request, res: Response) {
    const po = await POService.getPOById(req.params.id);
    if (!po) return res.status(404).json({ message: "PO not found" });
    res.json(po);
  },

  async update(req: Request, res: Response) {
    try {
      const po = await POService.updatePO(req.params.id, req.body);
      res.json(po);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await POService.deletePO(req.params.id);
      res.json({ message: "PO deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async receive(req: Request, res: Response) {
    try {
      const po = await POService.receivePO(req.params.id);
      console.log(req.params.id)
      res.json({ success: true, message: "PO Received Successfully", po });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  
};
