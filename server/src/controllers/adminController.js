import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { AuditLog } from "../models/MiscModels.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDashboardMetrics = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const totalOrders = mockStore.orders.length;
      const pendingOrders = mockStore.orders.filter((o) => o.orderStatus === "pending").length;
      const totalCustomers = mockStore.users.filter((u) => u.role === "customer").length;
      const totalProducts = mockStore.products.length;
      const totalRevenue = mockStore.orders.reduce((sum, o) => sum + (o.paymentStatus === "PAID" ? o.total : 0), 0);
      const lowStockProducts = mockStore.products.filter((p) => p.stock <= 20);

      return res.status(200).json({
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          pendingOrders,
          totalCustomers,
          totalProducts,
          lowStockCount: lowStockProducts.length,
          lowStockProducts,
          recentOrders: mockStore.orders.slice(0, 5),
        },
      });
    }

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();

    const paidOrders = await Order.find({ paymentStatus: "PAID" });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = await Product.find({ stock: { $lte: 15 } }).select("name sku stock category thumbnail");
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomersAdmin = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const customers = mockStore.users.filter((u) => u.role === "customer");
      return res.status(200).json({ success: true, data: { customers, pagination: { total: customers.length, page: 1, limit: 20 } } });
    }
    const customers = await User.find({ role: "customer" }).select("-passwordHash").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { customers, pagination: { total: customers.length, page: 1, limit: 20 } } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogsAdmin = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: {
          logs: [
            { adminEmail: "admin@a1chips.com", action: "SYSTEM_START", entity: "Server", timestamp: new Date() },
            { adminEmail: "admin@a1chips.com", action: "PRODUCT_UPDATE", entity: "Masala Munch", timestamp: new Date() },
          ],
        },
      });
    }
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({ success: true, data: { logs } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
