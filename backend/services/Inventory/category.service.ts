import Category, { ICategory } from "../../models/Inventory/Category";

export default {
  async createCategory(data: Partial<ICategory>) {
    const exists = await Category.findOne({ name: data.name });
    if (exists) throw new Error("Category already exists");

    const category = new Category(data);
    console.log(data)
    return category.save();
  },

  async getAllCategories() {
    return Category.find();
  },

  async getCategoryById(id: string) {
    return Category.findById(id);
  },

  async updateCategory(id: string, data: Partial<ICategory>) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCategory(id: string) {
    return Category.findByIdAndDelete(id);
  },
};
