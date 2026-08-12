import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaTruck, FaBox, FaCheckCircle, FaShippingFast, FaHome } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";
import { SectionReveal, Reveal, StaggerContainer, StaggerItem } from "../components/common/ScrollReveal";

const trackingSteps = [
  { key: "confirmed", label: "Order Confirmed", icon: FaCheckCircle },
  { key: "processing", label: "Processing & Fresh Packing", icon: FaBox },
  { key: "shipped", label: "Handed to Carrier", icon: FaShippingFast },
  { key: "out_for_delivery", label: "Out for Delivery", icon: FaTruck },
  { key: "delivered", label: "Delivered", icon: FaHome },
];

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("orderNumber")) {
      handleTrackSubmit();
    }
  }, []);

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setTrackingData(null);
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    try {
      let query = `/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`;
      if (phoneOrEmail) query += `&phoneOrEmail=${encodeURIComponent(phoneOrEmail.trim())}`;

      const res = await api.get(query);
      setTrackingData(res.data);
    } catch (err) {
      setErrorMsg(err.message || "Order not found. Please check your order number.");
    } font-mono;
    setIsLoading(false);
  };

  const getStepStatusClass = (stepKey) => {
    if (!trackingData) return "bg-white/10 text-white/40";
    const statusOrder = ["confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"];
    const currentIdx = statusOrder.indexOf(trackingData.orderStatus);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (stepIdx <= currentIdx) return "bg-[#F05A00] text-white border-2 border-[#FFC02D]";
    return "bg-white/10 text-white/30";
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <Reveal variant="fade-down" amount={0.1} className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">Track Your Order</h1>
          <p className="text-xs text-white/60">Enter your order ID to see live dispatch updates from our Coimbatore warehouse.</p>
        </Reveal>

        {/* Tracking Form */}
        <Reveal variant="fade-up" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 mb-10 shadow-2xl max-w-xl mx-auto space-y-4">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Order Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. A1-2026-984321"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Phone or Email (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ramesh@example.com or +919812345678"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#C44100] hover:bg-[#F05A00] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <FaSearch size={12} /> {isLoading ? "Searching Status..." : "Track Package"}
            </button>
          </form>
        </Reveal>

        {errorMsg && (
          <Reveal variant="fade-up" className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center mb-8 max-w-xl mx-auto font-mono">
            {errorMsg}
          </Reveal>
        )}

        {/* Tracking Results Card */}
        {trackingData && (
          <SectionReveal variant="fade-up" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#C44100]/25 text-[#FFC02D] border border-[#C44100]/50 font-mono">
                  Status: {trackingData.orderStatus?.toUpperCase()}
                </span>
                <h3 className="text-xl font-black font-mono text-white mt-2">{trackingData.orderNumber}</h3>
                <p className="text-xs text-white/50">Carrier: {trackingData.carrier || "BlueDart Express"}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50">Tracking Waybill ID</p>
                <p className="font-mono font-bold text-sm text-[#FFC02D]">{trackingData.trackingNumber}</p>
                <p className="text-xs text-emerald-400 font-bold mt-1 font-mono">Est. Delivery: {trackingData.estimatedDelivery}</p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60 mb-6 font-montserrat">Shipment Timeline</h4>
              <StaggerContainer amount={0.2} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {trackingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const statusClass = getStepStatusClass(step.key);
                  return (
                    <StaggerItem key={idx} variant="scale" className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-lg ${statusClass}`}>
                        <Icon size={18} />
                      </div>
                      <p className="text-xs font-bold text-white mb-0.5">{step.label}</p>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>

            {/* Order Items */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Package Contents</h4>
              <div className="space-y-2">
                {trackingData.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-bold text-white">{item.name} ({item.weight}) × {item.quantity}</span>
                    <span className="font-mono text-[#FFC02D]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
