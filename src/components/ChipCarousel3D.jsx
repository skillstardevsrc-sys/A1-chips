import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chips } from "../data/chips";
import { heroThemes } from "../data/heroThemes";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Fixed position states — depth via translateZ + opacity
const getPosition = (offset) => {
  if (offset === 0) {
    return {
      x: 0,
      z: 0,
      rotateY: 0,
      opacity: 1,
      brightness: 1.08,
      zIndex: 3,
    };
  }
  if (offset === 1 || offset === -(chips.length - 1)) {
    return {
      x: 190,
      z: -130,
      rotateY: -18,
      opacity: 0.45,
      brightness: 0.5,
      zIndex: 1,
    };
  }
  return {
    x: -190,
    z: -130,
    rotateY: 18,
    opacity: 0.45,
    brightness: 0.5,
    zIndex: 1,
  };
};

const ChipCarousel3D = ({ activeIndex, setActiveIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const activeChip = chips[activeIndex];
  const themeKey = activeChip.id || "masala";
  const theme = heroThemes[themeKey] || heroThemes.masala;

  // Auto-rotate every 3.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % chips.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, setActiveIndex]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % chips.length);
  }, [setActiveIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + chips.length) % chips.length);
  }, [setActiveIndex]);

  return (
    <div
      className="flex flex-col items-center justify-center relative scale-[0.62] sm:scale-85 md:scale-90 lg:scale-100 origin-center max-w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Atmospheric Aura Glow behind active product */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${themeKey}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.8 }}
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-0"
          style={{
            background: activeChip.glowColor,
            top: "10%",
          }}
        />
      </AnimatePresence>

      {/* 3D Scene Container */}
      <div
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
          position: "relative",
          width: "820px",
          height: "560px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {chips.map((chip, index) => {
          let offset = index - activeIndex;
          if (offset > Math.floor(chips.length / 2)) offset -= chips.length;
          if (offset < -Math.floor(chips.length / 2)) offset += chips.length;

          const pos = getPosition(offset);
          const isFront = offset === 0;

          return (
            <motion.div
              key={chip.id}
              onClick={() => setActiveIndex(index)}
              animate={{
                x: pos.x,
                z: pos.z,
                rotateY: pos.rotateY,
                opacity: pos.opacity,
                filter: `brightness(${pos.brightness})`,
              }}
              transition={{
                duration: 1.0,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                width: 360,
                height: 520,
                position: "absolute",
                transformStyle: "preserve-3d",
                zIndex: pos.zIndex,
                cursor: offset !== 0 ? "pointer" : "default",
              }}
            >
              {/* Product Container */}
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={chip.image}
                  alt={chip.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                    filter: isFront
                      ? `drop-shadow(0 30px 40px rgba(0,0,0,0.85)) drop-shadow(${theme.rimLight})`
                      : "drop-shadow(0 15px 20px rgba(0,0,0,0.6))",
                    animation: isFront ? "floatUp 4s ease-in-out infinite" : "none",
                  }}
                  draggable={false}
                />

                {/* Studio Platform Contact Shadow & Floor Glow under front bucket */}
                {isFront && (
                  <div className="absolute -bottom-4 w-[280px] h-12 pointer-events-none flex items-center justify-center">
                    <div
                      className="w-full h-4 rounded-full blur-md opacity-80 transition-all duration-700"
                      style={{
                        backgroundColor: theme.platformGlow,
                        boxShadow: `0 10px 30px ${theme.platformGlow}`,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-2 z-20">
        {/* Prev */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:border-white transition-all shadow-xl cursor-pointer"
          title="Previous Slide"
        >
          <FaChevronLeft size={13} />
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-xl">
          {chips.map((c, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              animate={{
                width: i === activeIndex ? 32 : 10,
                backgroundColor:
                  i === activeIndex ? theme.badgeColor : "rgba(255,255,255,0.4)",
                boxShadow: i === activeIndex ? `0 0 12px ${theme.badgeColor}` : "none",
              }}
              transition={{ duration: 0.4 }}
              className="h-2.5 rounded-full cursor-pointer outline-none border-0"
              title={`Go to ${c.name}`}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:border-white transition-all shadow-xl cursor-pointer"
          title="Next Slide"
        >
          <FaChevronRight size={13} />
        </motion.button>
      </div>
    </div>
  );
};

export default ChipCarousel3D;
