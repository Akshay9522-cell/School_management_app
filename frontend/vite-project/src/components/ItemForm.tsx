import { useState, useEffect } from "react";
import { getSuppliers, createItem, updateItem } from "../api/inventoryApi";

interface Props {
  item?: any;
  onSuccess?: () => void;
}

const units = ["pcs", "box", "kg", "liter", "packet", "dozen"];

const ItemForm = ({ item, onSuccess }: Props) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: item?.name || "",
    sku: item?.sku || "",
    category: item?.category || "",
    unit: item?.unit || "pcs",
    description: item?.description || "",
    supplierId: item?.supplierId || "",
    barcode: item?.barcode || "",
    reorderLevel: item?.reorderLevel || 0,
    currentQuantity: item?.currentQuantity || 0,
    averageCost: item?.averageCost || 0,
    status: item?.status || "active",
  });

  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data.suppliers);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (item) await updateItem(item._id, formData);
      else await createItem(formData);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full" required />
      </div>

      <div>
        <label>SKU</label>
        <input name="sku" value={formData.sku} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Category</label>
        <input name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Unit</label>
        <select name="unit" value={formData.unit} onChange={handleChange} className="border p-2 w-full">
          {units.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Preferred Supplier</label>
        <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Barcode</label>
        <input name="barcode" value={formData.barcode} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Reorder Level</label>
        <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Current Quantity (Locked)</label>
        <input type="number" value={formData.currentQuantity} disabled className="border p-2 w-full bg-gray-100" />
      </div>

      <div>
        <label>Average Cost</label>
        <input type="number" name="averageCost" value={formData.averageCost} onChange={handleChange} className="border p-2 w-full" />
      </div>

      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
        {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
      </button>
    </form>
  );
};

export default ItemForm;
