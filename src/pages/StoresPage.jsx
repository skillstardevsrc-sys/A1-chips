import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoreLocatorDashboard from "../components/StoreLocatorDashboard";

const StoresPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0405] text-white flex flex-col font-poppins">
      <Navbar />
      <main className="flex-1">
        <StoreLocatorDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default StoresPage;
