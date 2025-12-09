import Item from "../../models/Inventory/Item";
import Issue from "../../models/Inventory/issue";
import ReturnModel from "../../models/Inventory/return";
import PurchaseOrder from "../../models/Inventory/purchaseOrder";

export default {
  // Stock Summary
  async stockReport() {
    return Item.find()
      .populate("category")
      .populate("vendor")
      .select("name currentStock lowStockLimit category vendor");
  },

  // Usage Report (Issued items)
  async usageReport() {
    return Issue.find()
      .populate("item")
      .populate("issuedBy")
      .select("item quantity issuedTo issuedAt");
  },

  // Returns Report
  async returnReport() {
    return ReturnModel.find()
      .populate("item")
      .populate("issue")
      .select("item quantity returnedBy returnedAt condition");
  },

  // Purchase Order Status Report
  async poStatusReport() {
    return PurchaseOrder.find()
      .populate("vendor")
      .populate("items.item")
      .select("vendor items status orderedAt expectedArrival receivedAt");
  },
};
