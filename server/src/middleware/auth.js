import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    const secret = process.env.JWT_ACCESS_SECRET || "a1_chips_jwt_access_secret_2026_key_production_super_secret";
    const decoded = jwt.verify(token, secret);

    let user;
    if (!isDbConnected()) {
      user = mockStore.users.find((u) => u._id === decoded.id);
    } else {
      user = await User.findById(decoded.id).select("-passwordHash");
    }

    if (!user || user.isActive === false) {
      return res.status(401).json({ success: false, message: "User account inactive or non-existent" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired or invalid token" });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_ACCESS_SECRET || "a1_chips_jwt_access_secret_2026_key_production_super_secret";
      const decoded = jwt.verify(token, secret);
      if (!isDbConnected()) {
        req.user = mockStore.users.find((u) => u._id === decoded.id);
      } else {
        req.user = await User.findById(decoded.id).select("-passwordHash");
      }
    }
  } catch (e) {
    // Ignore error for optional auth
  }
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || "guest"}) is not authorized to access this resource`,
      });
    }
    next();
  };
};
