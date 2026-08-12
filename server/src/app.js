import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bundleRoutes from "./routes/bundleRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports and requests without origin (like mobile/curl)
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});
app.use("/api", limiter);

// Parsers & Sanitizer
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date(), app: "A1 Chips D2C API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[ServerError]", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
  });
});

export default app;
