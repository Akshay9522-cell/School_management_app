// src/routes/inventory.routes.ts
import { Router } from "express";
import {
  createItemController,
  getItemsController,
  stockInController,
  stockOutController,
} from "../../controllers/Inventory/inventory.controller";

const router = Router();

// Create item
router.post("/items", createItemController);

// List items
router.get("/items", getItemsController);

// Stock IN
router.post("/items/:id/stock-in", stockInController);

// Stock OUT
router.post("/items/:id/stock-out", stockOutController);

export default router;
