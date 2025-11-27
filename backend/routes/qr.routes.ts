import { Router } from "express";
import { getClassroomQRCode } from "../controllers/qr.controller";

const router = Router();

router.get("/:classroomId", getClassroomQRCode);

export default router;
