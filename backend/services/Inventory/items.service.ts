import Item, { IItem } from "../../models/Inventory/Item";
import Category from "../../models/Inventory/Category";
import Vendor from "../../models/Inventory/Vendor";

export default {
  async createItem(data: Partial<IItem>) {
    // Check if category exists
    const category = await Category.findById(data.category);
    if (!category) throw new Error("Category not found");

   // Optional: Check if vendor exists
    if (data.vendor) {
      const vendor = await Vendor.findById(data.vendor);
      if (!vendor) throw new Error("Vendor not found");
    }

    const item = new Item(data);
    return item.save();
  },

  async getAllItems() {
    return Item.find().populate("category").populate("vendor");
  },

  async getItemById(id: string) {
    return Item.findById(id).populate("category").populate("vendor");
  },

  async updateItem(id: string, data: Partial<IItem>) {
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) throw new Error("Category not found");
    }
    if (data.vendor) {
      const vendor = await Vendor.findById(data.vendor);
      if (!vendor) throw new Error("Vendor not found");
    }

    return Item.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteItem(id: string) {
    return Item.findByIdAndDelete(id);
  },

  async adjustStock(itemId: string, quantity: number) {
    // Positive quantity → increase stock, Negative → decrease
    const item = await Item.findById(itemId);
    if (!item) throw new Error("Item not found");

    if (item.currentStock + quantity < 0)
      throw new Error("Insufficient stock");

    item.currentStock += quantity;
    return item.save();
  },
};
