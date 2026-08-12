import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Coupon } from "../models/Coupon.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `A1-${year}-${randomDigits}`;
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, customerDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: "Valid shipping address is required" });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let product;
      if (!isDbConnected()) {
        product = mockStore.products.find((p) => String(p._id) === String(item.product) || p.slug === item.product);
      } else {
        product = await Product.findById(item.product);
      }

      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.name || "item"} is unavailable` });
      }

      const variant = product.variants?.find((v) => v.weight === item.weight) || product.variants?.[0];
      const unitPrice = variant ? variant.price : product.price;

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        weight: item.weight || "200g",
        quantity: item.quantity,
        price: unitPrice,
        image: product.thumbnail || product.images?.[0] || "",
        sku: variant ? variant.sku : product.sku,
      });
    }

    let discount = 0;
    if (couponCode) {
      const codeClean = couponCode.toUpperCase().trim();
      let coupon;
      if (!isDbConnected()) {
        coupon = mockStore.coupons.find((c) => c.code === codeClean && c.isActive);
      } else {
        coupon = await Coupon.findOne({ code: codeClean, isActive: true });
      }

      if (coupon) {
        if (coupon.type === "percentage") {
          discount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maximumDiscount && discount > coupon.maximumDiscount) discount = coupon.maximumDiscount;
        } else if (coupon.type === "fixed") {
          discount = Math.min(coupon.value, subtotal);
        }
      }
    }

    const freeShippingThreshold = 499;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : 50;
    const codFee = paymentMethod === "COD" ? 30 : 0;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = Math.max(0, subtotal - discount + shippingFee + codFee + tax);

    const orderNumber = generateOrderNumber();

    const orderObj = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      user: req.user?._id || req.user?.id || null,
      customerName: customerDetails?.name || shippingAddress.fullName,
      customerEmail: customerDetails?.email || req.user?.email || "customer@a1chips.com",
      customerPhone: customerDetails?.phone || shippingAddress.phone,
      items: validatedItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee: shippingFee + codFee,
      tax,
      total,
      couponCode: couponCode || "",
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "confirmed",
      shipmentStatus: "Order Placed & Confirmed",
      carrier: "A1 Express Logistics",
      estimatedDelivery: "3-5 Business Days",
      timeline: [
        { status: "Order Received", note: "Your order has been placed successfully.", timestamp: new Date() },
        { status: "Order Confirmed", note: "Order registered with warehouse.", timestamp: new Date() },
      ],
      createdAt: new Date(),
    };

    if (!isDbConnected()) {
      mockStore.orders.unshift(orderObj);
      return res.status(201).json({ success: true, message: "Order placed successfully", data: { order: orderObj } });
    }

    const order = await Order.create(orderObj);
    return res.status(201).json({ success: true, message: "Order placed successfully", data: { order } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!isDbConnected()) {
      const userOrders = mockStore.orders.filter((o) => String(o.user) === String(userId));
      return res.status(200).json({ success: true, data: { orders: userOrders } });
    }
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { orders } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    if (!isDbConnected()) {
      const order = mockStore.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      return res.status(200).json({ success: true, data: { order } });
    }
    const order = await Order.findOne({ orderNumber });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderNumber, phoneOrEmail } = req.query;
    if (!orderNumber) {
      return res.status(400).json({ success: false, message: "Order number is required" });
    }

    let order;
    if (!isDbConnected()) {
      order = mockStore.orders.find((o) => o.orderNumber === orderNumber.trim());
    } else {
      order = await Order.findOne({ orderNumber: orderNumber.trim() });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "No order found matching this Order Number" });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        shipmentStatus: order.shipmentStatus,
        trackingNumber: order.trackingNumber || "A1-EXP-TRK-983421",
        carrier: order.carrier || "A1 Express Logistics",
        estimatedDelivery: order.estimatedDelivery || "3-5 Business Days",
        timeline: order.timeline,
        items: order.items,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = mockStore.orders.findIndex((o) => o._id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Order not found" });
      mockStore.orders[idx].orderStatus = "cancelled";
      return res.status(200).json({ success: true, message: "Order cancelled", data: { order: mockStore.orders[idx] } });
    }
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    order.orderStatus = "cancelled";
    await order.save();
    return res.status(200).json({ success: true, message: "Order cancelled", data: { order } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: { orders: mockStore.orders, pagination: { total: mockStore.orders.length, page: 1, limit: 20 } },
      });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { orders, pagination: { total: orders.length, page: 1, limit: 20 } } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, shipmentStatus, trackingNumber, carrier, note } = req.body;

    if (!isDbConnected()) {
      const idx = mockStore.orders.findIndex((o) => o._id === id || o.orderNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Order not found" });

      if (orderStatus) mockStore.orders[idx].orderStatus = orderStatus;
      if (shipmentStatus) mockStore.orders[idx].shipmentStatus = shipmentStatus;
      if (trackingNumber) mockStore.orders[idx].trackingNumber = trackingNumber;
      if (carrier) mockStore.orders[idx].carrier = carrier;

      mockStore.orders[idx].timeline.push({
        status: shipmentStatus || orderStatus,
        note: note || `Status updated to ${orderStatus}`,
        timestamp: new Date(),
      });

      return res.status(200).json({ success: true, message: "Order status updated", data: { order: mockStore.orders[idx] } });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (shipmentStatus) order.shipmentStatus = shipmentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (carrier !== undefined) order.carrier = carrier;

    order.timeline.push({ status: shipmentStatus || orderStatus, note: note || `Status updated to ${orderStatus}` });
    await order.save();

    return res.status(200).json({ success: true, message: "Order status updated", data: { order } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
