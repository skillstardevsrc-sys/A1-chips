import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed", "free_shipping"], required: true },
    value: { type: Number, required: true }, // e.g. 10 for 10% or 100 for ₹100 off
    minimumOrder: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 }, // max discount limit for percentage type
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
