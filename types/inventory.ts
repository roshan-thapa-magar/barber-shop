// types/inventory.ts
export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string; // always required
  name: string;
  quantity: number;
  price: number;
  status: InventoryStatus;
}

export interface SaleItem {
  id: string;
  inventoryId?: string;
  name: string;
  quantity: number;
  price: number;
  createdAt?: string;
}
