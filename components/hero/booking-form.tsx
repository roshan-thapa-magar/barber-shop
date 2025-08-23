"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number too short"),
  time: z.string().min(1, "Please enter a time"),
  service: z.string().min(1, "Please select a service"),
  barber: z.string().min(1, "Please choose a barber"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
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
      time: "",
      service: "",
      barber: "",
    },
  });

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking submitted:", data);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <section className="min-h-full flex flex-col lg:flex-row">
      {/* Left side - Barber image */}
      <div className="lg:w-1/2 relative">
        <img
          src="/image/book-bg.jpg"
          alt="Professional barber at work"
          className="w-full h-64 lg:h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right side - Booking form */}
      <motion.div
        className="lg:w-1/2 relative bg-gray-900 text-white flex items-center justify-center p-8"
        style={{
          backgroundImage: `url('/image/satellite-map.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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
              Barber is a person whose occupation is mainly to cut, dress,
              groom, style, and shave men's and boys' hair.
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

            {/* Phone & Time */}
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
                  type="text"
                  placeholder="Your Free Time"
                  {...register("time")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.time.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Service & Barber */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Select
                  value={watch("service")}
                  onValueChange={(value) => setValue("service", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hair-styling">Hair Styling</SelectItem>
                    <SelectItem value="shaving">Shaving</SelectItem>
                    <SelectItem value="face-mask">Face Mask</SelectItem>
                    <SelectItem value="hair-wash">Hair Wash</SelectItem>
                    <SelectItem value="beard-trimming">
                      Beard Trimming
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.service.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Select
                  value={watch("barber")}
                  onValueChange={(value) => setValue("barber", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                    <SelectValue placeholder="Choose Barbers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michel-brown">Michel Brown</SelectItem>
                    <SelectItem value="jonathan-smith">
                      Jonathan Smith
                    </SelectItem>
                    <SelectItem value="jack-tosan">Jack Tosan</SelectItem>
                    <SelectItem value="martin-lane">Martin Lane</SelectItem>
                  </SelectContent>
                </Select>
                {errors.barber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.barber.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div className="text-center" variants={itemVariants}>
              <Button
                type="submit"
                className="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold px-8 py-3 uppercase tracking-wide"
              >
                Make Appointment
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
}
