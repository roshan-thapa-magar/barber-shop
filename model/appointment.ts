import mongoose, { Schema, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: false, // optional
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: false, // optional
    },
    barber: {
      type: String, // just a string
      required: [true, "Barber name is required"],
    },
    service: {
      type: {
        type: String,
        required: [true, "Service type is required"],
      },
      price: { type: Number, required: [true, "Service price is required"] },
    },
    schedule: {
      type: Date,
      required: true,
    },
    customerType: {
      type: String,
      enum: ["regular", "VIP", "new"],
      required: [true, "Customer type is required"],
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
