import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, minlength: 10 },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["admin", "barber", "user"], default: "user" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  ageGroup: {
    type: String,
    enum: ["adult", "student", "old", "child"],
    default: "adult",
  },
  customerType: {
    type: String,
    enum: ["regular", "VIP", "new"],
    default: "new",
  },

  // Password reset fields
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const UserModel = models.User || mongoose.model("User", userSchema);
export default UserModel;
