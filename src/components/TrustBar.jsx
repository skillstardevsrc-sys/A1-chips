import React from "react";
import { FaLeaf, FaAward, FaMapMarkerAlt, FaGlobe, FaTruck } from "react-icons/fa";
import { SectionReveal, StaggerContainer, StaggerItem } from "./common/ScrollReveal";

const trustItems = [
  { icon: <FaLeaf />, label: "100% COCONUT OIL" },
  { icon: <FaAward />, label: "FSSAI LICENSED" },
  { icon: <FaMapMarkerAlt />, label: "MADE IN COIMBATORE" },
  { icon: <FaGlobe />, label: "SHIPS WORLDWIDE" },
  { icon: <FaTruck />, label: "FREE SHIPPING ₹499+" },
];

const TrustBar = () => {
  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.2}
      className="w-full bg-black/40 backdrop-blur-xl border-y border-white/10 py-6 px-4 z-20 relative"
    >
      <StaggerContainer
        staggerDelay={0.08}
        amount={0.2}
        className="max-w-7xl mx-auto flex items-center justify-around flex-wrap gap-4 text-white/90"
      >
        {trustItems.map((item, index) => (
          <StaggerItem
            key={index}
            variant="scale"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-inner hover:bg-white/15 transition-colors cursor-default"
          >
            <span className="text-yellow-400 text-lg">{item.icon}</span>
            <span className="text-xs font-bold tracking-widest uppercase font-mono">{item.label}</span>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionReveal>
  );
};

export default TrustBar;
