import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaStar, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { SectionReveal, Reveal } from "./common/ScrollReveal";

const bestsellers = [
  {
    id: "aloo",
    productId: "65cb1a01b123456789abcdef",
    name: "ALOO TANDOORI CHIPS",
    subtitle: "FIERY TANDOORI SPICE CRUNCH",
    price: "₹199",
    rawPrice: 199,
    rating: "4.8",
    reviews: "14,230",
    image: "/aloo_tandoori-removebg-preview.png",
    accent: "#FF3B30",
    bg: "#180405",
  },
  {
    id: "masala",
    productId: "65cb1a02b123456789abcdef",
    name: "MASALA MUNCH CHIPS",
    subtitle: "AUTHENTIC SOUTH INDIAN SPICE BITE",
    price: "₹189",
    rawPrice: 189,
    rating: "4.9",
    reviews: "28,510",
    image: "/masala_munch-removebg-preview.png",
    accent: "#FF9500",
    bg: "#180B04",
  },
  {
    id: "cream",
    productId: "65cb1a03b123456789abcdef",
    name: "CREAM & ONION CHIPS",
    subtitle: "CREAMY HERB DELIGHT CRISPS",
    price: "₹189",
    rawPrice: 189,
    rating: "4.7",
    reviews: "19,840",
    image: "/cream_onion-removebg-preview.png",
    accent: "#34C759",
    bg: "#04180A",
  },
];

const BestsellerShowcase = () => {
  const [index, setIndex] = useState(0);
  const current = bestsellers[index];
  const { addToCart, openCart } = useCartStore();
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % bestsellers.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + bestsellers.length) % bestsellers.length);
  };

  const handleAddToCart = async () => {
    await addToCart(current.productId, null, "200g", 1);
    setAddedSuccess(true);
    openCart();
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 text-white relative transition-colors duration-700 overflow-hidden select-none font-poppins"
      style={{ backgroundColor: current.bg }}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: current.accent }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Reveal variant="fade-up" className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase mb-3 flex items-center justify-center gap-2 font-mono">
            03 / BESTSELLERS SHOWCASE
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            THE CROWN JEWELS.
          </h2>
        </Reveal>

        {/* Hero Product Carousel Card */}
        <Reveal variant="scale" amount={0.2} className="w-full max-w-5xl">
          <div className="w-full relative flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl">
            {/* Left Product Visual Graphics */}
            <div className="flex-1 flex items-center justify-center relative min-h-[380px] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <img
                    src={current.image}
                    alt={current.name}
                    className="h-[340px] md:h-[400px] object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] float-anim"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Product Details */}
            <div className="flex-1 z-10 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-xs font-bold tracking-widest text-white/60 uppercase block mb-2 font-mono">
                    {current.subtitle}
                  </span>
                  <h3
                    className="text-3xl md:text-5xl font-black mb-4 tracking-tight"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {current.name}
                  </h3>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center text-yellow-400 gap-1 text-sm font-mono">
                      <FaStar />
                      <span className="font-extrabold text-white ml-1">{current.rating}</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/70 font-medium">
                      {current.reviews} Verified Reviews
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center gap-6 mb-8">
                    <span className="text-4xl font-black text-white font-mono">{current.price}</span>
                    <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
                      IN STOCK • 200G
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-black text-sm tracking-widest text-black shadow-2xl transition-all cursor-pointer font-mono"
                    style={{ backgroundColor: current.accent }}
                  >
                    {addedSuccess ? <FaCheckCircle size={16} /> : <FaShoppingCart size={16} />}
                    <span>{addedSuccess ? "ADDED TO BAG!" : "ADD TO CART"}</span>
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all cursor-pointer shadow-lg"
                title="Previous Bestseller"
              >
                <FaChevronLeft size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all cursor-pointer shadow-lg"
                title="Next Bestseller"
              >
                <FaChevronRight size={14} />
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionReveal>
  );
};

export default BestsellerShowcase;
