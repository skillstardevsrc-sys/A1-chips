import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

export const AboutPage = () => (
  <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
    <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-16 flex-1 space-y-6">
      <Reveal variant="fade-down" amount={0.1}>
        <h1 className="text-4xl font-black font-montserrat text-white mb-4">About A1 Chips</h1>
        <p className="text-white/80 leading-relaxed text-sm">
          Founded in Coimbatore, Tamil Nadu, A1 Chips has grown into South India’s premier brand for authentic, crispy savouries and traditional snacks. Our recipes use 100% pure coconut oil, fresh farm potatoes, and Nendran bananas processed within hours of harvest.
        </p>
      </Reveal>

      <SectionReveal variant="fade-up" amount={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center shadow-xl">
          <h3 className="text-2xl font-black text-[#FFC02D] font-mono mb-1">40+ Years</h3>
          <p className="text-xs text-white/60">Culinary Heritage</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center shadow-xl">
          <h3 className="text-2xl font-black text-[#FFC02D] font-mono mb-1">100% Pure</h3>
          <p className="text-xs text-white/60">Cold Pressed Oil</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center shadow-xl">
          <h3 className="text-2xl font-black text-[#FFC02D] font-mono mb-1">100K+</h3>
          <p className="text-xs text-white/60">Happy Snackers</p>
        </div>
      </SectionReveal>
    </main>
    <Footer />
  </div>
);

export const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/misc/contact", form);
      setStatus(res.message || "Message sent!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full space-y-6">
        <Reveal variant="fade-down" amount={0.1}>
          <h1 className="text-4xl font-black font-montserrat text-white mb-2">Contact Customer Support</h1>
        </Reveal>

        {status && <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">{status}</div>}

        <SectionReveal variant="fade-up" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Your Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F05A00]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F05A00]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Message *</label>
              <textarea rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F05A00]" />
            </div>
            <button type="submit" className="bg-[#C44100] text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-[#F05A00] uppercase tracking-wider font-mono cursor-pointer">
              Send Message
            </button>
          </form>
        </SectionReveal>
      </main>
      <Footer />
    </div>
  );
};

export const ShippingPolicyPage = () => (
  <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
    <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-16 flex-1 space-y-4 text-xs text-white/80 leading-relaxed">
      <Reveal variant="fade-down" amount={0.1}>
        <h1 className="text-3xl font-black font-montserrat text-white mb-6">Shipping & Dispatch Policy</h1>
      </Reveal>
      <SectionReveal variant="fade-up" amount={0.15} className="space-y-4 bg-[#14090C] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <p>Orders placed on A1 Chips are processed within 24 business hours from our Coimbatore production facility.</p>
        <p>Standard delivery takes 3 to 5 business days across India. Free shipping applies to orders above ₹499.</p>
      </SectionReveal>
    </main>
    <Footer />
  </div>
);

export const RefundPolicyPage = () => (
  <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
    <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-16 flex-1 space-y-4 text-xs text-white/80 leading-relaxed">
      <Reveal variant="fade-down" amount={0.1}>
        <h1 className="text-3xl font-black font-montserrat text-white mb-6">Return & Refund Policy</h1>
      </Reveal>
      <SectionReveal variant="fade-up" amount={0.15} className="space-y-4 bg-[#14090C] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <p>Due to the perishable food nature of our savouries, returns are accepted within 7 days if package is damaged in transit or seal is broken upon receipt.</p>
        <p>Refunds are credited to the original payment method within 5-7 business days after approval.</p>
      </SectionReveal>
    </main>
    <Footer />
  </div>
);
