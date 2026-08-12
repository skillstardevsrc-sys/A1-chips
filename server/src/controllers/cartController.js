import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const calculateCartSummary = async (items) => {
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) continue;

    // Find variant
    const variant = product.variants.find((v) => String(v._id) === String(item.variantId) || v.weight === item.weight) || product.variants[0];
    const unitPrice = variant ? variant.price : product.price;

    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    processedItems.push({
      product: product._id,
      variantId: variant ? String(variant._id) : "default",
      weight: variant ? variant.weight : item.weight || "200g",
      quantity: item.quantity,
      priceSnapshot: unitPrice,
      nameSnapshot: product.name,
      imageSnapshot: product.thumbnail || product.images[0] || "",
    });
  }

  return { items: processedItems, subtotal };
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.query;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate("items.product", "name slug images thumbnail price compareAtPrice");
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate("items.product", "name slug images thumbnail price compareAtPrice");
    }

    if (!cart) {
      return res.status(200).json({ success: true, data: { cart: { items: [], subtotal: 0 } } });
    }

    const { items, subtotal } = await calculateCartSummary(cart.items);

    return res.status(200).json({
      success: true,
      data: { cart: { _id: cart._id, items, subtotal } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, weight, quantity = 1, sessionId } = req.body;
    const userId = req.user?._id;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not available" });
    }

    const variant = product.variants.find((v) => String(v._id) === String(variantId) || v.weight === weight) || product.variants[0];
    const availableStock = variant ? variant.stock : product.stock;

    if (availableStock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${availableStock} units available in stock` });
    }

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, items: [] });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      if (!cart) cart = new Cart({ sessionId, items: [] });
    } else {
      return res.status(400).json({ success: false, message: "User or Session ID required" });
    }

    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId) && (item.weight === (variant?.weight || weight) || item.variantId === String(variantId))
    );

    const priceSnapshot = variant ? variant.price : product.price;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > availableStock) {
        return res.status(400).json({ success: false, message: `Cannot add more. Stock limit is ${availableStock}` });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].priceSnapshot = priceSnapshot;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant ? String(variant._id) : "default",
        weight: variant ? variant.weight : weight || "200g",
        quantity: Number(quantity),
        priceSnapshot,
        nameSnapshot: product.name,
        imageSnapshot: product.thumbnail || product.images[0] || "",
      });
    }

    await cart.save();
    const { items, subtotal } = await calculateCartSummary(cart.items);

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      data: { cart: { _id: cart._id, items, subtotal } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, variantId, weight, quantity, sessionId } = req.body;
    const userId = req.user?._id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId) && (item.weight === weight || item.variantId === String(variantId))
    );

    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();
    const { items, subtotal } = await calculateCartSummary(cart.items);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { cart: { _id: cart._id, items, subtotal } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId, weight, sessionId } = req.body;
    const userId = req.user?._id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((item) => !(String(item.product) === String(productId) && item.weight === weight));

    await cart.save();
    const { items, subtotal } = await calculateCartSummary(cart.items);

    return res.status(200).json({
      success: true,
      message: "Item removed",
      data: { cart: { _id: cart._id, items, subtotal } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.body;

    let cart;
    if (userId) cart = await Cart.findOne({ user: userId });
    else if (sessionId) cart = await Cart.findOne({ sessionId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: { cart: { items: [], subtotal: 0 } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
