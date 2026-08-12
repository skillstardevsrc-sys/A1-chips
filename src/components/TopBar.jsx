import React from "react";
import { FaTruck, FaLeaf, FaStar, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

const items = [
  { icon: <FaTruck className="text-yellow-300" />, text: "FREE SHIPPING ABOVE ₹499" },
  { icon: <FaLeaf className="text-green-300" />, text: "100% COCONUT OIL" },
  { icon: <FaStar className="text-yellow-400" />, text: "4.6/5 FROM 1,16,923+ CUSTOMERS" },
  { icon: <FaMoneyBillWave className="text-emerald-300" />, text: "COD AVAILABLE" },
];

const TopBar = () => {
  return (
    <div
      className="w-full bg-[#1a1a1a] border-b border-white/10 py-1 px-4 overflow-hidden relative z-50"
      style={{ isolation: "isolate", transform: "translateZ(0)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-0 sm:gap-4 flex-wrap sm:flex-nowrap">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-1.5 px-3 py-0.5"
            >
              <span className="text-xs">{item.icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/90 whitespace-nowrap">
                {item.text}
              </span>
            </motion.div>
            {i < items.length - 1 && (
              <div className="hidden sm:block h-4 w-px bg-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
