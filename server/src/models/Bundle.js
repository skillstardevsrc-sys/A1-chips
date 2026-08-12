import mongoose from "mongoose";

const bundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    boxSize: { type: Number, enum: [4, 6, 8], required: true }, // 4 items, 6 items, 8 items
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 15 },
    isActive: { type: Boolean, default: true },
    allowedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Bundle = mongoose.model("Bundle", bundleSchema);
