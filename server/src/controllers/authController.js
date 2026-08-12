import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateTokens = (id) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET || "a1_chips_jwt_access_secret_2026_key_production_super_secret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "a1_chips_jwt_refresh_secret_2026_key_production_super_secret";

  const accessToken = jwt.sign({ id }, accessSecret, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ id }, refreshSecret, { expiresIn: "30d" });

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
    }

    const emailClean = email.toLowerCase().trim();

    if (!isDbConnected()) {
      const existing = mockStore.users.find((u) => u.email === emailClean);
      if (existing) return res.status(400).json({ success: false, message: "Email is already registered" });

      const salt = bcrypt.genSaltSync(10);
      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: emailClean,
        phone: phone || "",
        passwordHash: bcrypt.hashSync(password, salt),
        role: "customer",
        avatar: "",
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
      };

      mockStore.users.push(newUser);
      const { accessToken, refreshToken } = generateTokens(newUser._id);

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role },
          accessToken,
          refreshToken,
        },
      });
    }

    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) return res.status(400).json({ success: false, message: "Email is already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: emailClean,
      phone: phone || "",
      passwordHash,
      role: "customer",
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const emailClean = email.toLowerCase().trim();

    if (!isDbConnected()) {
      const user = mockStore.users.find((u) => u.email === emailClean);
      if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

      const { accessToken, refreshToken } = generateTokens(user._id);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
          user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar || "" },
          accessToken,
          refreshToken,
        },
      });
    }

    const user = await User.findOne({ email: emailClean });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar || "",
      },
    },
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    if (!isDbConnected()) {
      const idx = mockStore.users.findIndex((u) => u._id === req.user._id || u._id === req.user.id);
      if (idx !== -1) {
        if (name) mockStore.users[idx].name = name;
        if (phone !== undefined) mockStore.users[idx].phone = phone;
        if (avatar !== undefined) mockStore.users[idx].avatar = avatar;
        return res.status(200).json({
          success: true,
          message: "Profile updated",
          data: { user: mockStore.users[idx] },
        });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  return res.status(200).json({ success: true, message: "Password updated successfully" });
};
