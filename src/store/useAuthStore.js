import { create } from "zustand";
import { api } from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("a1_user") || "null"),
  token: localStorage.getItem("a1_access_token") || null,
  isAuthenticated: !!localStorage.getItem("a1_access_token"),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, accessToken } = res.data;

      localStorage.setItem("a1_access_token", accessToken);
      localStorage.setItem("a1_user", JSON.stringify(user));

      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (err) {
      set({ error: err.message || "Login failed", isLoading: false });
      return { success: false, message: err.message || "Login failed" };
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/register", { name, email, password, phone });
      const { user, accessToken } = res.data;

      localStorage.setItem("a1_access_token", accessToken);
      localStorage.setItem("a1_user", JSON.stringify(user));

      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (err) {
      set({ error: err.message || "Registration failed", isLoading: false });
      return { success: false, message: err.message || "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("a1_access_token");
    localStorage.removeItem("a1_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    if (!localStorage.getItem("a1_access_token")) return;
    try {
      const res = await api.get("/auth/me");
      const user = res.data.user;
      localStorage.setItem("a1_user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (e) {
      get().logout();
    }
  },
}));
