import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLock, FaCreditCard, FaMoneyBillWave, FaTruck, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../services/api";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, clearCart, freeShippingThreshold } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "Coimbatore",
    state: "Tamil Nadu",
    postalCode: "",
    country: "India",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg("");
    if (!couponCode.trim()) return;

    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        subtotal: cart.subtotal,
      });
      setDiscountAmount(res.data.discountAmount || 0);
      setCouponMsg(`✓ Coupon '${res.data.code}' applied successfully!`);
    } catch (err) {
      setCouponMsg(err.message || "Invalid coupon");
      setDiscountAmount(0);
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const shippingFee = remainingForFreeShipping === 0 ? 0 : 50;
  const codFee = paymentMethod === "COD" ? 30 : 0;
  const tax = Math.round((cart.subtotal - discountAmount) * 0.05);
  const totalAmount = Math.max(0, cart.subtotal - discountAmount + shippingFee + codFee + tax);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.postalCode) {
      setErrorMessage("Please fill in all required shipping address fields.");
      return;
    }

    if (!/^\d{6}$/.test(shippingAddress.postalCode.trim())) {
      setErrorMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRes = await api.post("/orders", {
        items: cart.items,
        shippingAddress,
        paymentMethod,
        couponCode: discountAmount > 0 ? couponCode : "",
        customerDetails: {
          name: shippingAddress.fullName,
          email: user?.email || "customer@a1chips.com",
          phone: shippingAddress.phone,
        },
      });

      const newOrder = orderRes.data.order;

      if (paymentMethod === "COD") {
        await clearCart();
        navigate(`/order-success/${newOrder.orderNumber}`);
      } else {
        const payRes = await api.post("/payments/create-order", { orderId: newOrder._id });
        const { razorpayOrderId, amount, currency, key, orderNumber } = payRes.data;

        await api.post("/payments/verify-signature", {
          razorpayOrderId,
          razorpayPaymentId: `rzp_pay_${Date.now()}`,
          razorpaySignature: "mock_signature_success",
          orderNumber,
        });

        await clearCart();
        navigate(`/order-success/${orderNumber}`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Header */}
        <Reveal variant="fade-down" amount={0.1} className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black font-montserrat tracking-tight">Checkout</h1>
            <p className="text-xs text-white/60">Complete your order securely with SSL 256-bit encryption.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono">
            <FaLock size={10} /> Secure Checkout
          </div>
        </Reveal>

        {errorMessage && (
          <Reveal variant="fade-up" className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold mb-6 font-mono">
            {errorMessage}
          </Reveal>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <Reveal variant="fade-up" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h2 className="text-base font-extrabold font-montserrat flex items-center gap-2 text-white">
                <FaMapMarkerAlt className="text-[#FFC02D]" /> 1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Flat / House / Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    placeholder="House No, Building Name, Street Name"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.landmark}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                    placeholder="Near temple, park, school"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="641018"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 font-mono focus:outline-none focus:border-[#F05A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1 font-mono">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </Reveal>

            {/* Step 2: Payment Method Selection */}
            <Reveal variant="fade-up" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h2 className="text-base font-extrabold font-montserrat flex items-center gap-2 text-white">
                <FaCreditCard className="text-[#FFC02D]" /> 2. Payment Gateway
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Online Razorpay */}
                <div
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-[#F05A00] bg-[#F05A00]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <FaCreditCard className="text-[#FFC02D]" /> Razorpay Online Checkout
                    </span>
                    {paymentMethod === "ONLINE" && <FaCheckCircle className="text-[#F05A00]" size={16} />}
                  </div>
                  <p className="text-[11px] text-white/60">Credit Card, Debit Card, UPI (GPay/PhonePe/Paytm), Netbanking.</p>
                  <span className="inline-block text-[10px] text-emerald-400 font-bold mt-2 font-mono">✓ Zero Payment Processing Fee</span>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#F05A00] bg-[#F05A00]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <FaMoneyBillWave className="text-emerald-400" /> Cash On Delivery (COD)
                    </span>
                    {paymentMethod === "COD" && <FaCheckCircle className="text-[#F05A00]" size={16} />}
                  </div>
                  <p className="text-[11px] text-white/60">Pay cash upon parcel delivery at your doorstep.</p>
                  <span className="inline-block text-[10px] text-amber-300 font-bold mt-2 font-mono">+ ₹30 COD Handling Charge</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar Order Summary */}
          <div className="space-y-6">
            <Reveal variant="fade-left" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white border-b border-white/10 pb-3 font-montserrat">
                Order Review ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)
              </h3>

              {/* Items Preview */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-1 divide-y divide-white/5">
                {cart.items.map((item, i) => (
                  <div key={i} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="truncate max-w-[170px]">
                      <p className="font-bold text-white truncate">{item.nameSnapshot}</p>
                      <p className="text-[10px] text-white/50 font-mono">{item.weight} × {item.quantity}</p>
                    </div>
                    <span className="font-mono font-bold text-[#FFC02D]">₹{item.priceSnapshot * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-white/40 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-white/10 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-white/20 font-mono uppercase"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && <p className="text-[11px] text-emerald-400 mt-1 font-medium">{couponMsg}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-white/70 font-medium pt-3 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-white">₹{cart.subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-emerald-400">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>

                {paymentMethod === "COD" && (
                  <div className="flex justify-between text-amber-300">
                    <span>COD Fee</span>
                    <span className="font-mono">₹30</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST Tax (5%)</span>
                  <span className="font-mono text-white">₹{tax}</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/10 font-montserrat">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#FFC02D] text-xl">₹{totalAmount}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:from-[#FF6B10] hover:to-[#D54800] text-white font-extrabold text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-mono"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <FaLock size={12} /> Pay & Confirm Order (₹{totalAmount})
                  </>
                )}
              </motion.button>
            </Reveal>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
