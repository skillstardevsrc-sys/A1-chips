import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaShoppingBag, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuthStore } from "../store/useAuthStore";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "STORES", path: "/stores" },
  { name: "CATEGORIES", path: "/shop" },
  { name: "ABOUT", path: "/about" },
  { name: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const totalCartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.products?.length || 0;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full flex items-center justify-between px-4 sm:px-10 py-3 relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10"
      >
        {/* Left Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
        </button>

        {/* Pure Text Logo */}
        <Link to="/" className="cursor-pointer select-none group">
          <span
            className="text-2xl sm:text-3xl font-black tracking-tight flex items-center leading-none"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span className="text-white font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">A1</span>
            <span className="text-white font-black tracking-widest text-xl sm:text-2xl ml-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] group-hover:text-amber-200 transition-colors duration-300">
              -CHIPS
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/15 shadow-xl gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            title="Search Products"
          >
            <FaSearch size={13} />
          </button>

          {/* Wishlist */}
          <Link
            to={isAuthenticated ? "/account?tab=wishlist" : "/login"}
            className="relative w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            title="Wishlist"
          >
            <FaHeart size={13} className="text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative w-9 h-9 rounded-full bg-[#F05A00] text-white flex items-center justify-center hover:bg-[#FF6B10] transition-all duration-300 hover:scale-105 shadow-lg"
            title="Cart Drawer"
          >
            <FaShoppingBag size={14} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFC02D] text-black font-black rounded-full text-[11px] flex items-center justify-center shadow">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Auth Button / User Profile */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate(user?.role === "admin" ? "/admin" : "/account")}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg hover:brightness-110 transition-all"
            >
              <FaUser size={11} />
              <span className="hidden sm:inline uppercase">{user?.name?.split(" ")[0] || "Account"}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              SIGN IN
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Animated Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full bg-[#12080A] border-b border-white/10 px-6 py-5 z-40 relative overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-bold tracking-widest text-white/90 hover:text-[#FFC02D] py-1 border-b border-white/5"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {!isAuthenticated && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full py-2.5 rounded-full bg-[#F05A00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg"
                  >
                    SIGN IN TO ACCOUNT
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
