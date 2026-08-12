import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin", "manager", "inventory_manager", "order_manager", "content_manager"],
      default: "customer",
    },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
