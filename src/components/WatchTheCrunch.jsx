import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const crunchCards = [
  {
    id: "oil-sizzle",
    title: "OIL SIZZLE",
    sub: "100% Pure Coconut Oil Fry",
    image: "/ingredient_story.jpg",
    video: "/demo/oil.mp4",
    productSlug: "classic-kerala-banana-chips",
    productName: "Classic Kerala Banana Chips",
    badge: "STAGE 01 • SIEMENS TEMP CONTROL",
  },
  {
    id: "seasoning",
    title: "THE SEASONING",
    sub: "Fiery Tandoori & Chilli Dust",
    image: "/masala_munch-removebg-preview.png",
    isProduct: true,
    video: "/demo/toping.mp4",
    productSlug: "masala-munch-potato-chips",
    productName: "Masala Munch Potato Chips",
    badge: "STAGE 02 • SECRET SPICE TUMBLER",
  },
  {
    id: "crunch",
    title: "THE CRUNCH",
    sub: "Every Bite Crispy Perfection",
    image: "/banana_chips.jpg",
    video: "/demo/cruch.mp4",
    productSlug: "aloo-tandoori-chips",
    productName: "Aloo Tandoori Chips",
    badge: "STAGE 03 • PEAK CRISPINESS",
  },
];

const WatchTheCrunch = () => {
  const [activeCard, setActiveCard] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    setActiveCard(card);
  };

  const handleVideoEnd = () => {
    if (activeCard) {
      const targetSlug = activeCard.productSlug;
      setActiveCard(null);
      navigate(`/product/${targetSlug}`);
    }
  };

  const handleSkipToProduct = () => {
    if (activeCard) {
      const targetSlug = activeCard.productSlug;
      setActiveCard(null);
      navigate(`/product/${targetSlug}`);
    }
  };

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 bg-[#0B0405] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <Reveal variant="fade-up">
          <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase mb-3 block font-mono">
            06 / VISUAL EXPERIENCE
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-3"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            WATCH THE CRUNCH.
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-xl mx-auto">
            Click any visual experience card below to watch the full-screen video. When finished, you will be taken directly to the product page.
          </p>
        </Reveal>
      </div>

      {/* Grid of Video/Visual Moment Cards */}
      <StaggerContainer amount={0.15} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {crunchCards.map((card) => (
          <StaggerItem key={card.id} variant="fade-up">
            <motion.div
              onClick={() => handleCardClick(card)}
              whileHover={{ scale: 1.02, translateY: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative h-[420px] rounded-3xl overflow-hidden border border-white/15 bg-[#16080A] flex flex-col justify-between p-8 cursor-pointer shadow-2xl transition-all duration-500 hover:border-[#F05A00]/60 hover:shadow-[#F05A00]/20"
            >
              {card.isProduct ? (
                <div className="w-full h-full absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-b from-[#280B0F] to-[#0B0405]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-[280px] object-contain group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  />
                </div>
              ) : (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-85"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0" />

              {/* Stage Badge & Play Icon Badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC02D] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono">
                  {card.badge}
                </span>

                <div className="w-12 h-12 rounded-full bg-[#F05A00] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <FaPlay size={14} className="ml-1" />
                </div>
              </div>

              {/* Title & Click hint */}
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-bold tracking-widest text-yellow-400 block uppercase font-mono">
                  {card.sub}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white font-montserrat"
                >
                  {card.title}
                </h3>
                <p className="text-[11px] font-bold text-white/60 flex items-center gap-1 pt-1 group-hover:text-amber-300 transition-colors">
                  <span>Click to Watch Fullscreen Video</span> <FaArrowRight size={10} />
                </p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Pure Video-Only Full-Screen Overlay Modal */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkipToProduct}
            className="fixed inset-0 z-50 bg-black w-screen h-screen overflow-hidden flex items-center justify-center cursor-pointer"
          >
            {/* Pure Fullscreen Muted Video */}
            <video
              ref={videoRef}
              src={activeCard.video}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Minimal floating skip indicator in top right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkipToProduct();
              }}
              className="absolute top-6 right-6 z-20 px-5 py-2.5 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md transition-all shadow-2xl font-mono"
            >
              <span>Skip Video</span>
              <FaArrowRight size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
};

export default WatchTheCrunch;
