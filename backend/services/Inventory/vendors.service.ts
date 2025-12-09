import Vendor, { IVendor } from "../../models/Inventory/Vendor";

export default {
  async createVendor(data: Partial<IVendor>) {
    const exists = await Vendor.findOne({ name: data.name });
    if (exists) throw new Error("Vendor already exists");

    const vendor = new Vendor(data);
    return vendor.save();
  },

  async getAllVendors() {
    return Vendor.find();
  },

  async getVendorById(id: string) {
    return Vendor.findById(id);
  },

  async updateVendor(id: string, data: Partial<IVendor>) {
    return Vendor.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteVendor(id: string) {
    return Vendor.findByIdAndDelete(id);
  },
};
