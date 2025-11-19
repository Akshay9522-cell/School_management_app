import { Request, Response } from "express";
import { generateMonthlyFeesService } from "../services/feeGenerationService";

export const generateMonthlyFees = async (req: Request, res: Response) => {
  try {
    const { month, year, classId } = req.body;
    const generatedBy = (req as any).user?._id?.toString();

    const result = await generateMonthlyFeesService({ month, year, classId, generatedBy });

    return res.status(201).json({
      success: true,
      message: "Fee generation completed",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message || "Error generating fees" });
  }
};
