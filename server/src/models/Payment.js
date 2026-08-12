import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber: { type: String, required: true },
    paymentMethod: { type: String, enum: ["ONLINE", "COD"], required: true },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["CREATED", "CAPTURED", "FAILED", "REFUNDED"], default: "CREATED" },
    failureReason: { type: String, default: "" },
    webhookEvents: [{ type: Object }],
  },
  { timestamps: true }
);

paymentSchema.index({ orderNumber: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
