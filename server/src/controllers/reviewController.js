import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, status: "approved" }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "5.0";

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          avgRating: Number(avgRating),
          ratingDistribution,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Check if user purchased the product
    const purchasedOrder = await Order.findOne({
      user: userId,
      "items.product": productId,
      orderStatus: "delivered",
    });

    const review = await Review.create({
      product: productId,
      user: userId,
      userName: req.user.name,
      userAvatar: req.user.avatar || "",
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: !!purchasedOrder,
      status: "approved",
    });

    // Recalculate product average rating
    const allReviews = await Review.find({ product: productId, status: "approved" });
    const avgRating = (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating),
      reviewCount: allReviews.length,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      data: { review },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().populate("product", "name slug").populate("user", "name email").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { reviews } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReviewStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    return res.status(200).json({ success: true, message: `Review ${status}`, data: { review } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
