import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaFire, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Reveal } from "./common/ScrollReveal";

export const CrunchCollectionBanner = () => {
  const navigate = useNavigate();
  return (
    <Reveal variant="scale" amount={0.15} className="col-span-full my-8 w-full">
      <div className="w-full rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#200F05] via-[#421C05] to-[#1F0C03] border border-[#F05A00]/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FFC02D] bg-black/40 px-4 py-1.5 rounded-full border border-[#FFC02D]/30 inline-block font-mono">
            THE CRUNCH COLLECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-montserrat text-white leading-tight">
            Thin. Golden. <span className="text-[#FFC02D]">Impossible to Stop.</span>
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Crafted from hand-selected Kerala Nendran bananas fried in 100% cold-pressed pure coconut oil. Pure authentic crispiness.
          </p>
          <button
            onClick={() => navigate("/products/banana-chips")}
            className="inline-flex items-center gap-2 bg-[#F05A00] hover:bg-[#FF6B10] text-white font-extrabold text-xs px-6 py-3.5 rounded-full uppercase tracking-wider shadow-lg transition-all hover:scale-105 font-mono cursor-pointer"
          >
            Explore Banana Chips <FaArrowRight size={12} />
          </button>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <img
            src="/banana_chips.jpg"
            alt="Banana Chips"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-3xl border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </div>
    </Reveal>
  );
};

export const SpiceModeBanner = () => {
  const navigate = useNavigate();
  return (
    <Reveal variant="scale" amount={0.15} className="col-span-full my-8 w-full">
      <div className="w-full rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#3A0707] via-[#630E0E] to-[#2B0404] border border-rose-500/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-rose-400 bg-black/40 px-4 py-1.5 rounded-full border border-rose-500/30 inline-flex items-center gap-1.5 font-mono">
            <FaFire className="text-rose-500" /> SPICE MODE ACTIVATED
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-montserrat text-white leading-tight">
            Fiery Masala. <span className="text-rose-400">Intense Cravings.</span>
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Unleash the heat with our Aloo Tandoori, Spicy Garlic Tapioca, and Masala Munch Potato Wafers.
          </p>
          <button
            onClick={() => navigate("/products/potato-chips")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-[#C44100] text-white font-extrabold text-xs px-6 py-3.5 rounded-full uppercase tracking-wider shadow-lg transition-all hover:scale-105 font-mono cursor-pointer"
          >
            Explore Spicy Range <FaArrowRight size={12} />
          </button>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <img
            src="/aloo_tandoori-removebg-preview.png"
            alt="Spicy Chips"
            className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-[0_20px_50px_rgba(255,50,50,0.4)] hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </Reveal>
  );
};

export const TraditionalFavoritesBanner = () => {
  const navigate = useNavigate();
  return (
    <Reveal variant="scale" amount={0.15} className="col-span-full my-8 w-full">
      <div className="w-full rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#21150A] via-[#3D2712] to-[#1A1007] border border-amber-500/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F4A51C] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 font-mono">
            <FaCrown className="text-[#F4A51C]" /> TRADITIONAL FAVORITES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-montserrat text-white leading-tight">
            Handcrafted <span className="text-[#F4A51C]">South Indian Heritage.</span>
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Melt-in-mouth Butter Murukku, Kerala Black Jaggery Halwa, Ooty Varkey & Peanut Chikki bars.
          </p>
          <button
            onClick={() => navigate("/products/murukku")}
            className="inline-flex items-center gap-2 bg-[#F4A51C] text-black font-extrabold text-xs px-6 py-3.5 rounded-full uppercase tracking-wider shadow-lg transition-all hover:scale-105 font-mono cursor-pointer"
          >
            Explore Savouries <FaArrowRight size={12} />
          </button>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <img
            src="/murukku_chips.jpg"
            alt="Traditional Murukku"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-3xl border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] -rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </div>
    </Reveal>
  );
};
