import express from "express";
import { getDashboardMetrics, getCustomersAdmin, getAuditLogsAdmin } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/metrics", protect, restrictTo("admin", "manager"), getDashboardMetrics);
router.get("/customers", protect, restrictTo("admin", "manager"), getCustomersAdmin);
router.get("/audit-logs", protect, restrictTo("admin"), getAuditLogsAdmin);

export default router;
