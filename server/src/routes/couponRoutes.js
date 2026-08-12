import express from "express";
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/couponController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/validate", validateCoupon);
router.get("/admin", protect, restrictTo("admin", "manager"), getCoupons);
router.post("/admin", protect, restrictTo("admin", "manager"), createCoupon);
router.put("/admin/:id", protect, restrictTo("admin", "manager"), updateCoupon);
router.delete("/admin/:id", protect, restrictTo("admin"), deleteCoupon);

export default router;
