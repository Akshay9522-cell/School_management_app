import { api  } from "./api";

export const getCategories = () => api.get("/inventory/cat/all");
export const getCategory = (id: any) => api.get(`/inventory/cat/${id}`);
export const createCategory = (data: any) => api.post("/inventory/cat/add", data);
export const updateCategory = (id: any, data: any) => api.put(`/inventory/cat/${id}`, data);
export const deleteCategory = (id: any) => api.delete(`/inventory/cat/${id}`);

export const getItems = () => api.get("/inventory/item/all");
export const getItem = (id: any) => api.get(`/inventory/item/${id}`);
export const createItem = (data: any) =>api.post("/inventory/item/add", data);
export const updateItem = (id: any, data: any) =>api.put(`/inventory/item/${id}`, data);
export const deleteItem = (id: any) =>api.delete(`/inventory/item/${id}`);

export const getVendors = () => api.get("/inventory/vendors/all");
export const getVendor = (id: any) => api.get(`/inventory/vendors/${id}`);
export const createVendor = (data: any) =>api.post("/inventory/vendors/add", data);
export const updateVendor = (id: any, data: any) =>api.put(`/inventory/vendors/${id}`, data);
export const deleteVendor = (id: any) =>api.delete(`/inventory/vendors/${id}`);

export const getPOs = () => api.get("/inventory/PO/all");
export const getPO = (id: any) => api.get(`/inventory/PO/${id}`);
export const receivePO = (id: any) => api.post(`/inventory/PO/${id}/recieve`);

export const createPO = (data:any) => api.post('/inventory/PO/add',data) 
export const updatePO = (id: any, data: any) =>api.put(`/inventory/PO/${id}`, data);
export const deletePO = (id: any) =>api.delete(`/inventory/PO/${id}`);

// ISSUE
export const issueItem = (data: any) => api.post("/inventory/issue/add", data);
export const getIssues = () => api.get("/inventory/issue/all");
export const deleteIssue = (id: string) => api.delete(`/inventory/issue/${id}`);
export const getIssue = (id: string) => api.get(`/inventory/issue/${id}`);


export const createReturn = (data: any) => api.post("/inventory/return/add", data);
export const getReturns = () => api.get("/inventory/return/all");
export const getReturn = (id: any) => api.get(`/inventory/return/${id}`);
export const deleteReturn = (id: any) => api.delete(`/inventory/return/${id}`);

export const getLowStockReport = () => api.get("/inventory/reports/low-stock");
export const getStockReport = () => api.get("/inventory/reports/stock");
export const getUsageReport = () => api.get("/inventory/reports/usage");
export const getReturnReport = () => api.get("/inventory/reports/returns");
export const getPOStatusReport = () => api.get("/inventory/reports/po-status");
