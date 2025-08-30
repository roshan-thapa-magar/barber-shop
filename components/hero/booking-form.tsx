"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, Variants } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

// Types
interface Barber {
  _id: string;
  name: string;
}

interface Service {
  _id: string;
  type: string;
  price: number;
}

// Form validation schema
const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number too short"),
  schedule: z.string().min(1, "Please enter a schedule"),
  service: z.string().min(1, "Please select a service"),
  barber: z.string().min(1, "Please choose a barber"),
  customerType: z.string(),
  ageGroup: z.enum(["student", "adult", "child", "young", "other"]),
  paymentMethod: z.enum(["cash", "online"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const { user, reloadUser } = useUserContext();
  const { status } = useSession();
  const router = useRouter();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      schedule: "",
      service: "",
      barber: "",
      customerType: "regular",
      ageGroup: "other",
      paymentMethod: "cash",
    },
  });

  // Update form values when user is loaded
  useEffect(() => {
    if (!user) return;
    setValue("name", user.name || "");
    setValue("email", user.email || "");
    setValue("phone", user.phone || "");
    setValue("customerType", user.customerType || "regular");
    setValue(
      "ageGroup",
      user.ageGroup as "student" | "adult" | "child" | "young" | "other"
    );
  }, [user, setValue]);

  // Fetch barbers and services
  useEffect(() => {
    async function fetchData() {
      try {
        const barberRes = await fetch("/api/users?role=barber&status=active");
        if (!barberRes.ok) throw new Error("Failed to fetch barbers");
        const barberData: Barber[] = await barberRes.json();
        setBarbers(barberData);

        const serviceRes = await fetch("/api/services?status=active");
        if (!serviceRes.ok) throw new Error("Failed to fetch services");
        const serviceData: Service[] = await serviceRes.json();
        setServices(serviceData);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load barbers or services";
        console.error(message);
        toast.error(message);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/appointment");
      return;
    }

    setLoading(true);
    try {
      const selectedService = services.find((s) => s._id === data.service);
      if (!selectedService) throw new Error("Selected service not found");

      const selectedBarber = barbers.find((b) => b._id === data.barber);
      if (!selectedBarber) throw new Error("Selected barber not found");

      const payload = {
        myId: user?._id,
        ...data,
        service: { type: selectedService.type, price: selectedService.price },
        barber: selectedBarber.name,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Appointment booked successfully!");
      reloadUser();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Booking failed";
      console.error(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="h-screen flex flex-col lg:flex-row">
      {/* Left image */}
      <div className="lg:w-1/2 relative h-64 lg:h-auto">
        <Image
          src="/image/book-bg.jpg"
          alt="Professional barber at work"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right form */}
      <motion.div
        className="lg:w-1/2 relative bg-gray-900 text-white flex items-center justify-center p-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute inset-0 bg-[#222227]/90"></div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-4">Make an appointment</h2>
            <p className="text-gray-300">
              Choose your preferred service, barber, and schedule.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            variants={containerVariants}
          >
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  placeholder="Your Email"
                  {...register("email")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Phone & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  type="tel"
                  placeholder="Your Phone No"
                  {...register("phone")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  type="datetime-local"
                  {...register("schedule")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                />
                {errors.schedule && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.schedule.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Service & Barber */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Select
                  value={watch("service")}
                  onValueChange={(val) => setValue("service", val)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.type} - {service.price}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-service" disabled>
                        No active services
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Select
                  value={watch("barber")}
                  onValueChange={(val) => setValue("barber", val)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Choose Barber" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.length > 0 ? (
                      barbers.map((barber) => (
                        <SelectItem key={barber._id} value={barber._id}>
                          {barber.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-barber" disabled>
                        No active barbers
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Age Group & Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Select
                  value={watch("ageGroup")}
                  onValueChange={(val) =>
                    setValue("ageGroup", val as BookingFormData["ageGroup"])
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="young">Young</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Select
                  value={watch("paymentMethod")}
                  onValueChange={(val) =>
                    setValue(
                      "paymentMethod",
                      val as BookingFormData["paymentMethod"]
                    )
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Customer Type (read-only) */}
            <motion.div variants={itemVariants}>
              <Input
                type="text"
                value={user?.customerType || "regular"}
                disabled
                className="bg-white/10 border-white/20 text-gray-300"
              />
            </motion.div>

            <motion.div className="text-center" variants={itemVariants}>
              <Button
                type="submit"
                disabled={status === "unauthenticated" || loading}
                className="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold px-8 py-3 uppercase tracking-wide"
              >
                {loading
                  ? "Booking..."
                  : status === "unauthenticated"
                  ? "Login to Book"
                  : "Make Appointment"}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
}
