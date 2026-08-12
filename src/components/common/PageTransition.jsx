import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./ScrollReveal";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: shouldReduceMotion
      ? { opacity: 1, transition: { duration: 0.15 } }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        },
    exit: shouldReduceMotion
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          opacity: 0,
          y: -8,
          filter: "blur(4px)",
          transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
        },
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0405] text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full min-h-screen flex flex-col bg-[#0A0405] text-white"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
