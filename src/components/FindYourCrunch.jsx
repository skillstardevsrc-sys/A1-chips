import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { mockProducts } from "../data/mockProducts";
import ThreeDProductModel from "./ThreeDProductModel";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const spiceOptions = [
  { name: "Mild", accent: "#FFC02D" },
  { name: "Medium", accent: "#FF9500" },
  { name: "Spicy", accent: "#F05A00" },
  { name: "Extra Spicy", accent: "#FF3B30" },
];

const moodOptions = ["Teatime", "Movie Night", "Party", "Office"];

const FindYourCrunch = () => {
  const navigate = useNavigate();
  const [selectedSpice, setSelectedSpice] = useState("Spicy");
  const [selectedMood, setSelectedMood] = useState("Teatime");
  const [showProducts, setShowProducts] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(mockProducts[1] || mockProducts[0]);
  const [addedId, setAddedId] = useState(null);

  const { addToCart, openCart } = useCartStore();

  const handleSelectSpice = (spiceName) => {
    setSelectedSpice(spiceName);
    const matched = mockProducts.find((p) => p.spiceLevel === spiceName) || mockProducts[0];
    setActiveProduct(matched);
  };

  const handleFindMatches = () => {
    let recs = mockProducts.filter(
      (p) => p.spiceLevel === selectedSpice || selectedSpice === "Extra Spicy"
    );
    if (recs.length === 0) recs = mockProducts.slice(0, 3);
    else recs = recs.slice(0, 3);

    setMatchedProducts(recs);
    setShowProducts(true);
  };

  const handleAddToCart = async (product) => {
    await addToCart(product._id, null, product.weight || "200g", 1);
    setAddedId(product._id);
    openCart();
    setTimeout(() => setAddedId(null), 2000);
  };

  const currentSpice = spiceOptions.find((s) => s.name === selectedSpice) || spiceOptions[2];

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="py-16 px-6 sm:px-12 bg-[#090405] text-white border-t border-white/10 relative overflow-hidden font-poppins select-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Apple-Style Minimalist Header */}
        <Reveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FFC02D] block mb-2 font-mono">
            02 / INTERACTIVE MATCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight text-white mb-2">
            Find your crunch.
          </h2>
          <p className="text-white/60 text-xs sm:text-sm">
            Select your flavor profile and find your perfect crunchy matches.
          </p>
        </Reveal>

        {/* Compact Apple-style Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#13080A] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          {/* Left Controls */}
          <StaggerContainer amount={0.2} className="lg:col-span-5 space-y-6">
            <StaggerItem variant="fade-right">
              <span className="text-xs font-bold text-white/50 block mb-2 font-mono">
                SPICE LEVEL
              </span>
              <div className="grid grid-cols-2 gap-2">
                {spiceOptions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSelectSpice(s.name)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-left ${
                      selectedSpice === s.name
                        ? "bg-white text-black shadow-md scale-[1.02]"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </StaggerItem>

            <StaggerItem variant="fade-right">
              <span className="text-xs font-bold text-white/50 block mb-2 font-mono">
                OCCASION
              </span>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-left ${
                      selectedMood === mood
                        ? "bg-white text-black shadow-md scale-[1.02]"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </StaggerItem>

            {/* Action Button */}
            <StaggerItem variant="scale" className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFindMatches}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer"
              >
                Find Matches
              </motion.button>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Panel: 3D Model vs Matched Products Display */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px]">
            <AnimatePresence mode="wait">
              {!showProducts ? (
                /* Default State: 3D WebGL Model View */
                <motion.div
                  key="3d-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-full text-center mb-1">
                    <span className="text-xs font-bold text-white/50 font-mono uppercase tracking-widest">
                      {activeProduct.name}
                    </span>
                  </div>

                  <ThreeDProductModel
                    key={activeProduct._id || activeProduct.name}
                    imageUrl={activeProduct.thumbnail || "/masala_munch-removebg-preview.png"}
                    productName={activeProduct.name}
                    subtitle={`${selectedSpice} • ${selectedMood}`}
                    accentColor={currentSpice.accent}
                  />
                </motion.div>
              ) : (
                /* Matched State: Hides 3D Model & Shows Product Cards */
                <motion.div
                  key="products-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full space-y-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-white/50 font-mono uppercase tracking-widest">
                      MATCHED PRODUCTS ({matchedProducts.length})
                    </span>
                    <button
                      onClick={() => setShowProducts(false)}
                      className="text-xs font-bold text-[#FFC02D] hover:underline"
                    >
                      Show 3D View
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {matchedProducts.map((prod) => (
                      <div
                        key={prod._id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center flex flex-col justify-between hover:bg-white/10 transition-all"
                      >
                        <div>
                          <img
                            src={prod.thumbnail || "/masala_munch-removebg-preview.png"}
                            alt={prod.name}
                            className="w-24 h-24 object-contain mx-auto mb-2 filter drop-shadow-md"
                          />
                          <h4 className="font-extrabold text-xs text-white font-montserrat truncate">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] font-mono text-[#FFC02D] font-bold mt-1">
                            ₹{prod.price}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="mt-3 w-full py-2 rounded-xl bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-[#FFC02D] transition-colors"
                        >
                          {addedId === prod._id ? "Added" : "+ Add"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* View More Products Button */}
                  <div className="pt-3 text-center">
                    <button
                      onClick={() => navigate("/shop")}
                      className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                      View More Products ➔
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default FindYourCrunch;
