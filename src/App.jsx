import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import StoresPage from "./pages/StoresPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AccountPage from "./pages/AccountPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { AboutPage, ContactPage, ShippingPolicyPage, RefundPolicyPage } from "./pages/PolicyPages";
import AdminDashboard from "./pages/AdminPages";

import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import PageTransition from "./components/common/PageTransition";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const location = useLocation();

  useEffect(() => {
    fetchMe();
    fetchCart();
  }, []);

  return (
    <>
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/store-locator" element={<StoresPage />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/products/:categorySlug" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPolicyPage />} />
          <Route path="/returns" element={<RefundPolicyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </PageTransition>

      {/* App-like Fixed Mobile/Tablet Bottom Navigation (lg:hidden) */}
      <MobileBottomNav />
    </>
  );
}

export default App;
