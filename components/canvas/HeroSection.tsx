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
  const heroBadge = props?.heroBadge as string | undefined;
  const heroTags = (props?.heroTags as string)?.split("|").map((s) => s.trim()).filter(Boolean);
  const imageUrl = props?.imageUrl as string | undefined;
  const fontSize = props?.fontSize ?? 28;
  const padding = props?.padding ?? 24;
  const backgroundColor = props?.backgroundColor ?? "#1e1b4b";

  return (
    <section
      className={`
        w-full text-center transition-all cursor-pointer section-shell
        ${isSelected ? "canvas-selection" : ""}
        ${isHovered && !isSelected ? "canvas-hover" : ""}
      `}
      style={{
        padding: `${padding}px 18px`,
        fontSize: `${fontSize}px`,
        background: `linear-gradient(165deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {heroBadge && (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/10 border border-white/20 text-[11px] text-slate-100 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {heroBadge}
        </div>
      )}
      {imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg max-w-full mx-auto">
          <img
            src={imageUrl}
            alt="hero visual"
            className="w-full h-36 object-cover"
            draggable={false}
          />
        </div>
      )}
      <h1 className="section-title font-bold leading-tight text-slate-50">{text}</h1>
      {subtext && (
        <p className="mt-2 section-subtitle max-w-sm mx-auto" style={{ fontSize: `${Math.min(fontSize * 0.5, 16)}px` }}>
          {subtext}
        </p>
      )}
      {heroTags && heroTags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {heroTags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/15 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
