import express from "express";
import { getProductReviews, createReview, getReviewsAdmin, updateReviewStatusAdmin } from "../controllers/reviewController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/product", protect, createReview);
router.get("/admin", protect, restrictTo("admin", "manager", "content_manager"), getReviewsAdmin);
router.put("/admin/:id/status", protect, restrictTo("admin", "manager", "content_manager"), updateReviewStatusAdmin);

export default router;
