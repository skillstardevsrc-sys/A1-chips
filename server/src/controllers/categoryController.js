import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getCategories = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: { categories: mockStore.categories } });
    }
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return res.status(200).json({ success: true, data: { categories } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const cat = { _id: `cat_${Date.now()}`, ...req.body };
      mockStore.categories.push(cat);
      return res.status(201).json({ success: true, message: "Category created", data: { category: cat } });
    }
    const category = await Category.create(req.body);
    return res.status(201).json({ success: true, message: "Category created", data: { category } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const idx = mockStore.categories.findIndex((c) => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Category not found" });
      mockStore.categories[idx] = { ...mockStore.categories[idx], ...req.body };
      return res.status(200).json({ success: true, message: "Category updated", data: { category: mockStore.categories[idx] } });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, message: "Category updated", data: { category } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      mockStore.categories = mockStore.categories.filter((c) => c._id !== req.params.id);
      return res.status(200).json({ success: true, message: "Category deleted" });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
