import React from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaBolt } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const MobileStickyAddToCart = ({ product, selectedWeight, quantity }) => {
  const { addToCart, openCart } = useCartStore();
  const navigate = useNavigate();

  if (!product) return null;

  const activeVariant = product.variants?.find((v) => v.weight === selectedWeight) || product.variants?.[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;

  const handleAddToCart = async () => {
    await addToCart(product._id, activeVariant?._id, selectedWeight, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product._id, activeVariant?._id, selectedWeight, quantity);
    openCart();
    navigate("/checkout");
  };

  return (
    <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-[#14090C]/95 backdrop-blur-xl border-t border-white/15 px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3">
      <div>
        <span className="text-[10px] text-white/50 block font-mono">Weight: {selectedWeight}</span>
        <span className="text-xl font-black text-[#FFC02D] font-mono">₹{activePrice * quantity}</span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="py-2.5 px-4 rounded-xl bg-[#C44100] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg font-mono cursor-pointer"
        >
          <FaShoppingBag size={11} /> ADD
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBuyNow}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F05A00] to-[#FFC02D] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg font-mono cursor-pointer"
        >
          <FaBolt size={11} /> BUY NOW
        </motion.button>
      </div>
    </div>
  );
};

export default MobileStickyAddToCart;
