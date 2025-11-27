import { useState, useEffect } from "react";
import { getItems, getSuppliers, createStockIn } from "../api/inventoryApi";

const StockInForm = ({ onSuccess }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    itemId: "",
    supplierId: "",
    quantity: 0,
    unitCost: 0,
    reference: "",
    description: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const i = await getItems({ page: 1, limit: 100 });
    const s = await getSuppliers();
    setItems(i.items);
    setSuppliers(s.suppliers);
  };

  const change = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    await createStockIn(formData);
    onSuccess?.();
  };

  return (
    <form onSubmit={submit} className="space-y-4 p-4 border rounded">

      <div>
        <label>Item</label>
        <select name="itemId" value={formData.itemId} onChange={change} className="border p-2 w-full" required>
          <option value="">Select item</option>
          {items.map((i) => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>
      </div>

      <div>
        <label>Supplier</label>
        <select name="supplierId" value={formData.supplierId} onChange={change} className="border p-2 w-full">
          <option value="">Select supplier</option>
          {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label>Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Unit Cost</label>
        <input type="number" name="unitCost" value={formData.unitCost} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Reference</label>
        <input name="reference" value={formData.reference} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={change} className="border p-2 w-full" />
      </div>

      <button className="bg-green-600 text-white p-2 rounded">Add Stock</button>
    </form>
  );
};

export default StockInForm;
