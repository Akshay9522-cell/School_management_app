import PO, { IPurchaseOrder } from "../../models/Inventory/purchaseOrder";
import Item from "../../models/Inventory/Item";

export default {
  async createPO(data: Partial<IPurchaseOrder>) {
    const po = new PO(data);
    return po.save();
  },

  async getAllPOs() {
    return PO.find().populate("vendor").populate("items.item");
  },

  async getPOById(id: string) {
    return PO.findById(id).populate("vendor").populate("items.item");
  },

  async updatePO(id: string, data: Partial<IPurchaseOrder>) {
    return PO.findByIdAndUpdate(id, data, { new: true });
  },

  async deletePO(id: string) {
    return PO.findByIdAndDelete(id);
  },

  async receivePO(id: string) {
    const po = await PO.findById(id).populate("items.item");
    if (!po) throw new Error("PO not found");
    if (po.status === "RECEIVED") throw new Error("PO already received");

    // Update stock for each item
    for (const poItem of po.items) {
      const item = await Item.findById(poItem.item._id);
      if (item) {
        item.currentStock += poItem.quantity;
        await item.save();
      }
    }

    po.status = "RECEIVED";
    po.receivedAt = new Date();
    return po.save();
  },
};
