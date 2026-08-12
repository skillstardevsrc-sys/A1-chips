import express from "express";
import {
  getProducts,
  getProductBySlug,
  findYourCrunch,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/find-your-crunch", findYourCrunch);
router.get("/:slug", getProductBySlug);

router.post("/", protect, restrictTo("admin", "manager", "inventory_manager"), createProduct);
router.put("/:id", protect, restrictTo("admin", "manager", "inventory_manager"), updateProduct);
router.delete("/:id", protect, restrictTo("admin", "manager"), deleteProduct);

export default router;
