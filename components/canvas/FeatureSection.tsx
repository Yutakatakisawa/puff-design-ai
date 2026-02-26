"use client";

import { type ComponentProps } from "@/lib/types";

interface FeatureSectionProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function FeatureSection({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FeatureSectionProps) {
  const text = props?.text ?? "Features";
  const fontSize = props?.fontSize ?? 20;
  const padding = props?.padding ?? 20;

  return (
    <section
      className={`
        w-full transition-all cursor-pointer
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 16px`,
        fontSize: `${fontSize}px`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h2 className="font-semibold">{text}</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-white/5 p-3 text-xs"
          >
            Feature {i}
          </div>
        ))}
      </div>
    </section>
  );
}
