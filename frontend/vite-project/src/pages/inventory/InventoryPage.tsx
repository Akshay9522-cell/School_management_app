// src/pages/InventoryPage.tsx
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";

type Item = {
  _id: string;
  category: string;
  name: string;
  unit: string;
  price: number;
  totalItem: number;
  vendor?: string;
  lowStockLimit: number;
  totalPrice?: number;
  lowStock?: boolean;
};

type NewItemForm = {
  category: string;
  name: string;
  unit: string;
  price: string;
  vendor: string;
  lowStockLimit: string;
};

type StockForm = {
  itemId: string;
  quantity: string;
};

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<NewItemForm>({
    category: "",
    name: "",
    unit: "",
    price: "",
    vendor: "",
    lowStockLimit: "",
  });

  const [stockInForm, setStockInForm] = useState<StockForm>({
    itemId: "",
    quantity: "",
  });

  const [stockOutForm, setStockOutForm] = useState<StockForm>({
    itemId: "",
    quantity: "",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Item[]>("/inventory/items");
      setItems(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleNewItemChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockInChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStockInForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockOutChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStockOutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await api.post("/inventory/items", {
        category: newItem.category,
        name: newItem.name,
        unit: newItem.unit,
        price: Number(newItem.price),
        vendor: newItem.vendor || undefined,
        lowStockLimit: Number(newItem.lowStockLimit || 0),
      });
      setNewItem({
        category: "",
        name: "",
        unit: "",
        price: "",
        vendor: "",
        lowStockLimit: "",
      });
      await fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create item");
    }
  };

  const handleStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockInForm.itemId || !stockInForm.quantity) return;

    try {
      setError(null);
      await api.post(`/inventory/items/${stockInForm.itemId}/stock-in`, {
        quantity: Number(stockInForm.quantity),
      });
      setStockInForm({ itemId: "", quantity: "" });
      await fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add stock");
    }
  };

  const handleStockOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockOutForm.itemId || !stockOutForm.quantity) return;

    try {
      setError(null);
      await api.post(`/inventory/items/${stockOutForm.itemId}/stock-out`, {
        quantity: Number(stockOutForm.quantity),
      });
      setStockOutForm({ itemId: "", quantity: "" });
      await fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove stock");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-2">Inventory</h1>

      {error && (
        <div className="rounded bg-red-100 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Top cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="text-2xl font-bold">
            {items.filter((i) => i.lowStock).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Stock Value</p>
          <p className="text-2xl font-bold">
            {items
              .reduce(
                (sum, i) => sum + (i.totalPrice ?? i.price * i.totalItem),
                0
              )
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Forms */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* New item */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Add Item</h2>
          <form className="space-y-3" onSubmit={handleCreateItem}>
            <input
              name="category"
              value={newItem.category}
              onChange={handleNewItemChange}
              placeholder="Category"
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
            <input
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
              placeholder="Item name"
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
            <div className="flex gap-2">
              <input
                name="unit"
                value={newItem.unit}
                onChange={handleNewItemChange}
                placeholder="Unit (pcs, box)"
                className="w-1/2 rounded border px-3 py-2 text-sm"
                required
              />
              <input
                name="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={handleNewItemChange}
                placeholder="Price"
                className="w-1/2 rounded border px-3 py-2 text-sm"
                required
              />
            </div>
            <input
              name="vendor"
              value={newItem.vendor}
              onChange={handleNewItemChange}
              placeholder="Vendor (optional)"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <input
              name="lowStockLimit"
              type="number"
              value={newItem.lowStockLimit}
              onChange={handleNewItemChange}
              placeholder="Low stock limit"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Item
            </button>
          </form>
        </div>

        {/* Stock IN */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Stock In</h2>
          <form className="space-y-3" onSubmit={handleStockIn}>
            <select
              name="itemId"
              value={stockInForm.itemId}
              onChange={handleStockInChange}
              className="w-full rounded border px-3 py-2 text-sm"
              required
            >
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              value={stockInForm.quantity}
              onChange={handleStockInChange}
              placeholder="Quantity"
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Add Stock
            </button>
          </form>
        </div>

        {/* Stock OUT */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Stock Out</h2>
          <form className="space-y-3" onSubmit={handleStockOut}>
            <select
              name="itemId"
              value={stockOutForm.itemId}
              onChange={handleStockOutChange}
              className="w-full rounded border px-3 py-2 text-sm"
              required
            >
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              value={stockOutForm.quantity}
              onChange={handleStockOutChange}
              placeholder="Quantity"
              className="w-full rounded border px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Remove Stock
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Items</h2>
          {loading && (
            <span className="text-xs text-gray-500">Loading...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Total Price</th>
                <th className="px-3 py-2">Vendor</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-4 text-center text-sm text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{item.category}</td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.unit}</td>
                  <td className="px-3 py-2">
                    ₹ {Number(item.price ?? 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{item.totalItem}</td>
                  <td className="px-3 py-2">
                   ₹{" "}
                    {Number(
                    item.totalPrice ?? (item.price ?? 0) * (item.totalItem ?? 0)
                    ).toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    {item.vendor || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {item.lowStock ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        Low stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
