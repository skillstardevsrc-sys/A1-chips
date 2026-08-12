import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String, required: true },
  weight: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  priceSnapshot: { type: Number, required: true },
  nameSnapshot: { type: String },
  imageSnapshot: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

export const Cart = mongoose.model("Cart", cartSchema);
