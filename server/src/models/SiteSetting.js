import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    announcementBar: { type: String, default: "🔥 FREE Shipping on all orders above ₹499! Code: CRUNCH10 for 10% OFF" },
    announcementActive: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 499 },
    baseShippingFee: { type: Number, default: 50 },
    codFee: { type: Number, default: 30 },
    codEnabled: { type: Boolean, default: true },
    contactEmail: { type: String, default: "care@a1chips.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    storeAddress: { type: String, default: "Coimbatore, Tamil Nadu, India" },
  },
  { timestamps: true }
);

export const SiteSetting = mongoose.model("SiteSetting", siteSettingSchema);
