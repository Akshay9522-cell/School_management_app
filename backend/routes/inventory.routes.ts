import { Router } from "express";
import * as InventoryController from "../controllers/inventory.controller";
import auth from "../middleware/auth";

const router = Router();

router.post("/items", auth, InventoryController.createItem);
router.put("/items/:id", auth, InventoryController.updateItem);
router.get("/items", auth, InventoryController.listItems);

router.post("/stock/in", auth, InventoryController.createStockIn);
router.post("/stock/out", auth, InventoryController.createStockOut);
router.get("/stock", auth, InventoryController.listTransactions);

router.post("/payments", auth, InventoryController.createPayment);
router.get("/payments", auth, InventoryController.listPayments);

export default router;
