import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaUtensils, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { chips } from "../data/chips";
import { heroThemes } from "../data/heroThemes";
import ChipCarousel3D from "./ChipCarousel3D";
import { useCartStore } from "../store/useCartStore";

const reviewers = [
  { initials: "RK", color: "#FF5722" },
  { initials: "PS", color: "#00E676" },
  { initials: "AM", color: "#FFC107" },
  { initials: "VT", color: "#E040FB" },
];

const HeroSection = ({ activeIndex, setActiveIndex }) => {
  const chip = chips[activeIndex];
  const themeKey = chip.id || "masala";
  const theme = heroThemes[themeKey] || heroThemes.masala;

  const navigate = useNavigate();
  const { openCart } = useCartStore();

  const handleOrderNow = () => {
    navigate("/shop");
  };

  const handleSeeMenu = () => {
    navigate("/shop");
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 lg:py-0 lg:-mt-10 z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

      {/* LEFT CONTENT — Cinematic Staggered Entrance */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        className="flex-1 z-10 w-full max-w-xl lg:max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start"
      >

        {/* 1. Badge with dynamic theme accent */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${activeIndex}`}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 backdrop-blur-md border rounded-full px-4 py-1.5 mb-4 sm:mb-5 shadow-xl transition-all duration-700"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full pulse-dot transition-all duration-700"
              style={{
                backgroundColor: theme.badgeColor,
                boxShadow: `0 0 12px ${theme.badgeColor}`,
              }}
            />
            <span
              className="text-xs font-extrabold tracking-widest uppercase font-mono transition-colors duration-700"
              style={{ color: theme.badgeColor }}
            >
              {theme.tagline}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* 2. Headline with perfectly aligned two-line layout */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`h1-${activeIndex}`}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-4 sm:mb-5 drop-shadow-lg"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span className="block whitespace-nowrap">{theme.h1Line1}</span>
            <span
              className="transition-all duration-700 bg-clip-text text-transparent block mt-1 whitespace-nowrap"
              style={{
                backgroundImage: theme.h1Gradient,
                filter: `drop-shadow(${theme.h1Glow})`,
              }}
            >
              {theme.h1Line2}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* 3. Description */}
        <motion.p
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-md font-normal drop-shadow"
        >
          They aren't just about incredible flavour, they're crafted
          for your everyday cravings. Made with real cream and
          100% pure coconut oil.
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8 w-full sm:w-auto"
        >
          <motion.button
            onClick={handleOrderNow}
            whileHover={{ scale: 1.06, translateY: -2 }}
            whileTap={{ scale: 0.96 }}
            className="btn-shine flex items-center justify-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-7 sm:px-8 py-3.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition-all duration-300 cursor-pointer uppercase tracking-wider font-mono flex-1 sm:flex-none"
          >
            <FaShoppingBag size={14} className="text-black" />
            ORDER NOW
          </motion.button>
          <motion.button
            onClick={handleSeeMenu}
            whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.25)" }}
            whileTap={{ scale: 0.96 }}
            className="btn-shine flex items-center justify-center gap-2.5 bg-black/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-7 sm:px-8 py-3.5 rounded-full border border-white/30 shadow-lg hover:border-white/50 transition-all duration-300 cursor-pointer uppercase tracking-wider font-mono flex-1 sm:flex-none"
          >
            <FaUtensils size={13} />
            See Menu Items
          </motion.button>
        </motion.div>

        {/* 5. Review Badge Card */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="inline-flex items-center gap-3 sm:gap-4 bg-black/30 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-xl"
        >
          {/* Stacked Avatars */}
          <div className="flex items-center">
            {reviewers.map((r, i) => (
              <div
                key={i}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-black -ml-2.5 first:ml-0 shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: r.color, zIndex: reviewers.length - i }}
              >
                {r.initials}
              </div>
            ))}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white bg-white/30 backdrop-blur-md flex items-center justify-center text-white text-[11px] font-extrabold -ml-2.5 shadow-md font-mono">
              +10k
            </div>
          </div>

          {/* Stars + text */}
          <div className="text-left">
            <div className="flex items-center gap-1 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={11}
                  className="text-yellow-400 drop-shadow-[0_0_4px_rgba(255,215,0,0.6)]"
                />
              ))}
              <span className="text-white font-extrabold text-xs ml-1 font-mono">4.8/5</span>
            </div>
            <p className="text-white/80 text-[10.5px] sm:text-[11px] font-medium tracking-tight">
              100K+ Reviews · Customer Approved
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT — 3D Carousel Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex-1 flex items-center justify-center relative z-10 w-full lg:-mt-6"
      >
        <ChipCarousel3D activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </motion.div>
    </div>
  );
};

export default HeroSection;
