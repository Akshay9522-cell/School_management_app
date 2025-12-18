import { Router } from "express";
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from "../../controllers/Bus Tracking/route.controller";

const router = Router();

router.post("/create-route", createRoute);
router.get("/get", getRoutes);
router.get("/:id", getRouteById);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;
