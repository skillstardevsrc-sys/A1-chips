import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g. "100g", "200g", "500g", "1kg"
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 100 },
  image: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    brand: { type: String, default: "A1 Chips" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    categorySlug: { type: String, default: "" },
    images: [{ type: String }],
    thumbnail: { type: String, default: "" },
    gallery: [{ type: String }],
    variants: [variantSchema],
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    nutrition: {
      energy: { type: String, default: "520 kcal" },
      protein: { type: String, default: "6.5g" },
      carbohydrates: { type: String, default: "54g" },
      fat: { type: String, default: "31g" },
      sodium: { type: String, default: "480mg" },
    },
    weight: { type: String, default: "200g" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    lowStockThreshold: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    spiceLevel: { type: String, enum: ["Mild", "Medium", "Spicy", "Extra Spicy"], default: "Medium" },
    flavourProfile: { type: String, default: "Crispy & Salted" },
    texture: { type: String, default: "Ultra Crunchy" },
    occasion: { type: String, default: "Teatime Snack" },
    dietaryTags: [{ type: String }],
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    bgGradient: { type: String, default: "radial-gradient(circle at 65% 45%, #F05A00 0%, #B83500 55%, #6B1D00 100%)" },
    glowColor: { type: String, default: "rgba(255, 120, 30, 0.45)" },
    accentColor: { type: String, default: "#FFC02D" },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ name: "text", tags: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
