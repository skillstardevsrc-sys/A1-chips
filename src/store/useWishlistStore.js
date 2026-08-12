import { create } from "zustand";
import { api } from "../services/api";

export const useWishlistStore = create((set, get) => ({
  wishlist: { products: [] },
  isLoading: false,

  fetchWishlist: async () => {
    if (!localStorage.getItem("a1_access_token")) return;
    set({ isLoading: true });
    try {
      const res = await api.get("/wishlist");
      set({ wishlist: res.data.wishlist || { products: [] }, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    if (!localStorage.getItem("a1_access_token")) {
      return { success: false, requireAuth: true, message: "Please sign in to save items to your wishlist" };
    }
    try {
      const res = await api.post("/wishlist/toggle", { productId });
      set({ wishlist: res.data.wishlist });
      return { success: true, message: res.message };
    } catch (e) {
      return { success: false, message: e.message || "Failed to update wishlist" };
    }
  },

  isInWishlist: (productId) => {
    const products = get().wishlist?.products || [];
    return products.some((p) => (typeof p === "string" ? p === productId : p._id === productId));
  },
}));
