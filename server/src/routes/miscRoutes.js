import express from "express";
import { getSiteSettings, updateSiteSettings, subscribeNewsletter, submitContactForm } from "../controllers/miscController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/settings", getSiteSettings);
router.put("/settings", protect, restrictTo("admin", "manager", "content_manager"), updateSiteSettings);
router.post("/newsletter", subscribeNewsletter);
router.post("/contact", submitContactForm);

export default router;
