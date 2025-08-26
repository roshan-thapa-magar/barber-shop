"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface AppointmentFormProps {
  appointment?: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: Appointment) => void;
}

export function AppointmentForm({
  appointment,
  isOpen,
  onClose,
  onSubmit,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    location: "",
    barberName: "",
    date: "",
    time: "",
    title: "adult" as const,
    paymentMethod: "cash" as const,
    paymentStatus: "pending" as const,
    userType: "customer" as const,
    status: "scheduled" as const,
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        userName: appointment.userName,
        email: appointment.email,
        phoneNumber: appointment.phoneNumber,
        location: appointment.location,
        barberName: appointment.barberName,
        date: appointment.date,
        time: appointment.time,
        title: appointment.title,
        paymentMethod: appointment.paymentMethod,
        paymentStatus: appointment.paymentStatus,
        userType: appointment.userType,
        status: appointment.status,
      });
    } else {
      setFormData({
        userName: "",
        email: "",
        phoneNumber: "",
        location: "",
        barberName: "",
        date: "",
        time: "",
        title: "adult",
        paymentMethod: "cash",
        paymentStatus: "pending",
        userType: "customer",
        status: "scheduled",
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName.trim()) {
      toast.error("User name is required");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    const appointmentData: Appointment = {
      id: appointment?.id || Date.now().toString(),
      ...formData,
    };

    onSubmit(appointmentData);
    toast.success(
      appointment
        ? "Appointment updated successfully"
        : "Appointment created successfully"
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Add New Appointment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name *</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Enter user name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barberName">Barber Name *</Label>
              <Input
                id="barberName"
                value={formData.barberName}
                onChange={(e) =>
                  setFormData({ ...formData, barberName: e.target.value })
                }
                placeholder="Enter barber name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                value={formData.title}
                onValueChange={(
                  value: "student" | "adult" | "child" | "young" | "other"
                ) => setFormData({ ...formData, title: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="young">Young</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: "cash" | "online") =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: "pending" | "paid" | "cancelled") =>
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select
                value={formData.userType}
                onValueChange={(value: "customer" | "admin" | "barber") =>
                  setFormData({ ...formData, userType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="barber">Barber</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "scheduled" | "completed" | "cancelled"
                ) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {appointment ? "Update Appointment" : "Create Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
