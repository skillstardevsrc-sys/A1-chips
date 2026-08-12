import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaBuilding, FaShieldAlt, FaGlobe, FaCreditCard } from "react-icons/fa";

const features = [
  {
    icon: <FaLeaf size={22} />,
    title: "100% COCONUT OIL",
    subtitle: "Authentic Taste",
    color: "#F39C12",
    bg: "rgba(243,156,18,0.12)",
  },
  {
    icon: <FaBuilding size={22} />,
    title: "MADE IN COIMBATORE",
    subtitle: "Our Own Facility",
    color: "#2ECC71",
    bg: "rgba(46,204,113,0.12)",
  },
  {
    icon: <FaShieldAlt size={22} />,
    title: "FSSAI LICENSED",
    subtitle: "Safe & Trusted",
    color: "#3498DB",
    bg: "rgba(52,152,219,0.12)",
  },
  {
    icon: <FaGlobe size={22} />,
    title: "SHIPS ACROSS INDIA & ABROAD",
    subtitle: "Delivering Happiness",
    color: "#9B59B6",
    bg: "rgba(155,89,182,0.12)",
  },
  {
    icon: <FaCreditCard size={22} />,
    title: "COD AVAILABLE",
    subtitle: "Easy & Secure",
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.12)",
  },
];

const FeatureBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full bg-black/30 backdrop-blur-md border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.5, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-[150px] justify-center"
          >
            {/* Icon circle */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ color: f.color, background: f.bg, border: `1px solid ${f.color}30` }}
            >
              {f.icon}
            </div>
            {/* Text */}
            <div>
              <div className="text-white font-bold text-[10px] sm:text-xs tracking-wider leading-tight">
                {f.title}
              </div>
              <div className="text-white/50 text-[9px] sm:text-[10px] font-medium mt-0.5">
                {f.subtitle}
              </div>
            </div>
            {/* Divider */}
            {i < features.length - 1 && (
              <div className="hidden lg:block h-8 w-px bg-white/10 ml-3" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeatureBar;
