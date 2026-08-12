import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaShoppingBag, FaBolt, FaHeart, FaTruck, FaShieldAlt, FaLeaf, FaTimes, FaFire, FaCertificate, FaUtensils, FaBox } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileStickyAddToCart from "../components/MobileStickyAddToCart";
import { api } from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { mockProducts } from "../data/mockProducts";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "../components/common/ScrollReveal";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active selection
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Write Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");

  const { addToCart, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    let prod = null;
    let related = [];
    try {
      const res = await api.get(`/products/${slug}`);
      prod = res.data?.product;
      related = res.data?.relatedProducts || [];
    } catch (e) {
      console.warn("API product detail fetch failed, using fallback mock dataset", e);
    }

    if (!prod) {
      prod = mockProducts.find((p) => p.slug === slug || p._id === slug);
      if (prod) {
        related = mockProducts
          .filter((p) => (p.categorySlug === prod.categorySlug || p.category?.slug === prod.category?.slug) && p.slug !== prod.slug)
          .slice(0, 4);
      }
    }

    if (prod) {
      setProduct(prod);
      setRelatedProducts(related);

      const img = prod.images?.[0] || prod.thumbnail || "/masala_munch-removebg-preview.png";
      setSelectedImage(img);

      const defaultWeight = prod.variants?.[0]?.weight || prod.weight || "200g";
      setSelectedWeight(defaultWeight);

      if (prod._id) {
        try {
          const revRes = await api.get(`/reviews/product/${prod._id}`);
          setReviews(revRes.data?.reviews || []);
        } catch (e) {
          // ignore review error in fallback
        }
      }
    } else {
      setProduct(null);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#F05A00] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="text-2xl font-bold mb-2 font-montserrat">Product Not Found</h2>
          <p className="text-white/60 mb-6 text-xs">The requested chip flavor is unavailable or has been moved.</p>
          <Link to="/products" className="bg-[#C44100] text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-[#F05A00] uppercase tracking-wider">
            Explore All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeVariant = product.variants?.find((v) => v.weight === selectedWeight) || product.variants?.[0];
  const activePrice = activeVariant ? activeVariant.price : product.price;
  const comparePrice = activeVariant ? activeVariant.compareAtPrice : product.compareAtPrice;
  const activeStock = activeVariant ? activeVariant.stock : product.stock;
  const discountPercent = comparePrice > activePrice ? Math.round(((comparePrice - activePrice) / comparePrice) * 100) : 0;
  const isSaved = isInWishlist(product._id);

  const handleAddToCart = async () => {
    await addToCart(product._id, activeVariant?._id, selectedWeight, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product._id, activeVariant?._id, selectedWeight, quantity);
    openCart();
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins pb-24 lg:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Breadcrumb */}
        <Reveal variant="fade-down" amount={0.1} className="text-xs text-white/50 mb-6 flex items-center gap-2 font-mono">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white">Products</Link>
          <span>/</span>
          <span className="text-[#FFC02D] font-medium truncate max-w-xs">{product.name}</span>
        </Reveal>

        {/* Primary Hero Showcase Area */}
        <SectionReveal variant="fade-up" amount={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-white/10 to-transparent p-6 border border-white/15 flex items-center justify-center overflow-hidden shadow-2xl group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                  isSaved ? "bg-rose-500 text-white" : "bg-black/50 text-white/80 hover:bg-black/80"
                }`}
              >
                <FaHeart size={16} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white/5 overflow-hidden transition-all ${
                      selectedImage === img ? "border-[#F05A00] scale-105" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full bg-[#C44100]/25 text-[#FFC02D] border border-[#C44100]/50 mb-3 tracking-wider font-mono">
                {product.badge || product.spiceLevel || "PREMIUM SNACK"}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black font-montserrat tracking-tight leading-tight text-white mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < Math.floor(product.rating || 5) ? "text-amber-400" : "text-white/20"} />
                  ))}
                </div>
                <span className="font-extrabold text-sm text-white font-mono">{product.rating || 4.8}</span>
                <span className="text-xs text-white/50 font-medium">({product.reviewCount || reviews.length} verified reviews)</span>
              </div>

              <p className="text-white/80 text-sm leading-relaxed font-normal">{product.shortDescription || product.description}</p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#FFC02D] font-mono">₹{activePrice}</span>
                  {comparePrice > activePrice && (
                    <span className="text-base text-white/40 line-through font-mono">₹{comparePrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 mt-1">Inclusive of all taxes & free shipping over ₹499</p>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  activeStock > 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {activeStock > 0 ? `In Stock` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Pack Weight Selector Pills */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 font-mono">
                  Select Pack Weight:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedWeight(v.weight)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        selectedWeight === v.weight
                          ? "bg-white text-black border-white shadow-lg scale-105"
                          : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {v.weight} — ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/10 rounded-2xl p-1 border border-white/15">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/80 font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/80 font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#C44100] hover:bg-[#F05A00] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer font-mono"
                >
                  <FaShoppingBag size={14} /> Add To Bag
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F05A00] to-[#FFC02D] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl hover:brightness-110 transition-all cursor-pointer font-mono"
              >
                <FaBolt size={14} /> Buy Now — Instant Checkout
              </motion.button>
            </div>
          </div>
        </SectionReveal>

        {/* --- VISUAL PRODUCT STORY: WHAT MAKES IT SPECIAL --- */}
        <SectionReveal variant="fade-up" amount={0.15} className="my-16">
          <h2 className="text-2xl font-black font-montserrat text-center text-white mb-8">
            What Makes It Special
          </h2>
          <StaggerContainer amount={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem variant="scale">
              <div className="p-6 rounded-3xl bg-[#14090C] border border-white/10 text-center space-y-3 shadow-xl hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#F05A00]/20 text-[#FFC02D] flex items-center justify-center mx-auto">
                  <FaLeaf size={22} />
                </div>
                <h3 className="font-bold text-sm text-white font-montserrat">100% Coconut Oil</h3>
                <p className="text-xs text-white/60">Fried in pure cold-pressed coconut oil for authentic aroma and healthy crunch.</p>
              </div>
            </StaggerItem>

            <StaggerItem variant="scale">
              <div className="p-6 rounded-3xl bg-[#14090C] border border-white/10 text-center space-y-3 shadow-xl hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#F05A00]/20 text-[#FFC02D] flex items-center justify-center mx-auto">
                  <FaCertificate size={22} />
                </div>
                <h3 className="font-bold text-sm text-white font-montserrat">Premium Ingredients</h3>
                <p className="text-xs text-white/60">Handpicked farm produce blended with secret Coimbatore spice formulas.</p>
              </div>
            </StaggerItem>

            <StaggerItem variant="scale">
              <div className="p-6 rounded-3xl bg-[#14090C] border border-white/10 text-center space-y-3 shadow-xl hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#F05A00]/20 text-[#FFC02D] flex items-center justify-center mx-auto">
                  <FaShieldAlt size={22} />
                </div>
                <h3 className="font-bold text-sm text-white font-montserrat">Sealed Freshness</h3>
                <p className="text-xs text-white/60">Packed in nitrogen-flushed multi-layer pouches to preserve peak crispiness.</p>
              </div>
            </StaggerItem>

            <StaggerItem variant="scale">
              <div className="p-6 rounded-3xl bg-[#14090C] border border-white/10 text-center space-y-3 shadow-xl hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#F05A00]/20 text-[#FFC02D] flex items-center justify-center mx-auto">
                  <FaUtensils size={22} />
                </div>
                <h3 className="font-bold text-sm text-white font-montserrat">Authentic Taste</h3>
                <p className="text-xs text-white/60">Over 40 years of traditional South Indian culinary expertise in every bite.</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </SectionReveal>

        {/* --- HOW IT'S MADE 4-STEP TIMELINE --- */}
        <SectionReveal variant="fade-up" amount={0.15} className="my-16 bg-[#14090C] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black font-montserrat text-center text-white mb-2">
            How It's Crafted
          </h2>
          <p className="text-center text-xs text-white/60 mb-10 font-mono">4-Step Traditional Preparation Process</p>

          <StaggerContainer amount={0.2} className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <StaggerItem variant="fade-up" className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="font-mono text-2xl font-black text-[#FFC02D]">01</span>
              <h4 className="font-bold text-xs text-white">Selected Produce</h4>
              <p className="text-[11px] text-white/60">Raw farm-fresh Nendran bananas or potatoes inspected for size & crispness.</p>
            </StaggerItem>
            <StaggerItem variant="fade-up" className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="font-mono text-2xl font-black text-[#FFC02D]">02</span>
              <h4 className="font-bold text-xs text-white">Wafer Slicing</h4>
              <p className="text-[11px] text-white/60">Sliced wafer-thin under precision blades for maximum crunch surface.</p>
            </StaggerItem>
            <StaggerItem variant="fade-up" className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="font-mono text-2xl font-black text-[#FFC02D]">03</span>
              <h4 className="font-bold text-xs text-white">Careful Frying</h4>
              <p className="text-[11px] text-white/60">Deep fried at calibrated temperatures in pure coconut oil.</p>
            </StaggerItem>
            <StaggerItem variant="fade-up" className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="font-mono text-2xl font-black text-[#FFC02D]">04</span>
              <h4 className="font-bold text-xs text-white">Spicing & Packing</h4>
              <p className="text-[11px] text-white/60">Tossed in aromatic spices and sealed warm to lock in fresh flavor.</p>
            </StaggerItem>
          </StaggerContainer>
        </SectionReveal>

        {/* --- INGREDIENTS & NUTRITION TABS --- */}
        <SectionReveal variant="fade-up" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#FFC02D] mb-4 font-montserrat">
                Ingredients & Allergens
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.ingredients?.map((ing, i) => (
                  <span key={i} className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs text-white">
                    {ing}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl font-mono">
                <strong>Allergen Info:</strong> {product.allergens?.join(", ") || "None"}
              </p>
            </div>

            {/* Nutrition Panel */}
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#FFC02D] mb-4 font-montserrat">
                Nutritional Values (per 100g)
              </h3>
              <div className="divide-y divide-white/10 text-xs font-mono">
                <div className="py-2 flex justify-between"><span>Energy</span><span className="text-[#FFC02D]">{product.nutrition?.energy || "520 kcal"}</span></div>
                <div className="py-2 flex justify-between"><span>Protein</span><span>{product.nutrition?.protein || "6.5g"}</span></div>
                <div className="py-2 flex justify-between"><span>Carbohydrates</span><span>{product.nutrition?.carbohydrates || "54g"}</span></div>
                <div className="py-2 flex justify-between"><span>Total Fat</span><span>{product.nutrition?.fat || "31g"}</span></div>
                <div className="py-2 flex justify-between"><span>Sodium</span><span>{product.nutrition?.sodium || "480mg"}</span></div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <SectionReveal variant="fade-up" amount={0.15}>
            <h3 className="text-2xl font-black font-montserrat tracking-tight text-white mb-6">
              You Might Also Love
            </h3>
            <StaggerContainer amount={0.2} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <StaggerItem key={rel._id} variant="scale">
                  <Link
                    to={`/product/${rel.slug}`}
                    className="p-4 rounded-2xl bg-[#14090C] border border-white/10 hover:border-white/30 transition-all text-center group block h-full shadow-lg"
                  >
                    <img
                      src={rel.thumbnail || "/masala_munch-removebg-preview.png"}
                      alt={rel.name}
                      className="w-24 h-24 object-contain mx-auto mb-2 group-hover:scale-105 transition-transform"
                    />
                    <h4 className="font-bold text-xs text-white truncate group-hover:text-[#FFC02D] transition-colors">{rel.name}</h4>
                    <p className="font-mono text-xs font-bold text-[#FFC02D] mt-1">₹{rel.price}</p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </SectionReveal>
        )}
      </main>

      {/* Sticky Mobile/Tablet Add to Cart Bar */}
      <MobileStickyAddToCart
        product={product}
        selectedWeight={selectedWeight}
        quantity={quantity}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
