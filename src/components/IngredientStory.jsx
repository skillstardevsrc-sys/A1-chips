import React from "react";
import { useNavigate } from "react-router-dom";
import { SectionReveal, Reveal, RevealImage } from "./common/ScrollReveal";

const IngredientStory = () => {
  const navigate = useNavigate();
  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="w-full py-28 px-6 md:px-16 bg-[#060B08] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <Reveal variant="fade-up" delay={0.1}>
          <span className="text-xs font-bold tracking-[0.3em] text-emerald-400 uppercase mb-3 block font-mono">
            04 / INGREDIENT STORY
          </span>
          <h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            REAL INGREDIENTS.
            <br />
            <span className="text-emerald-400">NOTHING EXTRA.</span>
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto">
            No artificial preservatives. No palm oil. Pure Coimbatore craftsmanship.
          </p>
        </Reveal>
      </div>

      {/* Giant Visual Hero Banner */}
      <Reveal variant="clip-path" amount={0.2} className="max-w-7xl mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
        <img
          src="/ingredient_story.jpg"
          alt="100% Pure Coconut Oil and Ingredients"
          className="w-full h-full object-cover filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase block mb-2 font-mono">
              100% PURE COCONUT OIL
            </span>
            <h3
              className="text-2xl md:text-4xl font-black max-w-md"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              CRUNCHED IN COCONUT GOLD.
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl">
                <span className="text-2xl font-black text-emerald-400 block font-mono">100%</span>
                <span className="text-[10px] font-bold tracking-wider text-white/80 uppercase font-mono">Natural Oil</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl">
                <span className="text-2xl font-black text-yellow-400 block font-mono">0%</span>
                <span className="text-[10px] font-bold tracking-wider text-white/80 uppercase font-mono">Palm Oil</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/shop?category=banana-chips")}
              className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer font-mono"
            >
              Explore Coconut Oil Chips ➔
            </button>
          </div>
        </div>
      </Reveal>
    </SectionReveal>
  );
};

export default IngredientStory;
