export type LayoutBlockType =
  | "navbar"
  | "hero"
  | "features"
  | "cards"
  | "cta"
  | "footer";

export type PreviewMode = "mobile" | "desktop";
export type DesignMode = "app" | "web";

export interface LayoutBlock {
  id: string;
  type: LayoutBlockType;
  props?: Record<string, unknown>;
}

export interface LayoutStructure {
  layout: LayoutBlock[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface ComponentProps {
  text?: string;
  subtext?: string;
  buttonText?: string;
  imageUrl?: string;
  color?: string;
  backgroundColor?: string;
  padding?: number;
  fontSize?: number;
  /** Navbar: brand name */
  logoText?: string;
  /** Navbar: pipe-separated nav items e.g. "HOME|MENU|ABOUT" */
  navItems?: string;
  /** Hero: badge label */
  heroBadge?: string;
  /** Hero: pipe-separated tags */
  heroTags?: string;
  /** Features: pipe-separated item titles */
  featureItems?: string;
  /** Features: pipe-separated item descriptions */
  featureDescs?: string;
  /** Cards: pipe-separated card titles */
  cardTitles?: string;
  /** Cards: pipe-separated card subtitles */
  cardSubtexts?: string;
  cardCount?: number;
  [key: string]: unknown;
}

export interface TemplateItem {
  id: string;
  label: string;
  prompt: string;
  layout: LayoutStructure;
}
