import { Request, Response } from "express";
import { buildClassWeeklyReport } from "../../services/weeklyReportService";
import { sendClassWeeklyReports } from "../../services/whatsappService";

export const sendWeeklyReports = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!classId || !start || !end) {
      return res.status(400).json({ message: "classId, start, end required" });
    }

    const report = await buildClassWeeklyReport(classId, start, end);

    const result = await sendClassWeeklyReports(
      classId,
      start,
      end,
      report.students
    );

    res.json({
      message: `Sent ${result.success} reports, ${result.failed} failed`,
      result,
    });
  } catch (err: any) {
    console.error("WhatsApp send error:", err);
    res.status(500).json({
      message: "Failed to send WhatsApp reports",
      error: err.message,
    });
  }
};
