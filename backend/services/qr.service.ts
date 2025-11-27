import QRCode from "qrcode";
import Classroom from "../models/classroom";

export const generateClassroomQRCode = async (classroomId: string) => {
  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) throw new Error("Classroom not found");

    const qrPayload = JSON.stringify({
    classroomCode: classroom.code,
  });

   

     return await QRCode.toDataURL(qrPayload);
  } catch (err) {
    throw new Error("Failed to generate QR code");
  }
};
