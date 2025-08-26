"use client";

import React, { useEffect, useState } from "react";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import type { Barber } from "@/types/barber";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber | undefined;
  onSubmit: (
    payload: Omit<Barber, "id"> & { id?: string; password?: string }
  ) => void;
}

export function BarberForm({ open, onOpenChange, barber, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    image: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (barber) {
      setFormData({
        name: barber.name,
        email: barber.email,
        phone: barber.phone,
        password: "",
        image: barber.image || "",
        status: barber.status || "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        image: "",
        status: "active",
      });
    }
  }, [barber, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((s) => ({ ...s, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    )
      return;

    if (!barber && !formData.password.trim()) return;

    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      image: formData.image,
      status: formData.status,
      ...(formData.password && { password: formData.password }),
      ...(barber && { id: barber.id }),
    });

    onOpenChange(false);

    if (!barber) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        image: "",
        status: "active",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{barber ? "Edit Barber" : "Add New Barber"}</DialogTitle>
          <DialogDescription>
            {barber
              ? "Update barber information"
              : "Fill in the details to add a new barber"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={formData.image || "/placeholder.svg"}
                  alt="profile"
                />
                <AvatarFallback>
                  <Upload className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
            </div>
          </div>

          {/* Name, Email, Phone */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter barber name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                barber ? "Leave blank to keep current" : "Enter password"
              }
              required={!barber}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v: "active" | "inactive") =>
                setFormData({ ...formData, status: v })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{barber ? "Update" : "Add"} Barber</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
