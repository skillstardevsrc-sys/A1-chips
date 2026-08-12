import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

export const Review = mongoose.model("Review", reviewSchema);
