"use client";

import { type ComponentProps } from "@/lib/types";

interface NavbarProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Navbar({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: NavbarProps) {
  const text = props?.text ?? "Navbar";
  const fontSize = props?.fontSize ?? 14;
  const padding = props?.padding ?? 12;

  return (
    <header
      className={`
        w-full border-b border-white/5 transition-all cursor-pointer
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 16px`,
        fontSize: `${fontSize}px`,
        background: "rgba(30, 27, 75, 0.5)",
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="font-medium">{text}</span>
    </header>
  );
}
