import React from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaArrowRight, FaShieldAlt, FaTruck, FaLock, FaCheckCircle, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const finalTrustBadges = [
  { icon: <FaTruck />, label: "FREE SHIPPING ₹499+" },
  { icon: <FaLock />, label: "SECURE CHECKOUT" },
  { icon: <FaShieldAlt />, label: "FSSAI QUALITY CERTIFIED" },
  { icon: <FaCheckCircle />, label: "100% COCONUT OIL" },
  { icon: <FaBox />, label: "FRESHNESS SEALED PACKAGING" },
];

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-32 px-6 md:px-16 bg-gradient-to-b from-[#180407] via-[#2A080E] to-[#0E0204] text-white relative overflow-hidden text-center"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] bg-red-600/25 pointer-events-none" />

      {/* Hero Visual Content */}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <Reveal variant="fade-up" delay={0.1}>
          <span className="text-xs font-bold tracking-[0.4em] text-yellow-400 uppercase mb-4 block font-mono">
            AUTHENTIC SOUTH INDIAN SAVOURIES
          </span>
          <h2
            className="text-5xl md:text-7xl font-black tracking-tight mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            READY FOR THE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              CRUNCH?
            </span>
          </h2>
        </Reveal>

        <Reveal variant="scale" delay={0.2} className="flex flex-wrap items-center justify-center gap-5 mb-16">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-3 px-10 py-4.5 rounded-full font-black text-sm tracking-widest bg-white text-black shadow-2xl transition-all cursor-pointer font-mono"
          >
            <FaShoppingBag />
            <span>SHOP A1 CHIPS</span>
            <FaArrowRight />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-3 px-10 py-4.5 rounded-full font-bold text-sm tracking-widest bg-white/10 backdrop-blur-md border border-white/30 text-white shadow-xl hover:bg-white/20 transition-all cursor-pointer font-mono"
          >
            <span>EXPLORE ALL PRODUCTS</span>
          </motion.button>
        </Reveal>

        {/* Section 15 — Final Trust Strip */}
        <StaggerContainer amount={0.2} className="w-full pt-16 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-white/80">
          {finalTrustBadges.map((badge, idx) => (
            <StaggerItem key={idx} variant="scale">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase font-mono">
                <span className="text-yellow-400 text-sm">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionReveal>
  );
};

export default FinalCTA;
