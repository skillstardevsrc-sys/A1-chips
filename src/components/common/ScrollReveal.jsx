import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Hook to detect prefers-reduced-motion user media setting
 */
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = () => setShouldReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return shouldReduceMotion;
};

// Preset variants dictionary
const variantPresets = {
  "fade-up": {
    initial: { opacity: 0, y: 35 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -35 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -35 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 35 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
  },
  "blur-to-clear": {
    initial: { opacity: 0, filter: "blur(12px)", y: 20 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  "clip-path": {
    initial: { opacity: 0, clipPath: "inset(12% 0 12% 0)" },
    animate: { opacity: 1, clipPath: "inset(0% 0 0% 0)" },
  },
};

/**
 * SectionReveal — Main repeatable section scroll-reveal wrapper.
 * EVERY section that enters the viewport (scrolling DOWN or UP) will replay its animation.
 */
export const SectionReveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  className = "",
  style = {},
  as = "section",
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.section;

  const preset = variantPresets[variant] || variantPresets["fade-up"];

  const initialVariant = shouldReduceMotion
    ? { opacity: 0 }
    : preset.initial;

  const animateVariant = shouldReduceMotion
    ? { opacity: 1 }
    : preset.animate;

  return (
    <Component
      initial={initialVariant}
      whileInView={animateVariant}
      viewport={{ once: false, amount }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Reveal — Block/card level repeatable scroll reveal component
 */
export const Reveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.5,
  amount = 0.15,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <SectionReveal
      as="div"
      variant={variant}
      delay={delay}
      duration={duration}
      amount={amount}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </SectionReveal>
  );
};

/**
 * StaggerContainer — Container for staggered repeatable scroll reveals
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  amount = 0.15,
  className = "",
  style = {},
  as = "div",
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <Component
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount }}
      variants={containerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * StaggerItem — Child element inside a StaggerContainer
 */
export const StaggerItem = ({
  children,
  variant = "fade-up",
  duration = 0.5,
  className = "",
  style = {},
  as = "div",
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;
  const preset = variantPresets[variant] || variantPresets["fade-up"];

  const itemVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : preset.initial,
    animate: shouldReduceMotion
      ? { opacity: 1, transition: { duration: 0.25 } }
      : {
          ...preset.animate,
          transition: {
            duration,
            ease: [0.25, 0.1, 0.25, 1.0],
          },
        },
  };

  return (
    <Component
      variants={itemVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * RevealText — Word-level repeatable text reveal animation
 */
export const RevealText = ({
  text = "",
  delay = 0,
  stagger = 0.03,
  className = "",
  as = "h2",
}) => {
  const Component = motion[as] || motion.h2;
  const words = text.split(" ");

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    initial: { opacity: 0, y: 20, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <Component
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={wordVariants} className="inline-block">
          {word}
        </motion.span>
      ))}
    </Component>
  );
};

/**
 * RevealImage — Clip-path / scale reveal wrapper for brand imagery
 */
export const RevealImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  aspectRatio = "aspect-square",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${imgClassName}`}
      />
    </motion.div>
  );
};

/**
 * ParallaxElement — Lightweight scroll parallax effect (decoupled from scroll-jacking)
 */
export const ParallaxElement = ({
  children,
  offset = 30,
  className = "",
  style = {},
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  return (
    <motion.div style={{ y: smoothY, ...style }} className={className}>
      {children}
    </motion.div>
  );
};

export default {
  SectionReveal,
  Reveal,
  StaggerContainer,
  StaggerItem,
  RevealText,
  RevealImage,
  ParallaxElement,
  useReducedMotion,
};
