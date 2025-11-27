// src/components/Inventory/ItemList.tsx
import { useState } from "react";
import ItemForm from "./ItemForm";

type Item = {
  _id: string;
  name: string;
  sku?: string;
  unit: string;
  currentQuantity: number;
  averageCost: number;
};

type ItemListProps = {
  items: Item[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

const ItemList: React.FC<ItemListProps> = ({ items, loading, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingItem(null);
          setShowForm(true);
        }}
      >
        Add Item
      </button>

      {showForm && (
        <ItemForm
          item={editingItem}
          onSuccess={() => {
            setShowForm(false);
            onRefresh();
          }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">SKU</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Avg Cost</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.sku || "-"}</td>
                <td className="border px-2 py-1">{item.unit}</td>
                <td className="border px-2 py-1">{item.currentQuantity}</td>
                <td className="border px-2 py-1">{item.averageCost}</td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemList;
