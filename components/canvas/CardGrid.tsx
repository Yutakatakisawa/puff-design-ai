"use client";

import { type ComponentProps } from "@/lib/types";

interface CardGridProps {
  id: string;
  props?: ComponentProps;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CardGrid({
  props,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CardGridProps) {
  const text = props?.text ?? "Cards";
  const fontSize = props?.fontSize ?? 18;
  const padding = props?.padding ?? 16;

  return (
    <section
      className={`
        w-full transition-all cursor-pointer
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px`,
        fontSize: `${fontSize}px`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="mb-3 font-medium">{text}</h3>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-600/50 border border-white/5 p-4"
          >
            <div className="h-2 w-8 rounded bg-accent/50 mb-2" />
            <p className="text-xs opacity-80">Card {i}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
