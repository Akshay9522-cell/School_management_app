import { Request, Response } from "express";
import { buildClassWeeklyReport } from "../../services/weeklyReportService";

export const getClassWeeklyReport = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!classId || !start || !end) {
      return res.status(400).json({ message: "classId, start, end required" });
    }

    const report = await buildClassWeeklyReport(classId, start, end);
    res.json(report);
  } catch (err) {
    console.error("Weekly report error:", err);
    res.status(500).json({ message: "Failed to generate weekly report" });
  }
};
