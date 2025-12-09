import { Request, Response } from "express";
import VendorService from "../../services/Inventory/vendors.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const vendor = await VendorService.createVendor(req.body);
      res.status(201).json(vendor);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const vendors = await VendorService.getAllVendors();
    res.json(vendors);
  },

  async getById(req: Request, res: Response) {
    const vendor = await VendorService.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  },

  async update(req: Request, res: Response) {
    try {
      const vendor = await VendorService.updateVendor(req.params.id, req.body);
      res.json(vendor);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await VendorService.deleteVendor(req.params.id);
      res.json({ message: "Vendor deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
