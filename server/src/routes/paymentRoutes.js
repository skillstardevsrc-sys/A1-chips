import express from "express";
import { createPaymentOrder, verifyPaymentSignature, handlePaymentWebhook } from "../controllers/paymentController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", optionalAuth, createPaymentOrder);
router.post("/verify-signature", optionalAuth, verifyPaymentSignature);
router.post("/webhook", handlePaymentWebhook);

export default router;
