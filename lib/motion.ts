export const MOTION = {
  spring: {
    type: "spring" as const,
    stiffness: 340,
    damping: 28,
    mass: 0.75,
  },
  smooth: {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

