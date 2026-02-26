"use client";

import { type ComponentProps } from "@/lib/types";

interface HeroSectionProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function HeroSection({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HeroSectionProps) {
  const text = props?.text ?? "Build something amazing";
  const subtext = props?.subtext ?? "AI-powered UI in seconds";
  const fontSize = props?.fontSize ?? 28;
  const padding = props?.padding ?? 24;
  const backgroundColor = props?.backgroundColor ?? "#1e1b4b";

  return (
    <section
      className={`
        w-full text-center transition-all cursor-pointer
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 16px`,
        fontSize: `${fontSize}px`,
        background: backgroundColor,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h1 className="font-bold leading-tight">{text}</h1>
      {subtext && (
        <p className="mt-2 text-sm opacity-80" style={{ fontSize: `${(fontSize * 0.5) | 0}px` }}>
          {subtext}
        </p>
      )}
    </section>
  );
}
