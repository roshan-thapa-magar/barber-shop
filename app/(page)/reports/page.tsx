"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
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
import { MoreHorizontal, Search, Filter, Printer } from "lucide-react";

interface ServiceDetails {
  type: string;
  price: number;
}

interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  barber: string;
  service: ServiceDetails;
  schedule: string;
  customerType: "regular" | "VIP" | "new";
  ageGroup: "student" | "adult" | "child" | "young" | "other";
  paymentMethod: "cash" | "online";
  paymentStatus: "pending" | "paid" | "cancelled";
  status: "scheduled" | "pending" | "completed" | "cancelled";
}

interface AppointmentFormData extends Omit<Appointment, "_id"> {}

type DateFilterType = "all" | "daily" | "weekly" | "monthly" | "custom";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<
    Appointment | undefined
  >(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch only completed and cancelled appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          "/api/appointments?status=completed,cancelled"
        );
        if (!Array.isArray(data)) {
          toast.error("Invalid data received from server");
          setAppointments([]);
          return;
        }
        setAppointments(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch appointments");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments by search, status, and date
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.barber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const schedule = moment(appointment.schedule);
    let matchesDate = true;

    if (dateFilter === "daily") {
      matchesDate = schedule.isSame(moment(), "day");
    } else if (dateFilter === "weekly") {
      matchesDate = schedule.isSame(moment(), "week");
    } else if (dateFilter === "monthly") {
      matchesDate = schedule.isSame(moment(), "month");
    } else if (dateFilter === "custom" && customStartDate && customEndDate) {
      matchesDate =
        schedule.isSameOrAfter(moment(customStartDate)) &&
        schedule.isSameOrBefore(moment(customEndDate));
    } else if (dateFilter === "all") {
      matchesDate = true;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Total amounts
  const totalCompletedAmount = filteredAppointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.service.price, 0);

  const totalCancelledAmount = filteredAppointments
    .filter((a) => a.status === "cancelled")
    .reduce((sum, a) => sum + a.service.price, 0);

  // Form handlers
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: AppointmentFormData) => {
    try {
      if (selectedAppointment) {
        await axios.put(
          `/api/appointments/${selectedAppointment._id}`,
          formData
        );
      } else {
        const response = await axios.post("/api/appointments", formData);
        setAppointments((prev) => [...prev, response.data]);
      }
      const { data } = await axios.get(
        "/api/appointments?status=completed,cancelled"
      );
      setAppointments(data);
      toast.success("Appointment saved successfully");
      setSelectedAppointment(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save appointment");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAppointment(undefined);
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete appointment");
    }
  };

  const handlePrintAppointment = (appointment: Appointment) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const currentDate = moment().format("MMMM Do, YYYY");
    const appointmentDate = moment(appointment.schedule).format(
      "MMMM Do, YYYY"
    );
    const appointmentTime = moment(appointment.schedule).format("h:mm A");

    printWindow.document.write(`
      <html>
        <head><title>Service Bill</title></head>
        <body>
          <h2>Barber Shop - Service Bill</h2>
          <p>Bill Date: ${currentDate}</p>
          <p>Bill ID: #${appointment._id.slice(-8).toUpperCase()}</p>
          <p>Appointment Date: ${appointmentDate}</p>
          <p>Appointment Time: ${appointmentTime}</p>
          <p>Customer: ${appointment.name}</p>
          <p>Service: ${appointment.service.type}</p>
          <p>Barber: ${appointment.barber}</p>
          <p>Price: रु ${appointment.service.price}</p>
          <p>Status: ${appointment.status}</p>
          <p>Payment Method: ${appointment.paymentMethod}</p>
          <p>Payment Status: ${appointment.paymentStatus}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getBadge = (
    value: string,
    type: "status" | "paymentMethod" | "paymentStatus" | "ageGroup"
  ) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > =
      type === "status"
        ? { completed: "secondary", cancelled: "destructive" }
        : type === "paymentMethod"
        ? { cash: "outline", online: "secondary" }
        : type === "paymentStatus"
        ? { paid: "secondary", pending: "default", cancelled: "destructive" }
        : type === "ageGroup"
        ? {
            student: "secondary",
            adult: "default",
            child: "outline",
            young: "secondary",
            other: "outline",
          }
        : {};

    return (
      <Badge variant={variants[value] || "default"}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none p-6 border-b bg-background">
        <h1 className="text-2xl font-bold">Appointments Report</h1>
      </div>

      {/* Filters */}
      <div className="flex-none p-6 border-b bg-muted/50 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={dateFilter}
            onValueChange={(value) => setDateFilter(value as DateFilterType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {dateFilter === "custom" && (
            <div className="flex gap-2 flex-wrap">
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <p className="p-6 text-center text-muted-foreground">Loading...</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">No data found</p>
        ) : (
          <>
            {/* Table for medium+ screens */}
            <div className="hidden md:block">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Barber</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Customer Type</TableHead>
                    <TableHead>Age Group</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.name}</TableCell>
                      <TableCell>{appointment.email}</TableCell>
                      <TableCell>{appointment.phone}</TableCell>
                      <TableCell>{appointment.barber}</TableCell>
                      <TableCell>
                        {appointment.service.type} (रु{" "}
                        {appointment.service.price})
                      </TableCell>
                      <TableCell>
                        {moment(appointment.schedule).format("MMMM Do, h:mm A")}
                      </TableCell>
                      <TableCell>{appointment.customerType}</TableCell>
                      <TableCell>
                        {getBadge(appointment.ageGroup, "ageGroup")}
                      </TableCell>
                      <TableCell>
                        {getBadge(appointment.paymentMethod, "paymentMethod")}
                      </TableCell>
                      <TableCell>
                        {getBadge(appointment.paymentStatus, "paymentStatus")}
                      </TableCell>
                      <TableCell>
                        {getBadge(appointment.status, "status")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintAppointment(appointment)
                              }
                            >
                              <Printer className="mr-2 h-4 w-4" /> Print Bill
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteAppointment(appointment._id)
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

                  {/* Totals Row */}
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-right py-4 font-bold"
                    >
                      Total Completed: रु {totalCompletedAmount} | Total
                      Cancelled: रु {totalCancelledAmount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Card view for small screens */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-4 bg-background border rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">{appointment.name}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handlePrintAppointment(appointment)}
                        >
                          <Printer className="mr-2 h-4 w-4" /> Print Bill
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p>Email: {appointment.email}</p>
                  <p>Phone: {appointment.phone}</p>
                  <p>Barber: {appointment.barber}</p>
                  <p>
                    Service: {appointment.service.type} (रु{" "}
                    {appointment.service.price})
                  </p>
                  <p>
                    Schedule:{" "}
                    {moment(appointment.schedule).format("MMMM Do, h:mm A")}
                  </p>
                  <p>Customer Type: {appointment.customerType}</p>
                  <p>Age Group: {getBadge(appointment.ageGroup, "ageGroup")}</p>
                  <p>
                    Payment Method:{" "}
                    {getBadge(appointment.paymentMethod, "paymentMethod")}
                  </p>
                  <p>
                    Payment Status:{" "}
                    {getBadge(appointment.paymentStatus, "paymentStatus")}
                  </p>
                  <p>Status: {getBadge(appointment.status, "status")}</p>
                </div>
              ))}

              {/* Totals Card */}
              <div className="p-4 bg-background border rounded-lg shadow-sm text-right font-bold">
                Total Completed: रु {totalCompletedAmount} | Total Cancelled: रु{" "}
                {totalCancelledAmount}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
