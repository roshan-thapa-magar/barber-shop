import mongoose, { Schema, models } from "mongoose";

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["in-stock", "out-of-stock", "low-stock"],
      default: "in-stock",
    },
  },
  { timestamps: true }
);

const InventoryModel =
  models.Inventory || mongoose.model("Inventory", inventorySchema);

export default InventoryModel;
