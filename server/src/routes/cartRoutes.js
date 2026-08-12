import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";
import { optionalAuth, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", optionalAuth, getCart);
router.post("/add", optionalAuth, addToCart);
router.put("/update", optionalAuth, updateCartItem);
router.post("/remove", optionalAuth, removeCartItem);
router.post("/clear", optionalAuth, clearCart);

export default router;
