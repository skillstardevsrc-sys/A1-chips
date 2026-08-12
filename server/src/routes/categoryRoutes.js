import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, restrictTo("admin", "manager"), createCategory);
router.put("/:id", protect, restrictTo("admin", "manager"), updateCategory);
router.delete("/:id", protect, restrictTo("admin"), deleteCategory);

export default router;
