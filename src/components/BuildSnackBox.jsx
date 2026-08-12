import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBox, FaCheck, FaShoppingBag, FaPlus, FaTrashAlt } from "react-icons/fa";
import { api } from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { mockProducts } from "../data/mockProducts";
import { SectionReveal, StaggerContainer, StaggerItem, Reveal } from "./common/ScrollReveal";

const boxOptions = [
  { size: 4, label: "Starter Box — 4 Packs", discount: "15% OFF", defaultPrice: 349 },
  { size: 6, label: "Family Box — 6 Packs", discount: "20% OFF", defaultPrice: 499 },
  { size: 8, label: "Party Box — 8 Packs", discount: "25% OFF", defaultPrice: 649 },
];

const BuildSnackBox = () => {
  const [selectedBoxSize, setSelectedBoxSize] = useState(4);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    let prods = [];
    try {
      const res = await api.get("/products?limit=18");
      prods = res.data?.products || [];
    } catch (e) {
      console.warn("API fetch in BuildSnackBox failed, using mockProducts fallback", e);
    }

    if (!prods || prods.length === 0) {
      prods = mockProducts;
    }

    setAvailableProducts(prods);
  };

  const handleToggleProduct = (product) => {
    if (selectedItems.some((item) => item._id === product._id)) {
      setSelectedItems(selectedItems.filter((item) => item._id !== product._id));
    } else {
      if (selectedItems.length >= selectedBoxSize) return;
      setSelectedItems([...selectedItems, product]);
    }
  };

  const currentOption = boxOptions.find((b) => b.size === selectedBoxSize);
  const rawSubtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const discountPercent = selectedBoxSize === 4 ? 15 : selectedBoxSize === 6 ? 20 : 25;
  const finalPrice = rawSubtotal > 0 ? Math.round(rawSubtotal * (1 - discountPercent / 100)) : currentOption.defaultPrice;

  const handleAddBundleToCart = async () => {
    if (selectedItems.length !== selectedBoxSize) return;
    for (const item of selectedItems) {
      await addToCart(item._id, item.variants?.[0]?._id, item.weight || "200g", 1);
    }
  };

  return (
    <SectionReveal
      as="section"
      variant="fade-up"
      amount={0.15}
      className="py-20 px-6 sm:px-12 bg-[#120709] relative overflow-hidden border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFC02D] bg-[#C44100]/20 px-4 py-1.5 rounded-full border border-[#C44100]/40 font-mono">
            07 / BUNDLE BUILDER
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-montserrat tracking-tight mt-3 mb-4">
            Build Your Custom Snack Box
          </h2>
          <p className="text-white/70 text-sm">
            Pick your favorite handcrafted chips & savouries. Mix and match to save up to 25% on bundle pricing.
          </p>
        </Reveal>

        {/* Box Size Selector */}
        <StaggerContainer amount={0.2} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {boxOptions.map((opt) => (
            <StaggerItem key={opt.size} variant="scale">
              <button
                onClick={() => {
                  setSelectedBoxSize(opt.size);
                  setSelectedItems([]);
                }}
                className={`p-5 rounded-3xl border-2 text-left transition-all w-full ${
                  selectedBoxSize === opt.size
                    ? "border-[#F05A00] bg-[#F05A00]/15 scale-105 shadow-xl"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <FaBox size={20} className={selectedBoxSize === opt.size ? "text-[#FFC02D]" : "text-white/40"} />
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    {opt.discount}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white font-montserrat">{opt.label}</h3>
                <p className="text-xs text-white/50 mt-1 font-mono">Select {opt.size} savory items</p>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Items Picker & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Select {selectedBoxSize} Items ({selectedItems.length}/{selectedBoxSize} selected)
              </h3>
              {selectedItems.length > 0 && (
                <button onClick={() => setSelectedItems([])} className="text-xs text-rose-400 hover:underline">
                  Reset Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableProducts.map((prod) => {
                const isSelected = selectedItems.some((i) => i._id === prod._id);
                return (
                  <motion.div
                    key={prod._id}
                    onClick={() => handleToggleProduct(prod)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#F05A00] bg-[#F05A00]/20 shadow-md"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="text-right">
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-[#F05A00] text-white flex items-center justify-center text-[10px] ml-auto">
                          <FaCheck />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white/40 flex items-center justify-center text-[10px] ml-auto">
                          <FaPlus />
                        </span>
                      )}
                    </div>
                    <img
                      src={prod.thumbnail || "/masala_munch-removebg-preview.png"}
                      alt=""
                      className="w-20 h-20 object-contain mx-auto my-2"
                    />
                    <div>
                      <p className="font-bold text-xs text-white truncate font-montserrat">{prod.name}</p>
                      <p className="text-[11px] font-mono text-[#FFC02D]">₹{prod.price}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bundle Summary */}
          <div className="bg-[#180B0E] border border-white/15 rounded-3xl p-6 flex flex-col justify-between shadow-2xl h-fit">
            <div>
              <h3 className="font-black text-lg text-white font-montserrat mb-4 border-b border-white/10 pb-3">
                Snack Box Summary
              </h3>

              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-white/40 italic">Click chips on the left to add them to your snack box.</p>
                ) : (
                  selectedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-white/5">
                      <span className="font-bold text-white truncate max-w-[170px]">{item.name}</span>
                      <span className="font-mono text-[#FFC02D]">₹{item.price}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between text-xs text-white/70">
                <span>Bundle Discount</span>
                <span className="font-bold text-emerald-400 font-mono">{discountPercent}% OFF</span>
              </div>
              <div className="flex justify-between text-base font-black text-white font-montserrat">
                <span>Box Total</span>
                <span className="font-mono text-[#FFC02D] text-xl">₹{finalPrice}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddBundleToCart}
                disabled={selectedItems.length !== selectedBoxSize}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:from-[#FF6B10] hover:to-[#D54800] text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 font-mono"
              >
                <FaShoppingBag size={13} /> Add Box To Bag (₹{finalPrice})
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default BuildSnackBox;
