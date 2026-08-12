import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { mockProducts } from "../data/mockProducts";

const popularTags = ["Masala Munch", "Banana Chips", "Tapioca", "Butter Murukku", "Combos", "Spicy"];

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      let found = [];
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}&limit=6`);
        found = res.data?.products || [];
      } catch (e) {
        console.warn("API search failed, fallback to mockProducts", e);
      }

      if (!found || found.length === 0) {
        const s = searchTerm.toLowerCase();
        found = mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.shortDescription?.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        ).slice(0, 6);
      }

      setResults(found);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#14090C] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 text-white overflow-hidden"
        >
          {/* Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-6">
            <FaSearch className="absolute left-4 text-white/40" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search banana chips, masala munch, tapioca, combos..."
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-12 pr-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00] transition-colors text-sm font-medium"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 text-white/40 hover:text-white"
              >
                <FaTimes size={16} />
              </button>
            ) : (
              <button type="button" onClick={onClose} className="absolute right-4 text-white/40 hover:text-white">
                <FaTimes size={16} />
              </button>
            )}
          </form>

          {/* Popular tags */}
          {!searchTerm && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/80 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {searchTerm && (
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                  {isLoading ? "Searching..." : `Results (${results.length})`}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs text-[#FFC02D] hover:underline flex items-center gap-1"
                  >
                    View all results <FaArrowRight size={10} />
                  </button>
                )}
              </div>

              {results.length === 0 && !isLoading ? (
                <div className="py-8 text-center text-white/50 text-sm">
                  No chips found matching "<span className="text-white">{searchTerm}</span>". Try another search keyword!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <img
                        src={product.thumbnail || product.images?.[0] || "/masala_munch-removebg-preview.png"}
                        alt={product.name}
                        className="w-14 h-14 object-contain bg-black/30 rounded-xl p-1 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate font-montserrat group-hover:text-[#FFC02D] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1 my-0.5">
                          <FaStar className="text-amber-400" size={10} />
                          <span className="text-[11px] text-white/70 font-mono">{product.rating}</span>
                          <span className="text-[10px] text-white/40 ml-1">({product.weight})</span>
                        </div>
                        <span className="font-extrabold text-xs text-white font-mono">₹{product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
