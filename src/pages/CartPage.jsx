import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaTrashAlt, FaPlus, FaMinus, FaArrowRight, FaTruck, FaTag } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartStore } from "../store/useCartStore";
import { api } from "../services/api";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

const CartPage = () => {
  const { cart, updateQuantity, removeItem, fetchCart, freeShippingThreshold } = useCartStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    if (!couponCode.trim()) return;

    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        subtotal: cart.subtotal,
      });
      setAppliedCoupon(res.data);
      setCouponSuccess(res.message);
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cart.subtotal - discountAmount);

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins pb-24 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <Reveal variant="fade-down" amount={0.1}>
          <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">Shopping Bag</h1>
          <p className="text-xs text-white/60 mb-8 font-mono">Review your selected Coimbatore chips and savouries before checkout.</p>
        </Reveal>

        {cart.items.length === 0 ? (
          <Reveal variant="scale" amount={0.2} className="py-20 text-center bg-white/5 rounded-3xl border border-white/10 p-8 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
              <FaShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold mb-2 font-montserrat">Your Bag is Empty</h2>
            <p className="text-xs text-white/60 mb-6 font-mono">Looks like you haven't added any A1 Chips savouries yet.</p>
            <Link to="/shop" className="bg-[#C44100] text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-[#F05A00] uppercase tracking-wider font-mono">
              Explore Products
            </Link>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Banner */}
              <Reveal variant="fade-up" amount={0.1} className="p-4 rounded-2xl bg-gradient-to-r from-[#200A0E] via-[#350F14] to-[#200A0E] border border-white/10 flex items-center gap-3 shadow-xl">
                <FaTruck className="text-[#FFC02D]" size={20} />
                <div className="text-xs">
                  {cart.subtotal >= freeShippingThreshold ? (
                    <span className="font-extrabold text-emerald-400 font-mono">
                      🎉 Congratulations! You unlocked Free Shipping on this order.
                    </span>
                  ) : (
                    <span className="text-white/80 font-mono">
                      Add <strong className="text-[#FFC02D]">₹{freeShippingThreshold - cart.subtotal}</strong> more to get <strong>Free Standard Shipping</strong>!
                    </span>
                  )}
                </div>
              </Reveal>

              {/* Items List */}
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={`${item.product._id}-${item.weight}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-[#14090C] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.product.thumbnail || item.product.images?.[0] || "/masala_munch-removebg-preview.png"}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain bg-white/5 rounded-xl p-1 shrink-0"
                      />
                      <div>
                        <h3 className="font-extrabold text-sm text-white font-montserrat">{item.product.name}</h3>
                        <p className="text-xs text-white/50 font-mono">Weight: {item.weight}</p>
                        <p className="font-bold text-[#FFC02D] font-mono text-xs mt-1">₹{item.price} each</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/15">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.weight, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/80"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="w-8 text-center text-xs font-black font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.weight, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/80"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-white">₹{item.price * item.quantity}</span>
                      </div>

                      <button
                        onClick={() => removeItem(item.product._id, item.weight)}
                        className="text-white/40 hover:text-rose-400 p-2 transition-colors"
                        title="Remove item"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Reveal variant="fade-left" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-24">
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-montserrat border-b border-white/10 pb-3">
                  Order Summary
                </h3>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-mono text-white/70">Promo / Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. CRUNCH10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-white/40 focus:outline-none flex-1 font-mono"
                    />
                    <button type="submit" className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl font-mono">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400 font-mono">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-400 font-mono">{couponSuccess}</p>}
                </form>

                <div className="space-y-2.5 text-xs font-mono border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/70">
                    <span>Bag Subtotal</span>
                    <span>₹{cart.subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Estimated Shipping</span>
                    <span>{cart.subtotal >= freeShippingThreshold ? "FREE" : "₹49"}</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-base font-black text-[#FFC02D]">
                    <span>Grand Total</span>
                    <span>₹{finalTotal + (cart.subtotal >= freeShippingThreshold ? 0 : 49)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F05A00] via-[#FF5100] to-[#FFC02D] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:brightness-110 transition-all cursor-pointer font-mono"
                >
                  Proceed to Checkout <FaArrowRight size={12} />
                </button>

                <p className="text-[10px] text-white/40 text-center font-mono">
                  100% Secure Checkout · Razorpay / UPI / Cards / COD Supported
                </p>
              </Reveal>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
