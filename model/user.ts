import mongoose, { Schema, models } from "mongoose";

// Define the User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  name: {
    type: String,
    required: false, // Name might not be required during initial signup
  },
  role: {
    type: String,
    enum: ["admin", "barber", "user"], // Possible roles
    default: "user", // Default role for new users
  },
  image: {
    type: String, // URL to user's profile image
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Mongoose model. If the model already exists, use it; otherwise, create a new one.
const UserModel = models.User || mongoose.model("User", userSchema);

export default UserModel;
