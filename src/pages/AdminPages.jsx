import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaChartLine, FaBox, FaShoppingBag, FaUsers, FaTag, FaStar, FaCog, FaPlus, FaTrashAlt, FaEdit, FaTruck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../services/api";
import { SectionReveal, Reveal } from "../components/common/ScrollReveal";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    sku: "",
    price: 120,
    compareAtPrice: 140,
    weight: "200g",
    stock: 100,
    category: "cat_02",
    shortDescription: "",
    spiceLevel: "Medium",
  });

  // Status update modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("shipped");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchAdminData();
  }, [activeTab, isAuthenticated]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await api.get("/admin/metrics");
        setMetrics(res.data);
      } else if (activeTab === "products") {
        const res = await api.get("/products?limit=50");
        setProducts(res.data?.products || []);
      } else if (activeTab === "orders") {
        const res = await api.get("/orders/admin/all");
        setOrders(res.data?.orders || []);
      } else if (activeTab === "customers") {
        const res = await api.get("/admin/customers");
        setCustomers(res.data?.customers || []);
      } else if (activeTab === "coupons") {
        const res = await api.get("/coupons/admin");
        setCoupons(res.data?.coupons || []);
      } else if (activeTab === "reviews") {
        const res = await api.get("/reviews/admin");
        setReviews(res.data?.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...productForm,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, "-"),
        variants: [
          { weight: "100g", sku: `${productForm.sku}-100`, price: Math.round(productForm.price * 0.6), stock: 100 },
          { weight: productForm.weight, sku: productForm.sku, price: productForm.price, stock: productForm.stock },
        ],
      });
      setIsProductModalOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.put(`/orders/admin/status/${selectedOrder._id}`, {
        orderStatus: updateStatus,
        shipmentStatus: `Shipment updated to ${updateStatus.toUpperCase()}`,
        trackingNumber: trackingNumber || selectedOrder.trackingNumber || "BD-893421-IN",
      });
      setSelectedOrder(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Header */}
        <Reveal variant="fade-down" amount={0.1} className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black font-montserrat tracking-tight">Admin Operations Control</h1>
            <p className="text-xs text-white/60">Platform inventory, orders, customers, and analytics management.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#C44100]/30 text-[#FFC02D] border border-[#C44100]/50 uppercase font-mono">
            Logged as Admin
          </span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <Reveal variant="fade-right" amount={0.1} className="bg-[#14090C] border border-white/10 rounded-3xl p-4 space-y-1 h-fit shadow-2xl">
            {[
              { key: "overview", label: "Dashboard Overview", icon: FaChartLine },
              { key: "products", label: "Product Catalogue", icon: FaBox },
              { key: "orders", label: "Orders & Shipping", icon: FaShoppingBag },
              { key: "customers", label: "Customers", icon: FaUsers },
              { key: "coupons", label: "Coupons Engine", icon: FaTag },
              { key: "reviews", label: "Reviews Moderation", icon: FaStar },
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
          </Reveal>

          {/* Main Area */}
          <SectionReveal variant="fade-up" amount={0.1} className="lg:col-span-4 bg-[#14090C] border border-white/10 rounded-3xl p-6 min-h-[500px] shadow-2xl">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Performance Overview</h3>

                {metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-xs text-white/50 block mb-1">Total Revenue</span>
                      <span className="text-xl font-black text-[#FFC02D] font-mono">₹{metrics.totalRevenue}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-xs text-white/50 block mb-1">Total Orders</span>
                      <span className="text-xl font-black text-white font-mono">{metrics.totalOrders}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-xs text-white/50 block mb-1">Total Customers</span>
                      <span className="text-xl font-black text-white font-mono">{metrics.totalCustomers}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-xs text-white/50 block mb-1">Products Listed</span>
                      <span className="text-xl font-black text-white font-mono">{metrics.totalProducts}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold font-montserrat text-white">Product Catalogue</h3>
                  <button
                    onClick={() => setIsProductModalOpen(true)}
                    className="bg-[#C44100] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#F05A00] flex items-center gap-1.5 font-mono cursor-pointer"
                  >
                    <FaPlus size={10} /> Add New Chip Product
                  </button>
                </div>

                <div className="divide-y divide-white/10">
                  {products.map((prod) => (
                    <div key={prod._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={prod.thumbnail || "/masala_munch-removebg-preview.png"} alt="" className="w-10 h-10 object-contain bg-white/5 rounded-xl p-1" />
                        <div>
                          <p className="font-bold text-white font-montserrat">{prod.name}</p>
                          <p className="text-white/50 font-mono">SKU: {prod.sku} · Stock: {prod.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="font-mono font-bold text-[#FFC02D]">₹{prod.price}</span>
                        <button onClick={() => handleDeleteProduct(prod._id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                          <FaTrashAlt size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Orders & Dispatch Control</h3>
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord._id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-mono font-bold text-sm text-[#FFC02D]">{ord.orderNumber}</p>
                        <p className="text-white/70">{ord.customerName} ({ord.customerPhone})</p>
                        <p className="text-white/50 font-mono">Total: ₹{ord.total} · {ord.paymentMethod}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                          {ord.orderStatus}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setUpdateStatus(ord.orderStatus);
                          }}
                          className="bg-white/10 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-white/20 flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <FaTruck size={10} /> Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "customers" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Registered Customers</h3>
                <div className="divide-y divide-white/10 text-xs">
                  {customers.map((c) => (
                    <div key={c._id} className="py-3 flex justify-between">
                      <div>
                        <p className="font-bold text-white font-montserrat">{c.name}</p>
                        <p className="text-white/50">{c.email} · {c.phone || "No phone"}</p>
                      </div>
                      <span className="text-[#FFC02D] font-mono font-bold">Role: {c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "coupons" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Active Coupons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div key={c._id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                      <p className="font-mono font-black text-sm text-[#FFC02D]">{c.code}</p>
                      <p className="text-white/70">Type: {c.type} · Value: {c.value}</p>
                      <p className="text-white/50 font-mono">Min Order: ₹{c.minimumOrder || 0} · Used: {c.usedCount} times</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-montserrat text-white border-b border-white/10 pb-3">Customer Reviews Moderation</h3>
                <div className="space-y-3 text-xs">
                  {reviews.map((r) => (
                    <div key={r._id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <p className="font-bold text-white font-montserrat">{r.userName} on {r.product?.name || "Product"}</p>
                      <p className="text-white/70">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionReveal>
        </div>
      </main>

      {/* New Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#180B0E] border border-white/15 rounded-3xl p-6 w-full max-w-lg text-white">
            <h3 className="font-extrabold text-base mb-4 font-montserrat">Create New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-mono">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-mono">SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-mono">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-mono">Short Description</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 font-mono">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/10 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#C44100] text-white font-bold cursor-pointer">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#180B0E] border border-white/15 rounded-3xl p-6 w-full max-w-md text-white">
            <h3 className="font-extrabold text-base mb-2 font-montserrat">Update Order #{selectedOrder.orderNumber}</h3>
            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-mono">Select New Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white"
                >
                  <option value="confirmed" className="bg-[#12080A]">Confirmed</option>
                  <option value="processing" className="bg-[#12080A]">Processing & Packing</option>
                  <option value="packed" className="bg-[#12080A]">Packed</option>
                  <option value="shipped" className="bg-[#12080A]">Shipped / In Transit</option>
                  <option value="out_for_delivery" className="bg-[#12080A]">Out for Delivery</option>
                  <option value="delivered" className="bg-[#12080A]">Delivered</option>
                  <option value="cancelled" className="bg-[#12080A]">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-mono">Carrier Tracking ID</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-893421-IN"
                  className="w-full bg-white/10 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 font-mono">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-xl bg-white/10 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#C44100] text-white font-bold cursor-pointer">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
