"use client";

import { type ComponentProps } from "@/lib/types";

interface CTASectionProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CTASection({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CTASectionProps) {
  const text = props?.text ?? "Get started today";
  const buttonText = props?.buttonText ?? "Start free trial";
  const fontSize = props?.fontSize ?? 22;
  const padding = props?.padding ?? 32;
  const backgroundColor = props?.backgroundColor ?? "#6d28d9";

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
      <h2 className="font-bold">{text}</h2>
      <button
        type="button"
        className="mt-4 px-6 py-2.5 rounded-lg bg-white/20 font-medium text-sm hover:bg-white/30 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {buttonText}
      </button>
    </section>
  );
}
