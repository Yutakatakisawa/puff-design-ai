"use client";

import { type ComponentProps } from "@/lib/types";

interface FooterProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Footer({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FooterProps) {
  const text = props?.text ?? "© 2025 Your Company";
  const fontSize = props?.fontSize ?? 12;
  const padding = props?.padding ?? 16;

  return (
    <footer
      className={`
        w-full border-t border-white/5 transition-all cursor-pointer
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 16px`,
        fontSize: `${fontSize}px`,
        color: "rgba(226, 232, 240, 0.6)",
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {text}
    </footer>
  );
}
