import { Request, Response } from "express";
import CategoryService from "../../services/Inventory/category.service";

export default {
  async create(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
 
      
      res.status(201).json(category);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  },

  async getById(req: Request, res: Response) {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  },

  async update(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
};
