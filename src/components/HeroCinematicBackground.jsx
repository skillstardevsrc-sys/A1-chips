import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroThemes } from "../data/heroThemes";
import { chips } from "../data/chips";

const HeroCinematicBackground = ({ activeIndex }) => {
  const chip = chips[activeIndex];
  const themeKey = chip.id || "masala";
  const theme = heroThemes[themeKey] || heroThemes.masala;
  const canvasRef = useRef(null);

  // Layer 5: Dynamic Particle Engine (GPU-Optimized Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle count: 35 for desktop, reduced for mobile
    const particleCount = width < 768 ? 18 : 35;
    const colors = theme.particleColors;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1.2,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeKey]);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden transition-colors duration-1000 ease-in-out pointer-events-none select-none z-0"
      style={{ backgroundColor: theme.baseBg }}
    >
      {/* LAYER 1: BASE ATMOSPHERIC GRADIENT TRANSITION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`layer1-${themeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{ background: theme.glowCenter }}
        />
      </AnimatePresence>

      {/* LAYER 2: SECONDARY AMBIENT CORNER GLOW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`layer2-${themeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{ background: theme.glowSecondary }}
        />
      </AnimatePresence>

      {/* LAYER 3: VOLUMETRIC SMOKE & HAZE DRIFT */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -15, 10, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{ backgroundColor: theme.smokeColor }}
      />

      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ backgroundColor: theme.smokeColor }}
      />

      {/* LAYER 4: SPOTLIGHT LIGHT BEAMS FILTER */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* LAYER 5: CANVAS PARTICLES & EMBERS ENGINE */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      {/* LAYER 6: PRODUCT SPOTLIGHT HALO */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`spotlight-${themeKey}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/4 w-[480px] h-[480px] rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: theme.platformGlow }}
        />
      </AnimatePresence>

      {/* LAYER 7: GROUND / STUDIO PLATFORM TEXTURE & SHADOW */}
      <div className="absolute bottom-0 left-0 right-0 h-44 z-10 pointer-events-none overflow-hidden flex flex-col justify-end">
        {/* Contact Shadow & Platform Surface */}
        <div className="w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/5 relative">
          {/* Environmental Floor Reflection Glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-16 blur-2xl opacity-60 transition-all duration-1000"
            style={{ background: theme.platformReflect }}
          />
        </div>
      </div>

      {/* LAYER 8: DARK CINEMATIC VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_85%,rgba(0,0,0,0.92)_100%)] z-20 pointer-events-none" />
    </div>
  );
};

export default HeroCinematicBackground;
