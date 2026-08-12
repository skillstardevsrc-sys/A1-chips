import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const reviews = [
  {
    quote: "Perfect crunch. Reminds me of fresh banana chips straight from Tamil Nadu.",
    author: "Anand R.",
    location: "Singapore",
    rating: 5,
    tag: "VERIFIED BUYER",
  },
  {
    quote: "The Aloo Tandoori flavor is absolutely addictive! Ordering the 8-box next.",
    author: "Meera K.",
    location: "Dubai, UAE",
    rating: 5,
    tag: "VERIFIED BUYER",
  },
  {
    quote: "Packed so fresh and fast shipping to USA. Unmatched coconut oil taste.",
    author: "Siddharth V.",
    location: "California, USA",
    rating: 5,
    tag: "VERIFIED BUYER",
  },
];

const CustomerLove = () => {
  const navigate = useNavigate();

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 bg-[#0B0608] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <Reveal variant="fade-up">
          <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase mb-3 block font-mono">
            11 / REVIEWS
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            100,000+ CRUNCH LOVERS.
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-lg mb-6">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-white font-extrabold text-base ml-2 font-mono">4.8 / 5 Rating</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop")}
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white hover:text-black border border-white/20 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-xl inline-flex items-center gap-2 font-mono"
          >
            <FaShoppingBag size={12} />
            <span>JOIN 100K+ CRUNCH LOVERS — SHOP NOW</span>
          </motion.button>
        </Reveal>
      </div>

      <StaggerContainer amount={0.15} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <StaggerItem key={idx} variant="fade-up">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between shadow-2xl relative h-full"
            >
              <FaQuoteLeft className="text-white/10 text-4xl mb-4" />
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-6 italic">
                "{rev.quote}"
              </p>

              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-2 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <h4 className="font-extrabold text-sm tracking-wider font-montserrat">{rev.author}</h4>
                <span className="text-xs text-white/50">{rev.location}</span>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionReveal>
  );
};

export default CustomerLove;
