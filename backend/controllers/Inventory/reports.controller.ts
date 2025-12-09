import { Request, Response } from "express";
import ReportsService from "../../services/Inventory/reports.service";
import AlertsService from "../../services/Inventory/alerts.service";

export default {
  async lowStock(req: Request, res: Response) {
    const items = await AlertsService.getLowStockItems();
    res.json(items);
  },

  async stockReport(req: Request, res: Response) {
    const report = await ReportsService.stockReport();
    res.json(report);
  },

  async usageReport(req: Request, res: Response) {
    const report = await ReportsService.usageReport();
    res.json(report);
  },

  async returnReport(req: Request, res: Response) {
    const report = await ReportsService.returnReport();
    res.json(report);
  },

  async poStatusReport(req: Request, res: Response) {
    const report = await ReportsService.poStatusReport();
    res.json(report);
  },
};
