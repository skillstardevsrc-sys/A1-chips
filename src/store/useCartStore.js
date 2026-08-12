import { create } from "zustand";
import { api } from "../services/api";

const getSessionId = () => {
  let id = localStorage.getItem("a1_cart_session");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("a1_cart_session", id);
  }
  return id;
};

export const useCartStore = create((set, get) => ({
  cart: { items: [], subtotal: 0 },
  isCartOpen: false,
  isLoading: false,
  freeShippingThreshold: 499,

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const sessionId = getSessionId();
      const res = await api.get(`/cart?sessionId=${sessionId}`);
      set({ cart: res.data.cart || { items: [], subtotal: 0 }, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, variantId, weight, quantity = 1) => {
    set({ isLoading: true });
    try {
      const sessionId = getSessionId();
      const res = await api.post("/cart/add", {
        productId,
        variantId,
        weight,
        quantity,
        sessionId,
      });
      set({ cart: res.data.cart, isCartOpen: true, isLoading: false });
      return { success: true, message: res.message || "Added to cart" };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.message || "Could not add item to cart" };
    }
  },

  updateQuantity: async (productId, weight, quantity) => {
    try {
      const sessionId = getSessionId();
      const res = await api.put("/cart/update", {
        productId,
        weight,
        quantity,
        sessionId,
      });
      set({ cart: res.data.cart });
    } catch (err) {
      console.error(err);
    }
  },

  removeItem: async (productId, weight) => {
    try {
      const sessionId = getSessionId();
      const res = await api.post("/cart/remove", { productId, weight, sessionId });
      set({ cart: res.data.cart });
    } catch (err) {
      console.error(err);
    }
  },

  clearCart: async () => {
    try {
      const sessionId = getSessionId();
      await api.post("/cart/clear", { sessionId });
      set({ cart: { items: [], subtotal: 0 } });
    } catch (err) {
      console.error(err);
    }
  },
}));
