import { Router } from "express";
import {
  createStop,
  getStops,
  getStopById,
  updateStop,
  deleteStop
} from "../../controllers/Bus Tracking/stop.controller";

const router = Router();

router.post("/create", createStop);
router.get("/get", getStops);
router.get("/:id", getStopById);
router.put("/:id", updateStop);
router.delete("/:id", deleteStop);

export default router;
