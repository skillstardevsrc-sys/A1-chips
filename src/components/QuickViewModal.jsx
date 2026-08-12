import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar, FaShoppingBag, FaHeart, FaTruck, FaShieldAlt } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useNavigate } from "react-router-dom";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedWeight, setSelectedWeight] = useState(
    product.variants?.[0]?.weight || product.weight || "200g"
  );
  const [quantity, setQuantity] = useState(1);

  const activeVariant = product.variants?.find((v) => v.weight === selectedWeight) || product.variants?.[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const comparePrice = activeVariant ? activeVariant.compareAtPrice : product.compareAtPrice;
  const isSaved = isInWishlist(product._id);

  const handleAddToCart = async () => {
    await addToCart(product._id, activeVariant?._id, selectedWeight, quantity);
    onClose();
  };

  const handleViewFullProduct = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-[#14090C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors z-20"
          >
            <FaTimes size={14} />
          </button>

          {/* Left Image */}
          <div className="relative flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-4 border border-white/10">
            <img
              src={product.thumbnail || product.images?.[0] || "/masala_munch-removebg-preview.png"}
              alt={product.name}
              className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#C44100] text-white shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-white/10 text-[#FFC02D] border border-white/15">
                {product.category?.name || "Premium Snack"}
              </span>

              <h2 className="text-xl sm:text-2xl font-black font-montserrat tracking-tight text-white mt-2 mb-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={11} className={i < Math.floor(product.rating || 5) ? "text-amber-400" : "text-white/20"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-white font-mono">{product.rating || 4.8}</span>
                <span className="text-[11px] text-white/50">({product.reviewCount || 42} reviews)</span>
              </div>

              <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed font-normal">
                {product.shortDescription || product.description}
              </p>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-[#FFC02D] font-mono">₹{activePrice}</span>
                {comparePrice > activePrice && (
                  <span className="text-xs text-white/40 line-through font-mono">₹{comparePrice}</span>
                )}
              </div>

              {/* Weight Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    Select Weight:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.weight}
                        onClick={() => setSelectedWeight(v.weight)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                          selectedWeight === v.weight
                            ? "bg-white text-black border-white shadow"
                            : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {v.weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/15">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-white/80 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-white/80 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-[#C44100] hover:bg-[#F05A00] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <FaShoppingBag size={12} /> Add to Bag
                </button>
              </div>

              <button
                onClick={handleViewFullProduct}
                className="w-full py-2.5 text-center text-xs font-bold text-white/70 hover:text-[#FFC02D] transition-colors uppercase tracking-wider"
              >
                View Full Product Details →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
