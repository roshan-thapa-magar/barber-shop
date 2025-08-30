"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, MoreHorizontal, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { InventoryForm } from "@/components/inventory-form";
import { SellItemModal } from "@/components/sell-item-modal";

// -----------------------
// Types
// -----------------------
export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
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

// -----------------------
// Status display map
// -----------------------
const displayStatus: Record<InventoryStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

// -----------------------
// Page Component
// -----------------------
export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);

  // Sales filters
  const [salesFilter, setSalesFilter] = useState<
    "all" | "today" | "week" | "month" | "custom"
  >("all");
  const [customFilter, setCustomFilter] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  // -----------------------
  // Fetch Inventory
  // -----------------------
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setInventory(
        data.map((i: any) => ({
          id: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          status: i.status as InventoryStatus,
        }))
      );
    } catch {
      toast.error("Failed to fetch inventory");
    }
  };

  // -----------------------
  // Fetch Sales
  // -----------------------
  const fetchSales = async () => {
    try {
      let url = "/api/sales";
      if (salesFilter !== "all") {
        const params = new URLSearchParams();
        params.append("filter", salesFilter);
        if (salesFilter === "custom" && customFilter.from && customFilter.to) {
          params.append("from", customFilter.from);
          params.append("to", customFilter.to);
        }
        url += "?" + params.toString();
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setSales(
        data.map((s: any) => ({
          id: s._id,
          inventoryId: s.inventoryId,
          name: s.name,
          quantity: s.quantity,
          price: s.price,
          createdAt: s.createdAt,
        }))
      );
    } catch {
      toast.error("Failed to fetch sales");
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchSales();
  }, []);

  useEffect(() => {
    if (salesFilter !== "custom") fetchSales();
  }, [salesFilter]);

  // -----------------------
  // Inventory Form
  // -----------------------
  const openAddForm = () => {
    setFormMode("add");
    setEditingItem(undefined);
    setFormOpen(true);
  };

  const openEditForm = (item: InventoryItem) => {
    setFormMode("edit");
    setEditingItem(item);
    setFormOpen(true);
  };

  const submitForm = async (item: InventoryItem) => {
    try {
      const body = { ...item };
      let res;
      if (formMode === "add") {
        res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/inventory/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();

      const updatedItem: InventoryItem = {
        id: data._id,
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        status: data.status as InventoryStatus,
      };

      setInventory((prev) =>
        formMode === "add"
          ? [...prev, updatedItem]
          : prev.map((i) => (i.id === data._id ? updatedItem : i))
      );
      setFormOpen(false);
    } catch {
      toast.error("Failed to save item");
    }
  };

  // -----------------------
  // Delete Inventory
  // -----------------------
  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setInventory((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // -----------------------
  // Sell Item
  // -----------------------
  const confirmSale = async (quantity: number) => {
    if (!sellingItem) return;
    try {
      const res = await fetch(`/api/sales/${sellingItem.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();

      setInventory((prev) =>
        prev.map((i) =>
          i.id === sellingItem.id
            ? {
                ...i,
                quantity: data.item.quantity,
                status: data.item.status as InventoryStatus,
              }
            : i
        )
      );

      setSales((prev) => [
        ...prev,
        {
          id: data.sale._id,
          name: data.sale.name,
          quantity: data.sale.quantity,
          price: data.sale.price,
          createdAt: data.sale.createdAt,
        },
      ]);

      toast.success("Sold successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSellingItem(null);
    }
  };

  // -----------------------
  // Delete Sale
  // -----------------------
  const deleteSale = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setSales((prev) => prev.filter((s) => s.id !== id));
      toast.success("Sale deleted");
    } catch {
      toast.error("Failed to delete sale");
    }
  };

  // -----------------------
  // Filtered Inventory
  // -----------------------
  const filteredInventory = inventory.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: InventoryStatus) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage inventory and sales</p>
        </div>
        <Button onClick={openAddForm} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle>Inventory</CardTitle>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₨{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {displayStatus[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditForm(item)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSellingItem(item)}
                          className="text-blue-600"
                        >
                          <DollarSign className="mr-2 h-4 w-4" /> Sale
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle>Sales</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <span>Filter:</span>
            <select
              value={salesFilter}
              onChange={(e) => setSalesFilter(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
            {salesFilter === "custom" && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={customFilter.from}
                  onChange={(e) =>
                    setCustomFilter((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                />
                <input
                  type="date"
                  value={customFilter.to}
                  onChange={(e) =>
                    setCustomFilter((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="border rounded px-2 py-1"
                />
                <Button size="sm" onClick={fetchSales}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length ? (
                sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.quantity}</TableCell>
                    <TableCell>₨{s.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSale(s.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No sales found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <InventoryForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        initialData={editingItem}
        mode={formMode}
      />
      {sellingItem && (
        <SellItemModal
          isOpen={!!sellingItem}
          onClose={() => setSellingItem(null)}
          item={sellingItem}
          onSubmit={confirmSale}
        />
      )}
    </div>
  );
}
