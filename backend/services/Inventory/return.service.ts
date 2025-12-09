import ReturnModel, { IReturn } from "../../models/Inventory/return";
import Issue from "../../models/Inventory/issue";
import Item from "../../models/Inventory/Item";

export default {
  async processReturn(data: Partial<IReturn>) {
    const issue = await Issue.findById(data.issue);
    if (!issue) throw new Error("Related issue not found");

    const item = await Item.findById(data.item);
    if (!item) throw new Error("Item not found");

    if (data.quantity! > issue.quantity)
      throw new Error("Return quantity exceeds issued quantity");

    // Update stock
    item.currentStock += data.quantity!;
    await item.save();

    // Update pending quantity in issue
    issue.quantity -= data.quantity!;
    await issue.save();

    // Create return record
    const ret = new ReturnModel(data);
    return ret.save();
  },

  async getAllReturns() {
    return ReturnModel.find().populate("item").populate("issue");
  },

  async getReturnById(id: string) {
    return ReturnModel.findById(id).populate("item").populate("issue");
  },

  async deleteReturn(id: string) {
    const ret = await ReturnModel.findById(id);
    if (!ret) throw new Error("Return not found");

    const item = await Item.findById(ret.item);
    if (item) {
      item.currentStock -= ret.quantity;
      await item.save();
    }

    // Restore pending quantity in issue
    const issue = await Issue.findById(ret.issue);
    if (issue) {
      issue.quantity += ret.quantity;
      await issue.save();
    }

    return ReturnModel.findByIdAndDelete(id);
  },
};
