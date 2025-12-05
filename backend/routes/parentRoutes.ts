import { Router } from "express";
import  auth  from "../middleware/auth";
import { getMyBus } from "../controllers/parent.controller";

const router = Router();

router.get("/my-bus", auth, getMyBus);

export default router;
