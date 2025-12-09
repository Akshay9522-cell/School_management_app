import express from "express";
import  CategoryController from "../../controllers/Inventory/category.controller";
import ItemController from "../../controllers/Inventory/items.controller";
import VendorController from '../../controllers/Inventory/vendors.controller';
import POController from '../../controllers/Inventory/purchaseOrder.controller'
import IssueController from '../../controllers/Inventory/issue.controller'
import ReturnController from '../../controllers/Inventory/return.controller'
import ReportsController from '../../controllers/Inventory/reports.controller'
const router = express.Router();

router.post("/cat/add", CategoryController.create);
router.get("/cat/all", CategoryController.getAll);
router.get("/cat/:id", CategoryController.getById);
router.put("/cat/:id", CategoryController.update);
router.delete("/cat/:id", CategoryController.delete);

router.post("/item/add", ItemController.create);
router.get("/item/all", ItemController.getAll);
router.get("/item/:id", ItemController.getById);
router.put("/item/:id", ItemController.update);
router.delete("/item/:id", ItemController.delete);


router.post("/vendors/add", VendorController.create);
router.get("/vendors/all", VendorController.getAll);
router.get("/vendors/:id", VendorController.getById);
router.put("/vendors/:id", VendorController.update);
router.delete("/vendors/:id", VendorController.delete);

router.post("/PO/add", POController.create);
router.get("/PO/all", POController.getAll);
router.get("/PO/:id", POController.getById);
router.put("/PO/:id", POController.update);
router.delete("/PO/:id", POController.delete);
// ✅ Receive PO and update stock
router.post("/PO/:id/recieve", POController.receive);

router.post("/issue/add", IssueController.create);
router.get("/issue/all", IssueController.getAll);
router.get("/issue/:id", IssueController.getById);
router.delete("/issue/:id", IssueController.delete);

router.post("/return/add", ReturnController.create);
router.get("/return/all", ReturnController.getAll);
router.get("/return/:id", ReturnController.getById);
router.delete("/return/:id", ReturnController.delete);

router.get("/reports/low-stock", ReportsController.lowStock);
router.get("/reports/stock", ReportsController.stockReport);
router.get("/reports/usage", ReportsController.usageReport);
router.get("/reports/returns", ReportsController.returnReport);
router.get("/reports/po-status", ReportsController.poStatusReport);

export default router;
