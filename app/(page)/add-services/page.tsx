"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceForm, type Service } from "@/components/service-form";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      const mapped = data.map((s: any) => ({
        id: s._id,
        service: s.type,
        price: s.price,
        status: s.status || "available",
      }));
      setServices(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter safely
  const filteredServices = services.filter(
    (service) =>
      service.service &&
      service.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setEditingService(undefined);
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
      setServices(services.filter((s) => s.id !== serviceId));
      toast.success("Service deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  const handleFormSubmit = async (
    serviceData: Omit<Service, "id"> | Service
  ) => {
    try {
      if (formMode === "add") {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: (serviceData as Omit<Service, "id">).service,
            price: (serviceData as Omit<Service, "id">).price,
            status: (serviceData as Omit<Service, "id">).status,
          }),
        });
        const newServiceData = await res.json();
        const newService: Service = {
          id: newServiceData._id,
          service: newServiceData.type,
          price: newServiceData.price,
          status: newServiceData.status,
        };
        setServices([...services, newService]);
        toast.success("Service added successfully");
      } else if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: (serviceData as Service).service,
            price: (serviceData as Service).price,
            status: (serviceData as Service).status,
          }),
        });
        const updatedServiceData = await res.json();
        const updatedService: Service = {
          id: updatedServiceData._id,
          service: updatedServiceData.type,
          price: updatedServiceData.price,
          status: updatedServiceData.status,
        };
        setServices(
          services.map((s) => (s.id === updatedService.id ? updatedService : s))
        );
        toast.success("Service updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service");
    }
  };

  const getStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(services, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "services.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("JSON exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
          <Button variant="outline" onClick={handleExportJSON}>
            Export JSON
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.service}
                    </TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ServiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        service={editingService}
        mode={formMode}
      />
    </div>
  );
}
