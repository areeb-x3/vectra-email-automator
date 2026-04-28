export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemFadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const cardHover = {
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const buttonHover = {
  hover: {
    scale: 1.03,
    boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: "easeIn" }
  }
};

export const glowAnimation = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
