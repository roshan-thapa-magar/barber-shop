import mongoose, { Schema, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    barber: {
      type: String,
      required: [true, "Barber name is required"],
    },
    service: {
      type: String,
      required: [true, "Services is required"],
    },
    schedule: {
      type: Date,
      required: true,
    },
    customerType: {
      type: String,
      enum: ["regular", "VIP", "new"],
      required: [true, "Age Group is required"],
    },
    ageGroup: {
      type: String,
      enum: ["student", "adult", "child", "young", "other"],
      default: "adult",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    myId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AppointmentModel =
  models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default AppointmentModel;
