import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaThLarge, FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import SearchModal from "./SearchModal";

const MobileBottomNav = () => {
  const location = useLocation();
  const { cart, openCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalCartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.products?.length || 0;

  const pathname = location.pathname;

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12080A]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="grid grid-cols-5 h-14 items-center max-w-lg mx-auto">
          {/* 1. HOME */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === "/" ? "text-[#FFC02D]" : "text-white/60 hover:text-white"
            }`}
          >
            <FaHome size={17} />
            <span className="text-[9.5px] font-bold tracking-wider mt-1 font-mono uppercase">HOME</span>
          </Link>

          {/* 2. CATEGORIES */}
          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname.includes("/shop") || pathname.includes("/products") || pathname.includes("/category")
                ? "text-[#FFC02D]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <FaThLarge size={16} />
            <span className="text-[9.5px] font-bold tracking-wider mt-1 font-mono uppercase">SHOP</span>
          </Link>

          {/* 3. SEARCH */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <FaSearch size={16} />
            <span className="text-[9.5px] font-bold tracking-wider mt-1 font-mono uppercase">SEARCH</span>
          </button>

          {/* 4. WISHLIST */}
          <Link
            to="/account?tab=wishlist"
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              location.search.includes("tab=wishlist") ? "text-rose-400" : "text-white/60 hover:text-white"
            }`}
          >
            <FaHeart size={16} className={wishlistCount > 0 ? "text-rose-400" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-3 sm:right-5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
            <span className="text-[9.5px] font-bold tracking-wider mt-1 font-mono uppercase">SAVED</span>
          </Link>

          {/* 5. CART */}
          <button
            onClick={openCart}
            className="relative flex flex-col items-center justify-center py-1 text-[#F05A00] hover:text-[#FF6B10] transition-colors cursor-pointer"
          >
            <FaShoppingBag size={17} />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-3 sm:right-5 w-4.5 h-4.5 bg-[#FFC02D] text-black font-black rounded-full text-[9.5px] flex items-center justify-center shadow font-mono">
                {totalCartCount}
              </span>
            )}
            <span className="text-[9.5px] font-extrabold tracking-wider mt-1 font-mono uppercase text-white">BAG</span>
          </button>
        </div>
      </div>

      {/* Search Modal Triggered From Bottom Bar */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default MobileBottomNav;
