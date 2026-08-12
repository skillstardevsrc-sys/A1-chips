import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaStar, FaShoppingBag, FaHeart, FaEye, FaThLarge, FaList, FaTimes, FaRedo } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryNav from "../components/CategoryNav";
import QuickViewModal from "../components/QuickViewModal";
import ProductCard from "../components/ProductCard";
import { CrunchCollectionBanner, SpiceModeBanner, TraditionalFavoritesBanner } from "../components/CatalogSectionBreaks";
import { api } from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { mockProducts } from "../data/mockProducts";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

const Shop = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Category determination
  const activeCategory = categorySlug || searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [spiceFilter, setSpiceFilter] = useState(searchParams.get("spice") || "");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "recommended");
  const [selectedWeights, setSelectedWeights] = useState({});

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchTerm, minPrice, maxPrice, spiceFilter, sortOption]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    let fetched = [];
    try {
      let query = `/products?sort=${sortOption}&limit=100`;
      if (activeCategory && activeCategory !== "all") query += `&category=${activeCategory}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;
      if (spiceFilter) query += `&spiceLevel=${spiceFilter}`;

      const res = await api.get(query);
      fetched = res.data?.products || [];
    } catch (e) {
      console.warn("API fetch failed, using fallback dataset", e);
    }

    if (!fetched || fetched.length === 0) {
      let filtered = [...mockProducts];

      if (activeCategory && activeCategory !== "all") {
        if (activeCategory === "snack-squad") {
          filtered = filtered.filter((p) => p.isBestseller || p.isFeatured || p.categorySlug === "snack-squad");
        } else {
          filtered = filtered.filter((p) => p.categorySlug === activeCategory || p.category?.slug === activeCategory);
        }
      }

      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.shortDescription?.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        );
      }

      if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      if (spiceFilter) filtered = filtered.filter((p) => p.spiceLevel === spiceFilter);

      if (sortOption === "price_asc") filtered.sort((a, b) => a.price - b.price);
      else if (sortOption === "price_desc") filtered.sort((a, b) => b.price - a.price);
      else if (sortOption === "rating") filtered.sort((a, b) => a.rating - b.rating);

      fetched = filtered;
    }

    setProducts(fetched);

    const weights = {};
    fetched.forEach((p) => {
      weights[p._id] = p.variants?.[0]?.weight || p.weight || "200g";
    });
    setSelectedWeights(weights);
    setIsLoading(false);
  };

  const handleSelectCategory = (slug) => {
    if (slug) {
      navigate(`/products/${slug}`);
    } else {
      navigate("/products");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSpiceFilter("");
    setSortOption("recommended");
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins pb-24 lg:pb-0">
      <Navbar />

      {/* Header Banner */}
      <SectionReveal
        as="div"
        variant="fade-down"
        amount={0.1}
        className="bg-gradient-to-r from-[#200A0E] via-[#350F14] to-[#200A0E] border-b border-white/10 py-8 sm:py-10 px-4 sm:px-6 text-center"
      >
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-[#FFC02D] bg-[#C44100]/20 px-3.5 py-1 sm:py-1.5 rounded-full border border-[#C44100]/40 inline-block mb-2.5 font-mono">
          A1 CHIPS PRODUCTS & CATEGORIES
        </span>
        <h1 className="text-2xl sm:text-5xl font-black font-montserrat tracking-tight mb-2 text-white">
          Every Crunch. <span className="text-[#FFC02D]">Every Craving.</span>
        </h1>
        <p className="text-white/70 text-xs sm:text-sm max-w-xl mx-auto">
          Explore our complete collection of 100% coconut oil banana chips, spicy potato wafers, cassava sticks, butter murukku & sweet halwa.
        </p>
      </SectionReveal>

      {/* Mobile Horizontal Category Scroller */}
      <div className="lg:hidden px-4 pt-4">
        <CategoryNav activeCategory={activeCategory} onSelectCategory={handleSelectCategory} layout="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 lg:py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Desktop Vertical Sidebar Category & Filters (hidden lg:block) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
          <Reveal variant="fade-right" amount={0.1}>
            <CategoryNav activeCategory={activeCategory} onSelectCategory={handleSelectCategory} layout="vertical" />
          </Reveal>

          {/* Refine Catalog Filters */}
          <Reveal variant="fade-right" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-5 backdrop-blur-md space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 text-[#FFC02D] font-montserrat">
                <FaFilter size={12} /> Refine Catalog
              </h3>
              <button onClick={handleResetFilters} className="text-[11px] text-white/50 hover:text-white flex items-center gap-1">
                <FaRedo size={10} /> Reset
              </button>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2 font-mono">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
                />
                <span className="text-white/40 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Spice Level Filter */}
            <div>
              <label className="block text-xs font-bold text-white/80 mb-2 font-mono">Spice Tolerance</label>
              <div className="flex flex-wrap gap-1.5">
                {["", "Mild", "Medium", "Spicy"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSpiceFilter(lvl)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all font-mono ${
                      spiceFilter === lvl ? "bg-[#F05A00] text-white shadow" : "bg-white/5 text-white/70 hover:bg-white/15"
                    }`}
                  >
                    {lvl || "All Spices"}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </aside>

        {/* Catalog Main Content */}
        <main className="flex-1">
          {/* Top Controls Bar */}
          <div className="bg-[#14090C] border border-white/10 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-[#C44100] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase font-mono shadow-md"
              >
                <FaFilter size={11} /> Filter & Sort
              </button>

              <div className="relative flex-1 sm:w-64">
                <FaSearch className="absolute left-3 top-2.5 text-white/40" size={12} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/50 font-mono">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                >
                  <option value="recommended" className="bg-[#12080A]">Recommended</option>
                  <option value="price_asc" className="bg-[#12080A]">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#12080A]">Price: High to Low</option>
                  <option value="rating" className="bg-[#12080A]">Highest Rated</option>
                  <option value="newest" className="bg-[#12080A]">Newest Arrivals</option>
                </select>
              </div>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/20 text-white" : "text-white/40"}`}
                >
                  <FaThLarge size={12} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/20 text-white" : "text-white/40"}`}
                >
                  <FaList size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 py-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 sm:h-80 bg-white/5 animate-pulse rounded-2xl sm:rounded-3xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-white/60 bg-[#14090C] rounded-3xl border border-white/10 p-6 sm:p-8">
              <p className="text-lg font-bold text-white mb-2 font-montserrat">Nothing crunchy here yet.</p>
              <p className="text-xs max-w-md mx-auto mb-6">
                Try resetting your search query or selecting a different category from the scroller above.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#C44100] text-white text-xs font-extrabold px-6 py-3 rounded-full hover:bg-[#F05A00] transition-colors uppercase tracking-wider font-mono"
              >
                Explore All Products
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Responsive Product Cards Grid (2-col Mobile, 3-col Tablet, 3-col Desktop) */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6"
                    : "space-y-3"
                }
              >
                {products.map((product, index) => {
                  const currentWeight = selectedWeights[product._id] || product.variants?.[0]?.weight || product.weight;
                  const activeVariant = product.variants?.find((v) => v.weight === currentWeight) || product.variants?.[0];
                  const activePrice = activeVariant ? activeVariant.price : product.price;
                  const comparePrice = activeVariant ? activeVariant.compareAtPrice : product.compareAtPrice;

                  if (viewMode === "list") {
                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        className="bg-[#14090C] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 hover:border-white/25 transition-all"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <img
                            src={product.thumbnail || product.images?.[0] || "/masala_munch-removebg-preview.png"}
                            alt={product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white/5 rounded-xl p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-xs sm:text-sm text-white font-montserrat truncate">{product.name}</h3>
                            <p className="text-[11px] text-white/50 line-clamp-1">{product.shortDescription}</p>
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
                              <span className="font-bold text-[#FFC02D]">₹{activePrice}</span>
                              {comparePrice > activePrice && <span className="line-through text-white/40">₹{comparePrice}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1 font-mono"
                          >
                            <FaEye size={12} /> View
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 rounded-xl bg-[#C44100] hover:bg-[#F05A00] text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1 font-mono"
                          >
                            <FaShoppingBag size={12} /> Add
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <React.Fragment key={product._id}>
                      <ProductCard product={product} onQuickView={setQuickViewProduct} />

                      {/* Apple-Style Section Breaks between catalog grids */}
                      {index === 3 && <CrunchCollectionBanner />}
                      {index === 7 && <SpiceModeBanner />}
                      {index === 11 && <TraditionalFavoritesBanner />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter & Sort Drawer (lg:hidden) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-[#14090C] border-t border-white/15 rounded-t-3xl p-6 z-50 lg:hidden text-white space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-montserrat text-[#FFC02D]">Filter & Sort Catalog</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-white/60 hover:text-white">
                  <FaTimes size={16} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2 font-mono">Sort By</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {[
                    { key: "recommended", label: "Recommended" },
                    { key: "price_asc", label: "Price: Low to High" },
                    { key: "price_desc", label: "Price: High to Low" },
                    { key: "rating", label: "Highest Rated" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSortOption(s.key)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        sortOption === s.key ? "border-[#F05A00] bg-[#F05A00]/20 text-[#FFC02D]" : "border-white/10 bg-white/5 text-white/70"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-2 font-mono">Spice Tolerance</label>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {["", "Mild", "Medium", "Spicy"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSpiceFilter(lvl)}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                        spiceFilter === lvl ? "bg-[#F05A00] text-white" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {lvl || "All Spices"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2 font-mono">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#C44100] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
};

export default Shop;
