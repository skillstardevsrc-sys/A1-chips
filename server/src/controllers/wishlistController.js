import { Wishlist } from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name slug images thumbnail price compareAtPrice rating reviewCount weight accentColor bgGradient"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return res.status(200).json({ success: true, data: { wishlist } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex((p) => String(p) === String(productId));
    let action = "";

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = "removed";
    } else {
      wishlist.products.push(productId);
      action = "added";
    }

    await wishlist.save();
    await wishlist.populate("products", "name slug images thumbnail price compareAtPrice rating reviewCount weight");

    return res.status(200).json({
      success: true,
      message: `Product ${action} wishlist`,
      data: { wishlist },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
