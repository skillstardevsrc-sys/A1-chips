import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTruck, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/detail/${orderNumber}`);
      setOrder(res.data.order);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-16 flex-1 text-center">
        <Reveal variant="scale" amount={0.15}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <FaCheckCircle size={40} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-montserrat tracking-tight mb-2">Order Confirmed!</h1>
          <p className="text-sm text-white/70 mb-6 max-w-lg mx-auto">
            Thank you for choosing A1 Chips! Your order <strong className="text-[#FFC02D] font-mono">{orderNumber}</strong> has been received and sent to our Coimbatore hub for fresh packing.
          </p>
        </Reveal>

        {order && (
          <Reveal variant="fade-up" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-6 text-left mb-8 space-y-4 shadow-2xl">
            <div className="flex justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs text-white/50">Order Number</p>
                <p className="font-mono font-bold text-sm text-[#FFC02D]">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">Estimated Delivery</p>
                <p className="font-bold text-sm text-emerald-400 font-mono">{order.estimatedDelivery || "3-5 Days"}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white/70 mb-2 font-mono">Items Ordered:</p>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-medium">
                    <span>{item.name} ({item.weight}) × {item.quantity}</span>
                    <span className="font-mono text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between font-extrabold text-sm font-montserrat">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="font-mono text-[#FFC02D] text-base">₹{order.total}</span>
            </div>
          </Reveal>
        )}

        <Reveal variant="scale" amount={0.15} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/track-order?orderNumber=${orderNumber}`}
            className="bg-[#C44100] text-white font-extrabold text-xs px-8 py-4 rounded-full hover:bg-[#F05A00] transition-all uppercase tracking-wider flex items-center gap-2 shadow-xl font-mono"
          >
            <FaTruck size={14} /> Track Order Status
          </Link>
          <Link
            to="/shop"
            className="bg-white/10 text-white font-bold text-xs px-8 py-4 rounded-full hover:bg-white/20 transition-all uppercase tracking-wider font-mono"
          >
            Continue Shopping
          </Link>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
