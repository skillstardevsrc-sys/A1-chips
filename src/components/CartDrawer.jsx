import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaShoppingBag, FaTrashAlt, FaPlus, FaMinus, FaArrowRight, FaTruck } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem, fetchCart, freeShippingThreshold } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const shippingProgress = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#12080A] border-l border-white/10 text-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#1A0C0F]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C44100]/20 flex items-center justify-center text-[#FFC02D]">
                  <FaShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-wide uppercase font-montserrat">Your Snack Bag</h3>
                  <p className="text-xs text-white/60 font-medium">{totalItemCount} {totalItemCount === 1 ? "item" : "items"} selected</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-6 py-3.5 bg-gradient-to-r from-[#1E090D] via-[#2A0E13] to-[#1E090D] border-b border-white/10">
              <div className="flex items-center gap-2 mb-1.5 text-xs">
                <FaTruck className="text-[#FFC02D]" />
                {remainingForFreeShipping > 0 ? (
                  <span className="text-white/90">
                    Add <strong className="text-[#FFC02D]">₹{remainingForFreeShipping}</strong> more for <strong className="text-emerald-400">FREE SHIPPING</strong>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">🎉 You unlocked FREE Delivery!</span>
                )}
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F05A00] to-[#FFC02D] transition-all duration-500 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-white/5">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-white/60">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                    <FaShoppingBag size={36} />
                  </div>
                  <p className="font-bold text-lg text-white mb-1">Your bag is empty</p>
                  <p className="text-xs max-w-xs mb-6">Discover our legendary crunchy chips and savouries handcrafted in Coimbatore.</p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/shop");
                    }}
                    className="bg-[#C44100] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#F05A00] transition-colors uppercase tracking-wider"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                cart.items.map((item, index) => (
                  <div key={index} className="pt-4 first:pt-0 flex gap-4 items-center">
                    <img
                      src={item.imageSnapshot || "/masala_munch-removebg-preview.png"}
                      alt={item.nameSnapshot}
                      className="w-16 h-16 object-contain rounded-xl bg-white/5 p-1.5 border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate font-montserrat">{item.nameSnapshot}</h4>
                      <p className="text-xs text-white/50 mb-2 font-mono">Weight: {item.weight}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.product._id || item.product, item.weight, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id || item.product, item.weight, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <span className="font-extrabold text-sm text-[#FFC02D] font-mono">₹{item.priceSnapshot * item.quantity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id || item.product, item.weight)}
                      className="text-white/40 hover:text-red-400 p-2 transition-colors"
                      title="Remove item"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#1A0C0F] space-y-4">
                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-sm font-bold text-white">₹{cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-emerald-400">
                      {remainingForFreeShipping === 0 ? "FREE" : "₹50"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                    <span className="font-montserrat">Estimated Total</span>
                    <span className="font-mono text-[#FFC02D]">₹{cart.subtotal + (remainingForFreeShipping === 0 ? 0 : 50)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleViewCartClick}
                    className="w-full py-3.5 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition-colors uppercase tracking-wider"
                  >
                    View Bag
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:from-[#FF6B10] hover:to-[#D54800] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                  >
                    Checkout <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
