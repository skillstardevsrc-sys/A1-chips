import React from "react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SectionReveal, StaggerContainer, StaggerItem } from "./common/ScrollReveal";
import MobileFooter from "./MobileFooter";

const Footer = () => {
  return (
    <>
      {/* Mobile & Tablet Footer (lg:hidden) */}
      <MobileFooter />

      {/* Desktop Footer (hidden lg:block) — UNTOUCHED */}
      <SectionReveal
        as="footer"
        variant="fade-up"
        amount={0.1}
        className="hidden lg:block w-full bg-[#060304] text-white/70 py-16 px-6 md:px-16 border-t border-white/10 text-xs"
      >
        <StaggerContainer amount={0.1} className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <StaggerItem variant="fade-up" className="col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 text-black font-black text-lg font-montserrat">
              a1
            </div>
            <p className="text-white/50 leading-relaxed max-w-xs mb-4">
              A1 Chips — House of Savouries. Coimbatore heritage snack craftsmanship since 1970.
            </p>
            <div className="flex gap-3 text-white">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <FaFacebookF />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <FaYoutube />
              </a>
            </div>
          </StaggerItem>

          {/* Column 1: SHOP */}
          <StaggerItem variant="fade-up">
            <h4 className="font-extrabold text-white tracking-widest uppercase mb-4 text-xs font-montserrat">SHOP</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products/banana-chips" className="hover:text-white transition-colors">Banana Chips</Link></li>
              <li><Link to="/products/potato-chips" className="hover:text-white transition-colors">Potato Chips</Link></li>
              <li><Link to="/products/tapioca-chips" className="hover:text-white transition-colors">Tapioca Chips</Link></li>
              <li><Link to="/products/murukku-mixtures" className="hover:text-white transition-colors">Murukku & Mixtures</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Gift Snack Box</Link></li>
            </ul>
          </StaggerItem>

          {/* Column 2: COMPANY */}
          <StaggerItem variant="fade-up">
            <h4 className="font-extrabold text-white tracking-widest uppercase mb-4 text-xs font-montserrat">COMPANY</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Coimbatore Heritage</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Quality Assurance</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Store Locator</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </StaggerItem>

          {/* Column 3: HELP */}
          <StaggerItem variant="fade-up">
            <h4 className="font-extrabold text-white tracking-widest uppercase mb-4 text-xs font-montserrat">HELP</h4>
            <ul className="space-y-2.5">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">International Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">FSSAI Info</Link></li>
            </ul>
          </StaggerItem>

          {/* Column 4: NEWSLETTER */}
          <StaggerItem variant="fade-up" className="col-span-2 md:col-span-1">
            <h4 className="font-extrabold text-white tracking-widest uppercase mb-4 text-xs font-montserrat">GET 10% OFF</h4>
            <p className="text-white/50 mb-3">Subscribe for exclusive offers and festival product releases.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white w-full text-xs"
              />
              <button className="bg-white text-black font-extrabold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors uppercase font-mono text-xs">
                JOIN
              </button>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-[11px]">
          <p>© 2026 A1 Chips Pvt. Ltd. All rights reserved. Crafted with coconut oil in Coimbatore.</p>
          <div className="flex gap-6">
            <Link to="/shipping" className="hover:text-white">Privacy Policy</Link>
            <Link to="/returns" className="hover:text-white">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-white">Shipping Policy</Link>
          </div>
        </div>
      </SectionReveal>
    </>
  );
};

export default Footer;
