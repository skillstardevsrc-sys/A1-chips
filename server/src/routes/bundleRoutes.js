import express from "express";
import { getBundles, calculateBundlePrice } from "../controllers/bundleController.js";

const router = express.Router();

router.get("/", getBundles);
router.post("/calculate", calculateBundlePrice);

export default router;
