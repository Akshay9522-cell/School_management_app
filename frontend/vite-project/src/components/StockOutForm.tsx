import { useState, useEffect } from "react";
import { getItems, createStockOut } from "../api/inventoryApi";

const StockOutForm = ({ onSuccess }: any) => {
  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    issuedTo: "",
    purpose: "",
    reference: "",
  });

  useEffect(() => {
    (async () => {
      const data = await getItems({ page: 1, limit: 100 });
      setItems(data.items);
    })();
  }, []);

  const change = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    await createStockOut(formData);
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
        <label>Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Issued To (Department/User)</label>
        <input name="issuedTo" value={formData.issuedTo} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Purpose</label>
        <input name="purpose" value={formData.purpose} onChange={change} className="border p-2 w-full" />
      </div>

      <div>
        <label>Reference</label>
        <input name="reference" value={formData.reference} onChange={change} className="border p-2 w-full" />
      </div>

      <button className="bg-red-600 text-white p-2 rounded">Issue Stock</button>
    </form>
  );
};

export default StockOutForm;
