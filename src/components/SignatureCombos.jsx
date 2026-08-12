import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const combos = [
  {
    id: "movie-night-combo",
    title: "MOVIE NIGHT COMBO",
    subtitle: "PERFECT POP & CRUNCH PAIRING",
    image: "/masala_munch-removebg-preview.png",
    isProduct: true,
    price: "₹349",
    rawPrice: 349,
    bg: "from-[#2A080C] to-[#0E0405]",
  },
  {
    id: "family-crunch-pack",
    title: "FAMILY CRUNCH PACK",
    subtitle: "AUTHENTIC COIMBATORE FAVOURITES",
    image: "/banana_chips.jpg",
    price: "₹599",
    rawPrice: 599,
    bg: "from-[#2A1C08] to-[#0E0B04]",
  },
  {
    id: "festival-gift-box",
    title: "FESTIVAL GIFT BOX",
    subtitle: "PREMIUM HERITAGE ASSORTMENT",
    image: "/snack_box.jpg",
    price: "₹799",
    rawPrice: 799,
    bg: "from-[#102A08] to-[#040E04]",
  },
];

const SignatureCombos = () => {
  const navigate = useNavigate();
  const { openCart } = useCartStore();

  const handleShopCombo = (combo) => {
    navigate("/shop");
  };

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 bg-[#080405] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <Reveal variant="fade-up">
          <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase mb-3 block font-mono">
            09 / SIGNATURE COMBOS
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            CURATED COMBOS.
          </h2>
        </Reveal>
      </div>

      <StaggerContainer amount={0.15} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {combos.map((combo, idx) => (
          <StaggerItem key={idx} variant="fade-up">
            <motion.div
              onClick={() => handleShopCombo(combo)}
              whileHover={{ scale: 1.02, translateY: -4 }}
              className={`group relative h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b ${combo.bg} flex flex-col justify-end p-8 cursor-pointer shadow-2xl transition-all duration-300 hover:border-yellow-500/50`}
            >
              <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
                {combo.isProduct ? (
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="h-[300px] object-contain group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
                  />
                ) : (
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-85"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              <div className="relative z-10">
                <span className="text-xs font-bold tracking-widest text-yellow-400 block mb-1 uppercase font-mono">
                  {combo.subtitle}
                </span>
                <h3
                  className="text-2xl font-black mb-4 tracking-tight"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {combo.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">{combo.price}</span>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-xs font-extrabold tracking-wider uppercase group-hover:bg-white group-hover:text-black transition-all font-mono">
                    <span>SHOP COMBO</span>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionReveal>
  );
};

export default SignatureCombos;
