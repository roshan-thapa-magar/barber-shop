import mongoose, { Schema, models } from "mongoose";

// Regex for 12-hour time format: "09:00 AM", "12:30 PM"
const time12HourRegex = /^(0?[1-9]|1[0-2]):([0-5]\d) ?(AM|PM)$/i;

const shopSchema = new Schema(
  {
    shopStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "closed",
      required: true,
    },
    openingTime: {
      type: String,
      validate: {
        validator: (v: string) => !v || time12HourRegex.test(v),
        message: "Opening time must be in hh:mm AM/PM format",
      },
    },
    closingTime: {
      type: String,
      validate: {
        validator: (v: string) => !v || time12HourRegex.test(v),
        message: "Closing time must be in hh:mm AM/PM format",
      },
    },
  },
  { timestamps: true }
);

// Pre-save: ensure times exist if shop is open & closing > opening
shopSchema.pre("save", function (next) {
  const shop = this as any;

  if (shop.shopStatus === "open") {
    if (!shop.openingTime || !shop.closingTime) {
      return next(
        new Error("Opening and closing times are required when shop is open")
      );
    }

    // Convert time to minutes for comparison
    const parseTime = (t: string) => {
      const [time, modifier] = t.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    if (parseTime(shop.closingTime) <= parseTime(shop.openingTime)) {
      return next(new Error("Closing time must be later than opening time"));
    }
  }

  next();
});

const ShopModel = models.Shop || mongoose.model("Shop", shopSchema);

export default ShopModel;
