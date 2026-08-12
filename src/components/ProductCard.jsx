import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaEye, FaShoppingBag, FaFire, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import MobileProductCard from "./MobileProductCard";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedWeight, setSelectedWeight] = useState(
    product.variants?.[0]?.weight || product.weight || "100g"
  );

  const activeVariant = product.variants?.find((v) => v.weight === selectedWeight) || product.variants?.[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const comparePrice = activeVariant ? activeVariant.compareAtPrice : product.compareAtPrice;
  const discountPercent = comparePrice > activePrice ? Math.round(((comparePrice - activePrice) / comparePrice) * 100) : 0;
  const isSaved = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product._id, activeVariant?._id, selectedWeight, 1);
  };

  return (
    <>
      {/* Mobile & Tablet Product Card (lg:hidden) */}
      <div className="lg:hidden h-full">
        <MobileProductCard product={product} onQuickView={onQuickView} />
      </div>

      {/* Desktop Product Card (hidden lg:flex) — UNTOUCHED */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex bg-[#17090B] border border-[#FF6B10]/30 hover:border-[#FF6B10]/60 rounded-[28px] overflow-hidden flex-col justify-between transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(255,80,0,0.25)] group relative font-poppins text-white h-full"
      >
        {/* Image Area with Overlay Elements */}
        <div
          onClick={() => navigate(`/product/${product.slug}`)}
          className="relative h-60 sm:h-64 w-full overflow-hidden bg-gradient-to-b from-[#2B0E10] to-[#17090B] flex items-center justify-center cursor-pointer p-4"
        >
          {/* Main Product Image */}
          <img
            src={product.thumbnail || product.images?.[0] || "/ultra_thin_banana.jpg"}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
          />

          {/* Top Left Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#FF9E1B]/50 text-[#FFC02D] text-[10px] font-black uppercase tracking-wider shadow-lg font-mono">
            <FaStar className="text-amber-400" size={10} />
            <span>{product.badge || "BESTSELLER"}</span>
          </div>

          {/* Top Right Quick Action Buttons */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickView) onQuickView(product);
              }}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 flex items-center justify-center text-white/90 hover:text-white transition-all shadow-md"
              title="Quick View"
            >
              <FaEye size={13} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
              className={`w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 flex items-center justify-center transition-all shadow-md ${
                isSaved ? "text-rose-500 bg-black/80" : "text-white/90 hover:text-white"
              }`}
              title="Wishlist"
            >
              <FaHeart size={13} className={isSaved ? "fill-current" : ""} />
            </button>
          </div>

          {/* Bottom Left Quality Seal */}
          <div className="absolute bottom-3.5 left-3.5 z-10 w-16 h-16 rounded-full bg-black/75 backdrop-blur-md border border-[#FFC02D]/40 flex flex-col items-center justify-center text-center p-1 shadow-xl pointer-events-none">
            <FaLeaf size={10} className="text-amber-400 mb-0.5" />
            <span className="text-[7.5px] font-black text-amber-300 uppercase tracking-tighter leading-tight font-montserrat">
              REAL BANANAS
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
          {/* Rating & Tag Row */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-white/70 mb-1.5">
              <div className="flex items-center gap-1 text-[#FFC02D]">
                <FaStar size={12} />
                <span className="font-extrabold text-white text-xs">{product.rating || 4.9}</span>
              </div>
              <span className="text-white/40">({product.reviewCount || 512})</span>
              <span className="text-white/30">|</span>
              <span className="text-orange-400 font-sans font-semibold flex items-center gap-1 text-xs">
                <FaFire size={11} className="text-orange-500" />
                {product.texture || product.flavourProfile || "Crispy & Light"}
              </span>
            </div>

            {/* Title */}
            <h3
              onClick={() => navigate(`/product/${product.slug}`)}
              className="text-xl font-black text-white font-montserrat tracking-tight leading-snug hover:text-[#FFC02D] transition-colors cursor-pointer line-clamp-1 mb-1"
            >
              {product.name}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-normal">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Weight Selector Pills Row */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {product.variants.map((v) => {
                  const isSelected = selectedWeight === v.weight;
                  return (
                    <button
                      key={v.weight}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWeight(v.weight);
                      }}
                      className={`px-4 py-2 rounded-2xl text-xs font-extrabold font-mono transition-all ${
                        isSelected
                          ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-orange-400/50 scale-105"
                          : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {v.weight}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider Line */}
          <div className="border-t border-white/10 pt-3 mt-auto">
            <div className="flex items-center justify-between">
              {/* Price Container */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#FFC02D] font-mono">₹{activePrice}</span>
                  {comparePrice > activePrice && (
                    <span className="text-xs text-white/40 line-through font-mono">₹{comparePrice}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-extrabold text-emerald-400 font-mono block mt-0.5">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Add To Cart Button */}
              <button
                onClick={handleAddToCart}
                className="py-3 px-5 rounded-full bg-gradient-to-r from-[#FF5100] via-[#F05A00] to-[#FF2200] hover:from-[#FF6600] hover:to-[#FF3300] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_25px_rgba(255,60,0,0.5)] hover:scale-105 transition-all duration-300 font-mono"
              >
                <FaShoppingBag size={12} /> ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductCard;
