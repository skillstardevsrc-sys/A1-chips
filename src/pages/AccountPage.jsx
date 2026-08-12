import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FaUser, FaBox, FaMapMarkerAlt, FaHeart, FaLock, FaSignOutAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/useAuthStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { api } from "../services/api";
import { SectionReveal, Reveal, StaggerContainer, StaggerItem } from "../components/common/ScrollReveal";

const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuthStore();
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address Form state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "Coimbatore",
    state: "Tamil Nadu",
    postalCode: "",
    landmark: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "addresses") fetchAddresses();
    if (activeTab === "wishlist") fetchWishlist();
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await api.get("/orders/my-orders");
      setMyOrders(res.data?.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data?.addresses || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post("/addresses", addressForm);
      setIsAddAddressOpen(false);
      fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.post(`/orders/cancel/${orderId}`);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <Reveal variant="fade-down" amount={0.1}>
          <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">My Customer Account</h1>
          <p className="text-xs text-white/60 mb-8">Manage your profile, order history, addresses, and wishlist items.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <Reveal variant="fade-right" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-4 space-y-1 h-fit shadow-2xl">
            {[
              { key: "profile", label: "My Profile", icon: FaUser },
              { key: "orders", label: "Order History", icon: FaBox },
              { key: "addresses", label: "Addresses", icon: FaMapMarkerAlt },
              { key: "wishlist", label: "My Wishlist", icon: FaHeart },
              { key: "security", label: "Password & Security", icon: FaLock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSearchParams({ tab: tab.key })}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-[#C44100] text-white shadow-lg"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors mt-4 cursor-pointer"
            >
              <FaSignOutAlt size={14} /> Sign Out
            </button>
          </Reveal>

          {/* Main Tab Content */}
          <SectionReveal variant="fade-up" amount={0.1} className="lg:col-span-3 bg-[#14090C] border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[400px] shadow-2xl">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Personal Profile</h3>
                <StaggerContainer amount={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <StaggerItem variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white/50 block mb-1">Full Name</span>
                    <span className="font-bold text-white text-sm">{user?.name}</span>
                  </StaggerItem>
                  <StaggerItem variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white/50 block mb-1">Email Address</span>
                    <span className="font-bold text-white text-sm">{user?.email}</span>
                  </StaggerItem>
                  <StaggerItem variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white/50 block mb-1">Phone Number</span>
                    <span className="font-bold text-white text-sm">{user?.phone || "Not provided"}</span>
                  </StaggerItem>
                  <StaggerItem variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-white/50 block mb-1">Account Role</span>
                    <span className="font-bold text-[#FFC02D] uppercase font-mono">{user?.role}</span>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">My Orders</h3>

                {isLoadingOrders ? (
                  <p className="text-xs text-white/50">Loading orders...</p>
                ) : myOrders.length === 0 ? (
                  <p className="text-xs text-white/50">You haven't placed any orders yet.</p>
                ) : (
                  <StaggerContainer amount={0.1} className="space-y-4">
                    {myOrders.map((ord) => (
                      <StaggerItem key={ord._id} variant="fade-up" className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#FFC02D]">{ord.orderNumber}</span>
                            <span className="text-[11px] text-white/50 block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                              {ord.orderStatus}
                            </span>
                            <span className="font-mono font-black text-sm text-white">₹{ord.total}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="text-xs text-white/80 flex justify-between">
                              <span>{item.name} ({item.weight}) × {item.quantity}</span>
                              <span className="font-mono">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            to={`/track-order?orderNumber=${ord.orderNumber}`}
                            className="text-xs text-[#FFC02D] hover:underline font-bold"
                          >
                            Track Package Status →
                          </Link>
                          {["pending", "confirmed"].includes(ord.orderStatus) && (
                            <button
                              onClick={() => handleCancelOrder(ord._id)}
                              className="text-xs text-rose-400 hover:underline"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold font-montserrat text-white">Shipping Addresses</h3>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="bg-[#C44100] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#F05A00] flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <FaPlus size={10} /> Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <p className="text-xs text-white/50">No saved addresses yet.</p>
                ) : (
                  <StaggerContainer amount={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <StaggerItem key={addr._id} variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative shadow-lg">
                        <p className="font-bold text-xs text-white">{addr.fullName} ({addr.phone})</p>
                        <p className="text-xs text-white/70">{addr.addressLine1}, {addr.addressLine2}</p>
                        <p className="text-xs text-white/70 font-mono">{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 pt-2 cursor-pointer"
                        >
                          <FaTrashAlt size={11} /> Delete
                        </button>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">My Saved Wishlist</h3>
                {wishlist.products?.length === 0 ? (
                  <p className="text-xs text-white/50">Your wishlist is empty.</p>
                ) : (
                  <StaggerContainer amount={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.products?.map((prod) => (
                      <StaggerItem key={prod._id || prod} variant="scale" className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <img src={prod.thumbnail || "/masala_munch-removebg-preview.png"} alt="" className="w-12 h-12 object-contain" />
                          <div>
                            <p className="font-bold text-xs text-white font-montserrat">{prod.name}</p>
                            <p className="font-mono text-xs text-[#FFC02D]">₹{prod.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(prod._id, null, prod.weight || "200g", 1)}
                          className="bg-[#C44100] text-white text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-[#F05A00] font-mono cursor-pointer"
                        >
                          + Add
                        </button>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Password & Security</h3>
                <p className="text-xs text-white/60">Change your password or manage authentication settings.</p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1 font-mono">Current Password</label>
                    <input type="password" required className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1 font-mono">New Password</label>
                    <input type="password" required className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white" />
                  </div>
                  <button type="submit" className="bg-[#C44100] text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-[#F05A00] uppercase tracking-wider font-mono">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </SectionReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
