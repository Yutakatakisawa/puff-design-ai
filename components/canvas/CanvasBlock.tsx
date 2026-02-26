"use client";

import type { LayoutBlock } from "@/lib/types";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { FeatureSection } from "./FeatureSection";
import { CardGrid } from "./CardGrid";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

const BLOCK_MAP = {
  navbar: Navbar,
  hero: HeroSection,
  features: FeatureSection,
  cards: CardGrid,
  cta: CTASection,
  footer: Footer,
} as const;

interface CanvasBlockProps {
  block: LayoutBlock;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export function CanvasBlock({
  block,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: CanvasBlockProps) {
  const Component = BLOCK_MAP[block.type as keyof typeof BLOCK_MAP];
  if (!Component) return null;

  return (
    <Component
      id={block.id}
      props={block.props}
      isSelected={isSelected}
      isHovered={isHovered}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    />
  );
}
