"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, "id"> | InventoryItem) => void;
  initialData?: InventoryItem;
  mode: "add" | "edit";
}

export function InventoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    qty: initialData?.qty || 0,
    price: initialData?.price || 0,
    status: initialData?.status || ("In Stock" as const),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (formData.qty < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    const itemData = {
      ...formData,
      ...(mode === "edit" && initialData ? { id: initialData.id } : {}),
    };

    onSubmit(itemData);
    onClose();

    // Reset form
    setFormData({
      name: "",
      qty: 0,
      price: 0,
      status: "In Stock",
    });

    toast.success(
      `Inventory item ${mode === "add" ? "added" : "updated"} successfully`
    );
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      name: initialData?.name || "",
      qty: initialData?.qty || 0,
      price: initialData?.price || 0,
      status: initialData?.status || "In Stock",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Item" : "Edit Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              type="number"
              min="0"
              value={formData.qty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  qty: Number.parseInt(e.target.value) || 0,
                })
              }
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Enter price"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(
                value: "In Stock" | "Low Stock" | "Out of Stock"
              ) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Item" : "Update Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
