import { Request, Response } from "express";
import { recordPaymentService } from "../services/feePaymentService";

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const feeId = req.params.feeId;
    const { amount, method, reference, note } = req.body;
    const paidBy = (req as any).user?._id?.toString();

    const updatedFee = await recordPaymentService(feeId, { amount, method, reference, note, paidBy });

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: updatedFee,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message || "Error recording payment" });
  }
};
