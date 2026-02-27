"use client";

export function BrandMark({ size = 18 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="absolute rounded-md bg-accent/90 rotate-12"
        style={{ width: size * 0.72, height: size * 0.72, left: 0, top: size * 0.2 }}
      />
      <span
        className="absolute rounded-md border border-accent-light/80 bg-accent-light/30 -rotate-12"
        style={{ width: size * 0.72, height: size * 0.72, right: 0, top: 0 }}
      />
    </span>
  );
}
