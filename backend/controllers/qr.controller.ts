import { Request, Response } from "express";
import { generateClassroomQRCode } from "../services/qr.service";

export const getClassroomQRCode = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params;
    const qrCode = await generateClassroomQRCode(classroomId);
    res.status(200).json({ success: true, qrCode });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
