// src/pages/Inventory/ItemsPage.tsx
import { useEffect, useState } from "react";
import { getItems } from "../../api/inventoryApi";
import ItemList from "../../components/ItemList";

type Item = {
  _id: string;
  name: string;
  sku?: string;
  unit: string;
  currentQuantity: number;
  averageCost: number;
};

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems({ page: 1, limit: 50 });
      setItems(data.items);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Items</h1>
      <ItemList items={items} loading={loading} onRefresh={fetchItems} />
    </div>
  );
};

export default ItemsPage;
