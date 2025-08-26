"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { toast } from "sonner";

interface Appointment {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  location: string;
  barberName: string;
  date: string;
  time: string;
  title: "student" | "adult" | "child" | "young" | "other";
  paymentMethod: "cash" | "online";
  paymentStatus: "pending" | "paid" | "cancelled";
  userType: "customer" | "admin" | "barber";
  status: "scheduled" | "completed" | "cancelled";
}

// Sample data
const initialAppointments: Appointment[] = [
  {
    id: "1",
    userName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 234-567-8901",
    location: "Downtown Branch",
    barberName: "Mike Johnson",
    date: "2024-01-15",
    time: "10:00",
    title: "adult",
    paymentMethod: "online",
    paymentStatus: "paid",
    userType: "customer",
    status: "scheduled",
  },
  {
    id: "2",
    userName: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "+1 234-567-8902",
    location: "Mall Branch",
    barberName: "Sarah Wilson",
    date: "2024-01-16",
    time: "14:30",
    title: "young",
    paymentMethod: "cash",
    paymentStatus: "pending",
    userType: "customer",
    status: "completed",
  },
  {
    id: "3",
    userName: "Bob Wilson",
    email: "bob@example.com",
    phoneNumber: "+1 234-567-8903",
    location: "City Center",
    barberName: "Alex Brown",
    date: "2024-01-17",
    time: "09:15",
    title: "student",
    paymentMethod: "online",
    paymentStatus: "cancelled",
    userType: "customer",
    status: "cancelled",
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<
    Appointment | undefined
  >();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.barberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
    toast.success("Appointment deleted successfully");
  };

  const handleFormSubmit = (appointmentData: Appointment) => {
    if (selectedAppointment) {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? appointmentData
            : appointment
        )
      );
    } else {
      setAppointments([...appointments, appointmentData]);
    }
    setSelectedAppointment(undefined);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAppointment(undefined);
  };

  const getTitleBadge = (title: string) => {
    const variants = {
      student: "secondary",
      adult: "default",
      child: "outline",
      young: "secondary",
      other: "outline",
    } as const;

    return (
      <Badge variant={variants[title as keyof typeof variants] || "default"}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: "outline",
      online: "secondary",
    } as const;

    return (
      <Badge variant={variants[method as keyof typeof variants] || "default"}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default",
      completed: "secondary",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      paid: "secondary",
      pending: "default",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none p-6 border-b bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage and track all appointments
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-none p-6 border-b bg-muted/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="min-w-[150px]">User Name</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[150px]">Phone</TableHead>
                <TableHead className="min-w-[150px]">Location</TableHead>
                <TableHead className="min-w-[150px]">Barber</TableHead>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[100px]">Time</TableHead>
                <TableHead className="min-w-[100px]">Title</TableHead>
                <TableHead className="min-w-[120px]">Payment Method</TableHead>
                <TableHead className="min-w-[120px]">Payment Status</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.userName}
                  </TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>{appointment.phoneNumber}</TableCell>
                  <TableCell>{appointment.location}</TableCell>
                  <TableCell>{appointment.barberName}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{getTitleBadge(appointment.title)}</TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(appointment.paymentMethod)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(appointment.paymentStatus)}
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          className="text-destructive"
                        >
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
      </div>

      <AppointmentForm
        appointment={selectedAppointment}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
