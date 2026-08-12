import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { mockStore } from "../config/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      search,
      category,
      minPrice,
      maxPrice,
      weight,
      spiceLevel,
      rating,
      sort = "newest",
      isBestseller,
      isFeatured,
      isNewArrival,
    } = req.query;

    if (!isDbConnected()) {
      let filtered = [...mockStore.products].filter((p) => p.isActive);

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        );
      }

      if (category) {
        if (category === "snack-squad") {
          filtered = filtered.filter((p) => p.isBestseller || p.isFeatured || p.categorySlug === "snack-squad");
        } else {
          filtered = filtered.filter((p) => p.categorySlug === category || p.category?._id === category || p.category?.slug === category);
        }
      }

      if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      if (spiceLevel) filtered = filtered.filter((p) => p.spiceLevel === spiceLevel);
      if (rating) filtered = filtered.filter((p) => p.rating >= Number(rating));
      if (isBestseller === "true") filtered = filtered.filter((p) => p.isBestseller);
      if (isFeatured === "true") filtered = filtered.filter((p) => p.isFeatured);

      if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
      else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

      const total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(skip, skip + Number(limit));

      return res.status(200).json({
        success: true,
        data: {
          products: paginated,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)) || 1,
          },
        },
      });
    }

    // MongoDB Mongoose query
    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      if (category === "snack-squad") {
        query.$or = [{ isBestseller: true }, { isFeatured: true }];
      } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (spiceLevel) query.spiceLevel = spiceLevel;
    if (rating) query.rating = { $gte: Number(rating) };
    if (isBestseller === "true") query.isBestseller = true;
    if (isFeatured === "true") query.isFeatured = true;

    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") sortOptions = { price: 1 };
    if (sort === "price_desc") sortOptions = { price: -1 };
    if (sort === "rating") sortOptions = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isDbConnected()) {
      const product = mockStore.products.find((p) => p.slug === slug);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      const relatedProducts = mockStore.products
        .filter((p) => p.categorySlug === product.categorySlug && p.slug !== slug)
        .slice(0, 4);

      return res.status(200).json({ success: true, data: { product, relatedProducts } });
    }

    const product = await Product.findOne({ slug, isActive: true }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select("name slug thumbnail price compareAtPrice rating weight accentColor bgGradient");

    return res.status(200).json({ success: true, data: { product, relatedProducts } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findYourCrunch = async (req, res) => {
  try {
    const { spice } = req.query;

    if (!isDbConnected()) {
      let filtered = mockStore.products;
      if (spice === "Mild") filtered = filtered.filter((p) => p.spiceLevel === "Mild");
      else if (spice === "Spicy" || spice === "Fiery") filtered = filtered.filter((p) => p.spiceLevel === "Spicy");
      return res.status(200).json({ success: true, data: { recommendations: filtered.slice(0, 6) } });
    }

    const query = { isActive: true };
    if (spice) {
      if (spice === "Mild") query.spiceLevel = "Mild";
      else if (spice === "Spicy" || spice === "Fiery") query.spiceLevel = { $in: ["Spicy", "Extra Spicy"] };
    }

    const recommendations = await Product.find(query).limit(6).populate("category", "name slug");
    return res.status(200).json({ success: true, data: { recommendations } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const newProd = { _id: `prod_${Date.now()}`, ...req.body, createdAt: new Date() };
      mockStore.products.push(newProd);
      return res.status(201).json({ success: true, message: "Product created", data: { product: newProd } });
    }
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, message: "Product created", data: { product } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = mockStore.products.findIndex((p) => p._id === id || p.slug === id);
      if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });
      mockStore.products[idx] = { ...mockStore.products[idx], ...req.body };
      return res.status(200).json({ success: true, message: "Product updated", data: { product: mockStore.products[idx] } });
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product updated", data: { product } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      mockStore.products = mockStore.products.filter((p) => p._id !== id);
      return res.status(200).json({ success: true, message: "Product deleted" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
