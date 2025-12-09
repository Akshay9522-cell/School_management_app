import Item from "../../models/Inventory/Item";

export default {
  async getLowStockItems() {
    return Item.find({ currentStock: { $lte: "$lowStockLimit" } });
  },
};
