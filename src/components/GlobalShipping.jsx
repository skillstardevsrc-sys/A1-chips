import React from "react";
import { motion } from "framer-motion";
import { FaPlaneDeparture } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const destinations = ["INDIA", "SINGAPORE", "UAE", "MALAYSIA", "USA", "UK"];

const GlobalShipping = () => {
  const navigate = useNavigate();

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 bg-[#040508] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-12">
        <Reveal variant="fade-up">
          <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-3 block font-mono">
            10 / INTERNATIONAL SHIPPING
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FROM COIMBATORE.
            <br />
            <span className="text-cyan-400">TO THE WORLD.</span>
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto">
            Bringing fresh, authentic South Indian crunch directly to your doorstep globally.
          </p>
        </Reveal>
      </div>

      {/* Hero Global Map Visual Banner */}
      <Reveal variant="scale" amount={0.2} className="max-w-7xl mx-auto h-[460px] md:h-[520px] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
        <img
          src="/global_shipping.jpg"
          alt="A1 Global Shipping"
          className="w-full h-full object-cover filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

        {/* Floating Country Badges */}
        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          <StaggerContainer amount={0.2} className="flex flex-wrap gap-3">
            {destinations.map((dest, i) => (
              <StaggerItem key={i} variant="scale">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-extrabold tracking-widest text-cyan-300 uppercase shadow-md font-mono inline-block">
                  {dest}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shipping")}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-black text-xs tracking-widest bg-cyan-400 text-black shadow-2xl transition-transform uppercase cursor-pointer font-mono"
          >
            <FaPlaneDeparture />
            <span>SHOP WORLDWIDE</span>
          </motion.button>
        </div>
      </Reveal>
    </SectionReveal>
  );
};

export default GlobalShipping;
