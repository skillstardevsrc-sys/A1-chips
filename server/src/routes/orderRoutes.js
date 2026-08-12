import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderByNumber,
  trackOrder,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/orderController.js";
import { optionalAuth, protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuth, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/track", trackOrder);
router.get("/detail/:orderNumber", optionalAuth, getOrderByNumber);
router.post("/cancel/:id", protect, cancelOrder);

// Admin Order Management
router.get("/admin/all", protect, restrictTo("admin", "manager", "order_manager"), getAllOrdersAdmin);
router.put("/admin/status/:id", protect, restrictTo("admin", "manager", "order_manager"), updateOrderStatusAdmin);

export default router;
