import mongoose from "mongoose";
import { Coupon } from "../models/Coupon.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });

    const codeClean = code.toUpperCase().trim();
    let coupon;

    if (!isDbConnected()) {
      coupon = mockStore.coupons.find((c) => c.code === codeClean && c.isActive);
    } else {
      coupon = await Coupon.findOne({ code: codeClean, isActive: true });
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });
    }

    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrder} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else if (coupon.type === "fixed") {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully`,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: { coupons: mockStore.coupons } });
    }
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { coupons } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const newC = { _id: `c_${Date.now()}`, ...req.body, usedCount: 0, isActive: true };
      mockStore.coupons.push(newC);
      return res.status(201).json({ success: true, message: "Coupon created", data: { coupon: newC } });
    }
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, message: "Coupon created", data: { coupon } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = mockStore.coupons.findIndex((c) => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Coupon not found" });
      mockStore.coupons[idx] = { ...mockStore.coupons[idx], ...req.body };
      return res.status(200).json({ success: true, message: "Coupon updated", data: { coupon: mockStore.coupons[idx] } });
    }
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.status(200).json({ success: true, message: "Coupon updated", data: { coupon } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    if (!isDbConnected()) {
      mockStore.coupons = mockStore.coupons.filter((c) => c._id !== req.params.id);
      return res.status(200).json({ success: true, message: "Coupon deleted" });
    }
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    return res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
