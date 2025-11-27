import { api } from "./api";

// ---------------- TYPES ----------------
export interface ItemPayload {
  name: string;
  sku?: string;
  unit: string;
  reorderLevel: number;
  currentQuantity: number;
  averageCost: number;
}

export interface StockPayload {
  itemId: string;
  quantity: number;
  note?: string;
}

export interface PaymentPayload {
  amount: number;
  currency: string;
  paymentDate?: Date | string;
  reference?: string;
  itemId?: string;
}

// ---------------- ITEMS ----------------
export const getItems = async (params?: any) => {
  const res = await api.get("/inventory/items", { params });
  return res.data; // { items, page, total }
};

export const createItem = async (payload: ItemPayload) => {
  const res = await api.post("/inventory/items", payload);
  return res.data;
};

export const updateItem = async (id: string, payload: ItemPayload) => {
  const res = await api.put(`/inventory/items/${id}`, payload);
  return res.data;
};

// ---------------- STOCK ----------------
export const createStockIn = async (payload: StockPayload) => {
  const res = await api.post("/inventory/stock/in", payload);
  return res.data;
};

export const createStockOut = async (payload: StockPayload) => {
  const res = await api.post("/inventory/stock/out", payload);
  return res.data;
};

export const getStockTransactions = async (params?: any) => {
  const res = await api.get("/inventory/stock", { params });
  return res.data;
};

// ---------------- PAYMENTS ----------------
export const createPayment = async (payload: PaymentPayload) => {
  const res = await api.post("/inventory/payments", payload);
  return res.data;
};

export const getPayments = async (params?: any) => {
  const res = await api.get("/inventory/payments", { params });
  return res.data; // { payments, total }
};
// ---------- SUPPLIERS ----------
export const getSuppliers = async (params?: any) => {
  const res = await api.get("/inventory/suppliers", { params });
  return res.data;
};

export const createSupplier = async (payload: any) => {
  const res = await api.post("/inventory/suppliers", payload);
  return res.data;
};

export const updateSupplier = async (id: string, payload: any) => {
  const res = await api.put(`/inventory/suppliers/${id}`, payload);
  return res.data;
};

export const deleteSupplier = async (id: string) => {
  const res = await api.delete(`/inventory/suppliers/${id}`);
  return res.data;
};
