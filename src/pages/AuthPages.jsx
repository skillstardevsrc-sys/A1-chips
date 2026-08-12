import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUser, FaPhone, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/useAuthStore";
import { Reveal } from "../components/common/ScrollReveal";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await login(email, password);
    if (res.success) {
      navigate(res.user?.role === "admin" ? "/admin" : "/account");
    } else {
      setErrorMsg(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-16 flex-1 flex flex-col justify-center">
        <Reveal variant="scale" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black font-montserrat tracking-tight">Sign In to A1 Chips</h1>
            <p className="text-xs text-white/60">Access your saved addresses, wishlist, and track orders.</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Password</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:from-[#FF6B10] hover:to-[#D54800] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              {isLoading ? "Signing in..." : <>Sign In <FaArrowRight size={12} /></>}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-white/10 text-xs text-white/60">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#FFC02D] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await registerUser(name, email, password, phone);
    if (res.success) {
      navigate("/account");
    } else {
      setErrorMsg(res.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
        <Reveal variant="scale" amount={0.15} className="bg-[#14090C] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black font-montserrat tracking-tight">Create Customer Account</h1>
            <p className="text-xs text-white/60">Join A1 Chips Club for special discounts and fast checkout.</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Full Name *</label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="text"
                  required
                  placeholder="Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Email Address *</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Phone Number</label>
              <div className="relative flex items-center">
                <FaPhone className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Password *</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-white/40" size={13} />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#F05A00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F05A00] to-[#C44100] hover:from-[#FF6B10] hover:to-[#D54800] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              {isLoading ? "Creating Account..." : <>Register Account <FaArrowRight size={12} /></>}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-white/10 text-xs text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FFC02D] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};
