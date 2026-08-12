import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaDirections,
  FaCrosshairs,
  FaSearch,
  FaFilter,
  FaStar,
  FaStore,
  FaCheckCircle,
  FaTrophy,
  FaCompass,
} from "react-icons/fa";
import { storesData } from "../data/storesData";
import { SectionReveal, Reveal } from "./common/ScrollReveal";

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

const cityCenters = {
  Coimbatore: { lat: 11.0168, lng: 76.9558, name: "Coimbatore City Center" },
  Chennai: { lat: 13.0827, lng: 80.2707, name: "Chennai City Center" },
  Tirupur: { lat: 11.1085, lng: 77.3411, name: "Tirupur Town" },
  Erode: { lat: 11.3412, lng: 77.7125, name: "Erode Center" },
  Salem: { lat: 11.6643, lng: 78.1460, name: "Salem Center" },
  Madurai: { lat: 9.9252, lng: 78.1198, name: "Madurai Center" },
  Dindigul: { lat: 10.3625, lng: 77.9685, name: "Dindigul Center" },
  Hosur: { lat: 12.7368, lng: 77.8285, name: "Hosur Center" },
  Palakkad: { lat: 10.7691, lng: 76.6570, name: "Palakkad Center" },
  Bengaluru: { lat: 12.9716, lng: 77.5946, name: "Bengaluru Center" },
};

const regionsList = [
  { name: "All Outlets (55)", key: "All" },
  { name: "Coimbatore (27)", key: "Coimbatore" },
  { name: "Chennai (11)", key: "Chennai" },
  { name: "Other Tamil Nadu (11)", key: "Other Tamil Nadu" },
  { name: "Kerala (3)", key: "Kerala" },
  { name: "Karnataka (2)", key: "Karnataka" },
  { name: "Corporate Office", key: "Corporate Office" },
];

const StoreLocatorDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(storesData[0]);
  const [userCoords, setUserCoords] = useState(null);
  const [activeLocationLabel, setActiveLocationLabel] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");

  const [mapCenter, setMapCenter] = useState({ lat: storesData[0].lat, lng: storesData[0].lng, zoom: 15 });

  const handleLocateUser = () => {
    setIsGeolocating(true);
    setGeoStatus("Requesting GPS coordinates...");

    if (!navigator.geolocation) {
      setGeoStatus("Browser Geolocation unavailable. Using city center fallback.");
      setIsGeolocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setActiveLocationLabel("Your Live GPS Location");
        setGeoStatus("GPS Location Locked Successfully!");
        setIsGeolocating(false);

        let closest = null;
        let minDistance = Infinity;

        storesData.forEach((st) => {
          const dist = calculateDistanceKm(coords.lat, coords.lng, st.lat, st.lng);
          if (dist !== null && dist < minDistance) {
            minDistance = dist;
            closest = st;
          }
        });

        if (closest) {
          setSelectedStore(closest);
          setMapCenter({ lat: closest.lat, lng: closest.lng, zoom: 15 });
        }
      },
      (err) => {
        console.warn("GPS error/denied:", err.message);
        setGeoStatus("GPS access blocked/denied. Please choose your city below to find nearest stores.");
        setIsGeolocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSelectCityCenter = (cityName) => {
    const centerObj = cityCenters[cityName];
    if (centerObj) {
      setUserCoords({ lat: centerObj.lat, lng: centerObj.lng });
      setActiveLocationLabel(`Reference: ${centerObj.name}`);
      setGeoStatus(`Calculated distances from ${cityName} city center`);

      let closest = null;
      let minDistance = Infinity;

      storesData.forEach((st) => {
        const dist = calculateDistanceKm(centerObj.lat, centerObj.lng, st.lat, st.lng);
        if (dist !== null && dist < minDistance) {
          minDistance = dist;
          closest = st;
        }
      });

      if (closest) {
        setSelectedStore(closest);
        setMapCenter({ lat: closest.lat, lng: closest.lng, zoom: 15 });
      }
    }
  };

  const processedStores = storesData
    .filter((st) => {
      const matchRegion = selectedRegion === "All" || st.region === selectedRegion;
      const s = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        st.name.toLowerCase().includes(s) ||
        st.address.toLowerCase().includes(s) ||
        st.city.toLowerCase().includes(s) ||
        st.pincode.includes(s) ||
        st.phone.includes(s) ||
        st.amenities.some((a) => a.toLowerCase().includes(s));
      return matchRegion && matchSearch;
    })
    .map((st) => {
      const dist = userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, st.lat, st.lng) : null;
      return { ...st, distanceKm: dist };
    })
    .sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });

  const nearestStoreId = userCoords && processedStores.length > 0 ? processedStores[0].id : null;

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    setMapCenter({ lat: store.lat, lng: store.lng, zoom: 15 });
  };

  return (
    <SectionReveal
      as="div"
      variant="fade-up"
      amount={0.1}
      className="w-full bg-[#0E0507] text-white font-poppins min-h-screen py-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & High Precision Geolocation Button */}
        <Reveal variant="fade-down" amount={0.1} className="bg-gradient-to-r from-[#200A0E] via-[#350F14] to-[#200A0E] border border-white/15 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F05A00]/20 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFC02D] bg-[#C44100]/20 px-4 py-1.5 rounded-full border border-[#C44100]/40 inline-flex items-center gap-2 mb-3 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ACCURATE NEAREST STORE FINDER (55 OUTLETS)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight mb-3 text-white">
            Find Your <span className="text-[#FFC02D]">Nearest A1 Outlet</span>
          </h1>
          <p className="text-white/70 text-xs sm:text-sm max-w-3xl mx-auto mb-6">
            Click the button below to use your device GPS or select your city center to calculate exact distances in km to all 55 official A1 Chips outlets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleLocateUser}
              disabled={isGeolocating}
              className="bg-gradient-to-r from-[#F05A00] to-[#FFC02D] text-black font-black text-xs px-7 py-3.5 rounded-full hover:brightness-110 shadow-2xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer font-mono"
            >
              <FaCrosshairs className={isGeolocating ? "animate-spin" : ""} size={14} />
              {isGeolocating ? "Accessing GPS Coordinates..." : "🎯 FIND NEAREST STORE VIA GPS"}
            </button>

            {userCoords && (
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 font-mono shadow-md">
                <FaCheckCircle size={13} /> {activeLocationLabel} ({userCoords.lat.toFixed(3)}, {userCoords.lng.toFixed(3)})
              </span>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/50 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
              <FaCompass size={11} className="text-[#FFC02D]" /> City Quick Select:
            </span>
            {Object.keys(cityCenters).map((cityName) => (
              <button
                key={cityName}
                onClick={() => handleSelectCityCenter(cityName)}
                className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-1 text-[11px] text-white/80 transition-colors font-mono cursor-pointer"
              >
                {cityName}
              </button>
            ))}
          </div>

          {geoStatus && <p className="text-amber-300 text-xs mt-3 font-mono">{geoStatus}</p>}
        </Reveal>

        {/* Region Filters & Search Bar */}
        <div className="bg-[#14090C] border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1 font-mono">
              <FaFilter size={10} /> Region:
            </span>
            {regionsList.map((reg) => (
              <button
                key={reg.key}
                onClick={() => setSelectedRegion(reg.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-mono cursor-pointer ${
                  selectedRegion === reg.key
                    ? "bg-[#C44100] text-white shadow-lg border border-[#F05A00]"
                    : "bg-white/5 text-white/70 hover:bg-white/15"
                }`}
              >
                {reg.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <FaSearch className="absolute left-3.5 top-3 text-white/40" size={12} />
            <input
              type="text"
              placeholder="Search area, road, pincode, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F05A00]"
            />
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Outlets List Sidebar */}
          <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1 no-scrollbar">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
                {userCoords ? "Sorted by Nearest Proximity" : `Outlets Found (${processedStores.length})`}
              </span>
              {selectedRegion !== "All" && (
                <button onClick={() => setSelectedRegion("All")} className="text-xs text-[#FFC02D] hover:underline font-mono">
                  Show All 55 Outlets
                </button>
              )}
            </div>

            {processedStores.length === 0 ? (
              <div className="bg-[#14090C] border border-white/10 rounded-2xl p-8 text-center text-white/60">
                <p className="font-bold text-sm text-white mb-1">No outlets found matching query.</p>
                <p className="text-xs">Try selecting 'All Outlets' or clearing your search term.</p>
              </div>
            ) : (
              processedStores.map((store) => {
                const isSelected = selectedStore?.id === store.id;
                const isNearest = nearestStoreId === store.id;

                return (
                  <motion.div
                    key={store.id}
                    onClick={() => handleSelectStore(store)}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isNearest
                        ? "bg-gradient-to-r from-[#200A0E] via-[#350F14] to-[#2A0A0F] border-emerald-400 shadow-2xl ring-2 ring-emerald-500/60"
                        : isSelected
                        ? "bg-gradient-to-r from-[#200A0E] via-[#2A0E13] to-[#1F0A0E] border-[#F05A00] shadow-2xl ring-1 ring-[#F05A00]/50"
                        : "bg-[#14090C] border-white/10 hover:border-white/25 hover:bg-white/5"
                    }`}
                  >
                    {isNearest && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl rounded-tl-xl absolute top-0 left-0 flex items-center gap-1.5 shadow-lg font-mono">
                        <FaTrophy size={11} /> 🏆 NEAREST OUTLET TO YOU
                      </div>
                    )}

                    <div className={`flex items-start justify-between gap-3 mb-2 ${isNearest ? "pt-4" : ""}`}>
                      <div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#C44100]/25 text-[#FFC02D] border border-[#C44100]/50 inline-block mb-1.5 font-mono">
                          {store.badge}
                        </span>
                        <h3 className="font-extrabold text-sm sm:text-base text-white font-montserrat flex items-center gap-2">
                          <FaStore className="text-[#FFC02D]" size={14} /> {store.name}
                        </h3>
                      </div>

                      {store.distanceKm !== null && (
                        <span className={`text-[11px] font-black font-mono px-3 py-1 rounded-full whitespace-nowrap border ${
                          isNearest ? "bg-emerald-500 text-black border-emerald-400 shadow-lg" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        }`}>
                          📍 {store.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/80 mb-3 flex items-start gap-2 leading-relaxed">
                      <FaMapMarkerAlt className="text-[#F05A00] shrink-0 mt-0.5" size={12} />
                      <span>{store.address} - PIN: {store.pincode}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <FaClock className="text-amber-400" size={10} />
                        <span className="text-[11px] truncate">{store.hours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <FaStar className="text-amber-400" size={10} />
                        <span className="font-bold text-white text-[11px]">{store.rating}</span>
                        <span className="text-white/40 text-[10px]">({store.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/70 mb-3 pt-2 border-t border-white/10 font-mono">
                      <span className="text-[#FFC02D] font-bold flex items-center gap-1">
                        <FaPhoneAlt size={10} /> Ph: {store.phone}
                      </span>
                      <a
                        href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-lg"
                      >
                        Call Now
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {store.amenities?.map((am, idx) => (
                        <span
                          key={idx}
                          className="bg-white/5 border border-white/10 text-[10px] px-2 py-0.5 rounded-md text-white/70"
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                      <a
                        href={store.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#C44100] hover:bg-[#F05A00] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md font-mono"
                      >
                        <FaDirections size={12} /> Open Official Google Map
                      </a>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Embedded Live Map Tracking Canvas */}
          <div className="lg:col-span-7 bg-[#14090C] border border-white/15 rounded-3xl p-4 shadow-2xl flex flex-col min-h-[680px] relative overflow-hidden">
            <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white font-montserrat uppercase tracking-wider">
                  In-Site Live Tracker — {selectedStore?.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                {selectedStore?.region} | {selectedStore?.city}
              </span>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#070304] min-h-[520px]">
              <iframe
                title="A1 Chips Live Map Tracker"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${selectedStore?.lat},${selectedStore?.lng}&hl=en&z=${mapCenter.zoom}&output=embed`}
              />

              {/* Floating Bottom Card Banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#14090C]/95 border border-white/20 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C44100]/20 border border-[#C44100]/40 flex items-center justify-center text-[#FFC02D]">
                    <FaStore size={22} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#FFC02D] tracking-widest block font-mono">
                      SELECTED OUTLET
                    </span>
                    <h4 className="font-extrabold text-sm text-white font-montserrat">{selectedStore?.name}</h4>
                    <p className="text-[11px] text-white/70 line-clamp-1">{selectedStore?.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${selectedStore?.phone?.replace(/[^0-9+]/g, "")}`}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 font-mono"
                  >
                    <FaPhoneAlt size={10} /> {selectedStore?.phone}
                  </a>
                  <a
                    href={selectedStore?.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#C44100] hover:bg-[#F05A00] text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono"
                  >
                    <FaDirections size={12} /> Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default StoreLocatorDashboard;
