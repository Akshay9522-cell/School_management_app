import React, { useState, useEffect } from "react";
import { getVendors, getItems, createPO } from "../../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

interface Vendor {
  _id?: string;
  name?: string;
}

interface Item {
  _id?: string;
  name: string;
  currentStock: number;
}

interface POItem {
  itemId: string;
  quantity: number;
}

export default function POAdd() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [poItems, setPOItems] = useState<POItem[]>([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const venRes = await getVendors();
      setVendors(venRes.data || venRes);

      const itemRes = await getItems();
      setItems(itemRes.data || itemRes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = () => {
    setPOItems([...poItems, { itemId: "", quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: "itemId" | "quantity", value: string | number) => {
    const updated = [...poItems];
  if (field === "itemId") {
    updated[index].itemId = value as string; // cast to string
  } else if (field === "quantity") {
    updated[index].quantity = value as number; // cast to number
  }
    setPOItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...poItems];
    updated.splice(index, 1);
    setPOItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || poItems.length === 0) return;

    const payload = {
      vendor: selectedVendor,
      items: 
      poItems.map(i => ({ 
        item: i.itemId, 
        quantity: i.quantity }))
    };
 console.log(payload)
    try {
      await createPO(payload);
      navigate("/dashboard/poList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Purchase Order</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Vendor</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Vendor</option>
            {vendors.map(v => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Items</label>
          {poItems.map((poItem, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={poItem.itemId}
                onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                className="border p-2 rounded flex-1"
                required
              >
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={poItem.quantity}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                className="border p-2 rounded w-24"
                required
              />
              <button type="button" onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-2 rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Create PO</button>
      </form>
    </div>
  );
}
