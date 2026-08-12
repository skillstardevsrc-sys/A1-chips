import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HeroCinematicBackground from "../components/HeroCinematicBackground";
import TrustBar from "../components/TrustBar";
import FindYourCrunch from "../components/FindYourCrunch";
import BestsellerShowcase from "../components/BestsellerShowcase";
import IngredientStory from "../components/IngredientStory";
import WatchTheCrunch from "../components/WatchTheCrunch";
import BuildSnackBox from "../components/BuildSnackBox";
import SignatureCombos from "../components/SignatureCombos";
import GlobalShipping from "../components/GlobalShipping";
import CustomerLove from "../components/CustomerLove";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative min-h-screen font-poppins text-white bg-[#0A0405]">
      {/* Hero Container with 8-Layer Cinematic Environment */}
      <div className="relative overflow-hidden w-full min-h-screen flex flex-col justify-between">
        <HeroCinematicBackground activeIndex={activeIndex} />

        <div className="relative z-10 flex flex-col min-h-screen justify-between">
          <Navbar />
          <div className="flex-1 w-full flex flex-col justify-center py-4">
            <HeroSection activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </div>
        </div>
      </div>

      {/* Continuation Sections */}
      <main className="relative z-20 bg-[#0A0405] pb-16 lg:pb-0">
        <TrustBar />
        <FindYourCrunch />
        <BestsellerShowcase />
        <IngredientStory />
        <WatchTheCrunch />
        <BuildSnackBox />
        <SignatureCombos />
        <GlobalShipping />
        <CustomerLove />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
