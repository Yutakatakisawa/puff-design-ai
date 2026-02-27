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
  const subtext = props?.subtext;
  const featureItems = (props?.featureItems as string)?.split("|").map((s) => s.trim()).filter(Boolean);
  const featureDescs = (props?.featureDescs as string)?.split("|").map((s) => s.trim()).filter(Boolean);
  const fontSize = props?.fontSize ?? 20;
  const padding = props?.padding ?? 20;
  const fallbackItems = subtext ? subtext.split(/[・|、]/).map((s) => s.trim()).filter(Boolean) : ["Feature 1", "Feature 2", "Feature 3"];
  const features = featureItems?.length
    ? featureItems.map((title, i) => ({ title, desc: featureDescs?.[i] ?? "" }))
    : fallbackItems.map((f) => ({ title: f, desc: "" }));

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
      <h2 className="section-title">{text}</h2>
      {subtext && <p className="section-subtitle mt-1">{subtext}</p>}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {features.slice(0, 6).map((f, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs"
          >
            <span className="font-medium block">{f.title}</span>
            {f.desc ? <span className="opacity-80 mt-1 block text-[11px]">{f.desc}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
