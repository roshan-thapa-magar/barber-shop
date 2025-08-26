import mongoose, { Schema, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    barberName: {
      type: String,
      required: [true, "Barber name is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    userType: {
      type: String,
      enum: ["customer", "admin", "barber"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const AppointmentModel =
  models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default AppointmentModel;
