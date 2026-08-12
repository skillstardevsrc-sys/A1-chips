import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFire, FaBox, FaCrown, FaUtensils, FaLeaf, FaChevronRight } from "react-icons/fa";

export const categoriesList = [
  { slug: "", name: "All Products", icon: FaBox, image: "/snack_box.jpg", badge: "ALL" },
  { slug: "snack-squad", name: "Snack Squad", icon: FaCrown, image: "/snack_box.jpg", badge: "POPULAR" },
  { slug: "banana-chips", name: "Banana Chips", icon: FaLeaf, image: "/banana_chips.jpg", badge: "BESTSELLER" },
  { slug: "potato-chips", name: "Potato Chips", icon: FaFire, image: "/masala_munch-removebg-preview.png", badge: "SPICY" },
  { slug: "tapioca-chips", name: "Tapioca Chips", icon: FaUtensils, image: "/tapioca_chips.jpg", badge: "CRUNCH" },
  { slug: "mixture", name: "Mixture", icon: FaUtensils, image: "/murukku_chips.jpg", badge: "HERITAGE" },
  { slug: "murukku", name: "Murukku", icon: FaUtensils, image: "/murukku_chips.jpg", badge: "CLASSIC" },
  { slug: "pakoda", name: "Pakoda", icon: FaUtensils, image: "/murukku_chips.jpg", badge: "SAVOURY" },
  { slug: "chikkies", name: "Chikkies", icon: FaCrown, image: "/snack_box.jpg", badge: "SWEET" },
  { slug: "puffed-snacks", name: "Puffed Snacks", icon: FaBox, image: "/masala_munch-removebg-preview.png", badge: "LIGHT" },
  { slug: "halwa", name: "Halwa", icon: FaCrown, image: "/heritage_story.jpg", badge: "DELICACY" },
  { slug: "varkey", name: "Varkey", icon: FaCrown, image: "/snack_box.jpg", badge: "OOTY" },
];

const CategoryNav = ({ activeCategory, onSelectCategory, layout = "horizontal" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = activeCategory !== undefined ? activeCategory : searchParams.get("category") || "";

  const handleCategoryClick = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      if (slug) {
        navigate(`/products/${slug}`);
      } else {
        navigate("/products");
      }
    }
  };

  if (layout === "vertical" || layout === "sidebar") {
    return (
      <div className="bg-[#14090C] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-1.5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2 px-2">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#FFC02D] font-montserrat flex items-center gap-2">
            <FaCrown size={12} /> Product Categories
          </h3>
          <span className="text-[10px] font-mono text-white/40">12 CORE</span>
        </div>

        <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
          {categoriesList.map((cat) => {
            const isActive = currentCategory === cat.slug || (!currentCategory && cat.slug === "");
            const Icon = cat.icon;

            return (
              <motion.button
                key={cat.slug || "all"}
                onClick={() => handleCategoryClick(cat.slug)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all duration-300 group border ${
                  isActive
                    ? "bg-gradient-to-r from-[#F05A00] to-[#C44100] text-white border-[#F05A00]/50 shadow-lg shadow-[#F05A00]/25"
                    : "bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/15"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-110 ${
                    isActive ? "bg-black/30" : "bg-white/10"
                  }`}>
                    <img src={cat.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-montserrat tracking-tight">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {cat.badge && (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono ${
                      isActive ? "bg-black/40 text-amber-300" : "bg-white/10 text-white/50"
                    }`}>
                      {cat.badge}
                    </span>
                  )}
                  <FaChevronRight size={10} className={`transition-transform ${isActive ? "text-white translate-x-0.5" : "text-white/20 group-hover:text-white/60"}`} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default Horizontal Pill Layout for Mobile / Header
  return (
    <div className="w-full bg-[#120709]/90 backdrop-blur-md border-y border-white/10 sticky top-0 z-30 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {categoriesList.map((cat) => {
          const isActive = currentCategory === cat.slug || (!currentCategory && cat.slug === "");
          return (
            <button
              key={cat.slug || "all"}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`relative px-4 py-2 rounded-full text-xs font-extrabold tracking-wider whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-[#F05A00] to-[#C44100] text-white shadow-lg shadow-[#F05A00]/25 scale-105"
                  : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
