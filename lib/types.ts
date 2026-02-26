export type LayoutBlockType =
  | "navbar"
  | "hero"
  | "features"
  | "cards"
  | "cta"
  | "footer";

export interface LayoutBlock {
  id: string;
  type: LayoutBlockType;
  props?: Record<string, unknown>;
}

export interface LayoutStructure {
  layout: LayoutBlock[];
}

export interface ComponentProps {
  text?: string;
  subtext?: string;
  buttonText?: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  fontSize?: number;
  [key: string]: unknown;
}

export interface TemplateItem {
  id: string;
  label: string;
  prompt: string;
  layout: LayoutStructure;
}
