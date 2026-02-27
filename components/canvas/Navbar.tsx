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
  const logoText = props?.logoText ?? props?.text ?? "Brand";
  const navItems = (props?.navItems as string)?.split("|").map((s) => s.trim()).filter(Boolean)
    ?? [props?.text ?? "HOME", "MENU", "ABOUT", "ACCESS"];
  const fontSize = props?.fontSize ?? 14;
  const padding = props?.padding ?? 12;

  return (
    <header
      className={`
        w-full border-b border-white/5 transition-all cursor-pointer section-shell
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
      <div className="flex items-center justify-between">
        <span className="font-semibold tracking-wide">{logoText}</span>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
            <span key={item} className="opacity-90 hover:opacity-100 text-[13px]">{item}</span>
          ))}
        </nav>
      </div>
    </header>
  );
}
