import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaShoppingBag, FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";

const MobileProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedWeight, setSelectedWeight] = useState(
    product.variants?.[0]?.weight || product.weight || "200g"
  );

  const activeVariant = product.variants?.find((v) => v.weight === selectedWeight) || product.variants?.[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const comparePrice = activeVariant ? activeVariant.compareAtPrice : product.compareAtPrice;
  const discountPercent = comparePrice > activePrice ? Math.round(((comparePrice - activePrice) / comparePrice) * 100) : 0;
  const isSaved = isInWishlist(product._id);

  // Check if item is already in cart
  const cartItem = cart.items.find(
    (i) => (i.product._id === product._id || i.product === product._id) && i.weight === selectedWeight
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product._id, activeVariant?._id, selectedWeight, 1);
  };

  const handleIncrement = async (e) => {
    e.stopPropagation();
    await updateQuantity(product._id, selectedWeight, inCartQty + 1);
  };

  const handleDecrement = async (e) => {
    e.stopPropagation();
    await updateQuantity(product._id, selectedWeight, inCartQty - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      className="bg-[#17090B] border border-[#FF6B10]/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg relative font-poppins text-white h-full group select-none"
    >
      {/* Image Area */}
      <div
        onClick={() => navigate(`/product/${product.slug}`)}
        className="relative h-36 sm:h-44 w-full bg-gradient-to-b from-[#2B0E10] to-[#17090B] flex items-center justify-center p-2 cursor-pointer overflow-hidden"
      >
        <img
          src={product.thumbnail || product.images?.[0] || "/masala_munch-removebg-preview.png"}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge Pill Top Left */}
        <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-md border border-[#FF9E1B]/50 px-2 py-0.5 rounded-full text-[9px] font-black text-[#FFC02D] uppercase font-mono tracking-wider shadow">
          {product.badge || "BESTSELLER"}
        </div>

        {/* Wishlist Heart Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all shadow ${
            isSaved ? "text-rose-500 bg-black/80" : "text-white/80 hover:text-white"
          }`}
          title="Wishlist"
        >
          <FaHeart size={11} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      {/* Details Container */}
      <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-[#FFC02D] mb-1">
            <FaStar size={10} />
            <span className="font-extrabold text-white text-[11px]">{product.rating || 4.8}</span>
            <span className="text-white/40">({product.reviewCount || 310})</span>
          </div>

          {/* Title */}
          <h4
            onClick={() => navigate(`/product/${product.slug}`)}
            className="font-extrabold text-xs text-white font-montserrat line-clamp-1 leading-snug cursor-pointer hover:text-[#FFC02D] transition-colors mb-1"
          >
            {product.name}
          </h4>

          {/* Weight Tag */}
          <span className="text-[10px] text-white/50 font-mono block">Pack: {selectedWeight}</span>
        </div>

        {/* Price & Add Stepper */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-base font-black text-[#FFC02D]">₹{activePrice}</span>
              {comparePrice > activePrice && (
                <span className="text-[10px] text-white/40 line-through">₹{comparePrice}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9.5px] font-extrabold text-emerald-400 font-mono">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Quick Stepper vs Add Button */}
          {inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-[#F05A00] text-white rounded-xl p-1 shadow-md font-mono">
              <button
                onClick={handleDecrement}
                className="w-7 h-6 flex items-center justify-center hover:bg-black/20 rounded-lg transition-colors"
              >
                <FaMinus size={9} />
              </button>
              <span className="text-xs font-black px-2">{inCartQty}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-6 flex items-center justify-center hover:bg-black/20 rounded-lg transition-colors"
              >
                <FaPlus size={9} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FF5100] via-[#F05A00] to-[#FF2200] hover:brightness-110 text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all font-mono"
            >
              <FaPlus size={10} /> ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProductCard;
