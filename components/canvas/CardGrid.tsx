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
  const subtext = props?.subtext as string | undefined;
  const cardTitles = (props?.cardTitles as string)?.split("|").map((s) => s.trim()).filter(Boolean);
  const cardSubtexts = (props?.cardSubtexts as string)?.split("|").map((s) => s.trim()).filter(Boolean);
  const imageUrl = props?.imageUrl as string | undefined;
  const cardCount = Math.max(2, Math.min(6, Number(props?.cardCount) || 4));
  const fontSize = props?.fontSize ?? 18;
  const padding = props?.padding ?? 16;

  const titles = cardTitles && cardTitles.length >= cardCount
    ? cardTitles.slice(0, cardCount)
    : Array.from({ length: cardCount }, (_, i) => cardTitles?.[i] ?? `Card ${i + 1}`);
  const subtitles = cardSubtexts && cardSubtexts.length >= cardCount
    ? cardSubtexts.slice(0, cardCount)
    : Array.from({ length: cardCount }, () => "");

  return (
    <section
      className={`
        w-full transition-all cursor-pointer section-shell
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 18px`,
        fontSize: `${fontSize}px`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="section-title mb-1">{text}</h3>
      {subtext && <p className="text-slate-400 text-xs mb-3">{subtext}</p>}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-600/50 border border-white/5 p-4"
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={titles[i]}
                className="w-full h-14 object-cover rounded mb-2 border border-white/10"
                draggable={false}
              />
            )}
            <div className="h-2 w-8 rounded bg-accent/50 mb-2" />
            <p className="text-xs font-medium opacity-90">{titles[i]}</p>
            {subtitles[i] && <p className="text-[10px] opacity-70 mt-0.5">{subtitles[i]}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
