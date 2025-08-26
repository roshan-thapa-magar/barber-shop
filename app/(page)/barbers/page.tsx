"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarberForm } from "@/components/barber-form";
import { toast } from "sonner";
import type { Barber } from "@/types/barber";
import { apiFetch } from "@/lib/fetcher";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  // Fetch barbers
  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Barber[]>("/api/users?role=barber");
      const normalized = data.map((d: any) => ({
        id: d.id || d._id || String(d._id),
        name: d.name,
        email: d.email,
        phone: d.phone,
        image: d.image || "",
        status: d.status || "active",
      }));
      setBarbers(normalized);
    } catch (err: any) {
      toast.error(`Failed to load barbers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const filteredBarbers = useMemo(
    () =>
      barbers.filter((b) =>
        [b.name, b.email, b.phone]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [barbers, searchTerm]
  );

  // Add barber
  const handleAddBarber = async (
    payload: Omit<Barber, "id"> & { id?: string; password?: string }
  ) => {
    try {
      await apiFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role: "barber" }),
      });
      toast.success("Barber added successfully");
      fetchBarbers();
    } catch (err: any) {
      toast.error(`Add failed: ${err.message}`);
    }
  };

  // Edit barber
  const handleEditBarber = async (
    payload: Omit<Barber, "id"> & { id?: string; password?: string }
  ) => {
    if (!payload.id) return toast.error("Barber ID missing");
    try {
      await apiFetch(`/api/users/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Barber updated successfully");
      setEditingBarber(undefined);
      fetchBarbers();
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  // Delete barber
  const handleDeleteBarber = async (id: string) => {
    if (!confirm("Delete this barber? This cannot be undone.")) return;
    try {
      await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      toast.success("Barber deleted successfully");
      setBarbers((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  const openAddForm = () => {
    setEditingBarber(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (b: Barber) => {
    setEditingBarber(b);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Barber Management</h1>
          <p className="text-muted-foreground">
            Manage your barber team efficiently
          </p>
        </div>
        <Button onClick={openAddForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Barber
        </Button>
      </div>

      {/* Card with Search + Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle>Barbers</CardTitle>
            <CardDescription>List of barbers</CardDescription>
          </div>

          {/* Search input */}
          <div className="relative max-w-sm w-full mt-2 md:mt-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search barbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto w-full rounded-md border">
            <Table className="min-w-[700px]">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[25%]">Email</TableHead>
                  <TableHead className="w-[20%]">Phone</TableHead>
                  <TableHead className="w-[10%]">Image</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {!loading && filteredBarbers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No barbers found
                    </TableCell>
                  </TableRow>
                )}

                {filteredBarbers.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.email}</TableCell>
                    <TableCell>{b.phone}</TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={b.image || "/placeholder.svg"}
                          alt={b.name}
                        />
                        <AvatarFallback>{b.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          b.status === "active" ? "default" : "secondary"
                        }
                      >
                        {b.status}
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
                          <DropdownMenuItem onClick={() => openEditForm(b)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteBarber(b.id)}
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
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-2">
            {loading && <p className="text-center py-4">Loading...</p>}
            {!loading && filteredBarbers.length === 0 && (
              <p className="text-center py-4">No barbers found</p>
            )}

            {filteredBarbers.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-md space-y-2 bg-background"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{b.name}</p>
                  <Badge
                    variant={b.status === "active" ? "default" : "secondary"}
                  >
                    {b.status}
                  </Badge>
                </div>
                <p>Email: {b.email}</p>
                <p>Phone: {b.phone}</p>
                <div className="flex items-center justify-between mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={b.image || "/placeholder.svg"}
                      alt={b.name}
                    />
                    <AvatarFallback>{b.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openEditForm(b)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBarber(b.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Barber Form Dialog */}
      <BarberForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        barber={editingBarber}
        onSubmit={editingBarber ? handleEditBarber : handleAddBarber}
      />
    </div>
  );
}
