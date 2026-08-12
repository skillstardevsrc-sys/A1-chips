import { Bundle } from "../models/Bundle.js";
import { Product } from "../models/Product.js";

export const getBundles = async (req, res) => {
  try {
    let bundles = await Bundle.find({ isActive: true }).populate("allowedProducts", "name slug images thumbnail price weight accentColor");
    if (bundles.length === 0) {
      // Default bundle configurations
      bundles = [
        { boxSize: 4, name: "Snack Box — 4 Packs", price: 349, discountPercentage: 15 },
        { boxSize: 6, name: "Snack Box — 6 Packs", price: 499, discountPercentage: 20 },
        { boxSize: 8, name: "Mega Party Box — 8 Packs", price: 649, discountPercentage: 25 },
      ];
    }
    return res.status(200).json({ success: true, data: { bundles } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateBundlePrice = async (req, res) => {
  try {
    const { boxSize, selectedProductIds } = req.body;
    if (!selectedProductIds || selectedProductIds.length !== Number(boxSize)) {
      return res.status(400).json({ success: false, message: `Please select exactly ${boxSize} items for this snack box` });
    }

    const products = await Product.find({ _id: { $in: selectedProductIds } });
    let rawTotal = 0;
    products.forEach((p) => {
      rawTotal += p.price;
    });

    const discountPercentage = boxSize === 4 ? 15 : boxSize === 6 ? 20 : 25;
    const finalPrice = Math.round(rawTotal * (1 - discountPercentage / 100));

    return res.status(200).json({
      success: true,
      data: {
        boxSize: Number(boxSize),
        rawTotal,
        discountPercentage,
        finalPrice,
        savings: rawTotal - finalPrice,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
