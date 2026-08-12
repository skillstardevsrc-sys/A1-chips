import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { SectionReveal } from "./common/ScrollReveal";

const MobileFooter = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <SectionReveal
      as="footer"
      variant="fade-up"
      amount={0.1}
      className="lg:hidden w-full bg-[#060304] text-white/70 py-10 px-6 border-t border-white/10 text-xs pb-24"
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-white text-black font-black text-base font-montserrat flex items-center justify-center mx-auto mb-3">
            a1
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            A1 Chips — House of Savouries. Coimbatore heritage snack craftsmanship since 1970.
          </p>

          <div className="flex justify-center gap-4 text-white mb-6">
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>

        {/* Collapsible Accordions */}
        <div className="divide-y divide-white/10 border-y border-white/10 font-montserrat">
          {/* 1. SHOP */}
          <div>
            <button
              onClick={() => toggleSection("shop")}
              className="w-full py-3.5 flex justify-between items-center text-xs font-black uppercase text-white font-mono"
            >
              <span>Shop Categories</span>
              <FaChevronDown size={10} className={`transition-transform ${openSection === "shop" ? "rotate-180 text-[#FFC02D]" : ""}`} />
            </button>
            {openSection === "shop" && (
              <ul className="pb-3.5 space-y-2 text-white/70 font-sans">
                <li><Link to="/products/banana-chips" className="hover:text-white">Banana Chips</Link></li>
                <li><Link to="/products/potato-chips" className="hover:text-white">Potato Chips</Link></li>
                <li><Link to="/products/tapioca-chips" className="hover:text-white">Tapioca Chips</Link></li>
                <li><Link to="/products/murukku-mixtures" className="hover:text-white">Murukku & Mixtures</Link></li>
                <li><Link to="/shop" className="hover:text-white">Gift Snack Box</Link></li>
              </ul>
            )}
          </div>

          {/* 2. COMPANY */}
          <div>
            <button
              onClick={() => toggleSection("company")}
              className="w-full py-3.5 flex justify-between items-center text-xs font-black uppercase text-white font-mono"
            >
              <span>Company</span>
              <FaChevronDown size={10} className={`transition-transform ${openSection === "company" ? "rotate-180 text-[#FFC02D]" : ""}`} />
            </button>
            {openSection === "company" && (
              <ul className="pb-3.5 space-y-2 text-white/70 font-sans">
                <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
                <li><Link to="/about" className="hover:text-white">Coimbatore Heritage</Link></li>
                <li><Link to="/stores" className="hover:text-white">Store Locator (55 Outlets)</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Support</Link></li>
              </ul>
            )}
          </div>

          {/* 3. HELP & POLICIES */}
          <div>
            <button
              onClick={() => toggleSection("help")}
              className="w-full py-3.5 flex justify-between items-center text-xs font-black uppercase text-white font-mono"
            >
              <span>Customer Help & Policies</span>
              <FaChevronDown size={10} className={`transition-transform ${openSection === "help" ? "rotate-180 text-[#FFC02D]" : ""}`} />
            </button>
            {openSection === "help" && (
              <ul className="pb-3.5 space-y-2 text-white/70 font-sans">
                <li><Link to="/track-order" className="hover:text-white">Track Order</Link></li>
                <li><Link to="/shipping" className="hover:text-white">International Shipping</Link></li>
                <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
                <li><Link to="/contact" className="hover:text-white">FAQ</Link></li>
              </ul>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="pt-2 text-center">
          <p className="font-bold text-white uppercase text-[11px] mb-2 font-mono">Get 10% Off First Order</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-white text-xs placeholder:text-white/40 focus:outline-none flex-1"
            />
            <button className="bg-[#C44100] text-white font-bold px-4 py-2 rounded-xl text-xs uppercase font-mono">
              Join
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10 text-center text-white/40 text-[10.5px]">
          <p>© 2026 A1 Chips Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </SectionReveal>
  );
};

export default MobileFooter;
