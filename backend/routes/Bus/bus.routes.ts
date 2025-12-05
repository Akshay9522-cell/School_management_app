import { Router } from "express";
import {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
  assignRouteToBus
} from "../../controllers/bus.controller";
import { updateBusLocation } from "../../controllers/busLocation.controller";

const router = Router();

router.post("/create-bus", createBus);
router.post('/update-location',updateBusLocation)
router.get("/get", getBuses);
router.get("/:id", getBusById);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);
router.post("/assign-route", assignRouteToBus);

export default router;
