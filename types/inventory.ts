// types/inventory.ts
export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";
interface InventoryApiResponse {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  status: InventoryStatus;
}

interface SaleApiResponse {
  _id: string;
  inventoryId?: string;
  name: string;
  quantity: number;
  price: number;
  createdAt?: string;
}
