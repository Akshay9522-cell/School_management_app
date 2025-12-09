import Issue, { IIssue } from "../../models/Inventory/issue"
import Item from "../../models/Inventory/Item";

export default {
  async issueItem(data: Partial<IIssue>) {
    // Find the item
    const item = await Item.findById(data.item);
    if (!item) throw new Error("Item not found");

    if (item.currentStock < data.quantity!)
      throw new Error("Insufficient stock");

    // Reduce stock
    item.currentStock -= data.quantity!;
    await item.save();

    // Create issue
    const issue = new Issue({
      ...data,
      pendingQuantity: data.quantity, // initial pending = quantity
    });

    return issue.save();
  },

  async getAllIssues() {
    return Issue.find().populate("item")
  },

  async getIssueById(id: string) {
    return Issue.findById(id).populate("item")
  },

  async deleteIssue(id: string) {
    const issue = await Issue.findById(id);
    if (!issue) throw new Error("Issue not found");

    // Restore stock
    const item = await Item.findById(issue.item);
    if (item) {
      item.currentStock += issue.quantity;
      await item.save();
    }

    return Issue.findByIdAndDelete(id);
  },
};
