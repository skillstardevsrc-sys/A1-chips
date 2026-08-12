import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  weight: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  sku: { type: String, default: "" },
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g. A1-2026-000001
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      landmark: String,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["ONLINE", "COD"], required: true },
    paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING" },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "return_requested",
        "returned",
        "refund_pending",
        "refunded",
      ],
      default: "confirmed",
    },
    shipmentStatus: { type: String, default: "Order Received" },
    trackingNumber: { type: String, default: "" },
    carrier: { type: String, default: "A1 Express Logistics" },
    estimatedDelivery: { type: String, default: "3-5 Business Days" },
    notes: { type: String, default: "" },
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
