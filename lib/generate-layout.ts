import type { LayoutStructure, LayoutBlockType } from "./types";

const BLOCK_PROPS: Record<LayoutBlockType, Record<string, unknown>> = {
  navbar: { text: "Navbar", fontSize: 14, padding: 12 },
  hero: {
    text: "Build something amazing",
    subtext: "AI-powered UI in seconds",
    fontSize: 28,
    padding: 24,
    backgroundColor: "#1e1b4b",
  },
  features: {
    text: "Features",
    fontSize: 20,
    padding: 20,
  },
  cards: {
    text: "Cards",
    fontSize: 18,
    padding: 16,
  },
  cta: {
    text: "Get started today",
    buttonText: "Start free trial",
    fontSize: 22,
    padding: 32,
    backgroundColor: "#6d28d9",
  },
  footer: {
    text: "© 2025 Your Company",
    fontSize: 12,
    padding: 16,
  },
};

const TEMPLATES: Record<string, LayoutBlockType[]> = {
  landing: ["navbar", "hero", "features", "cards", "cta", "footer"],
  dashboard: ["navbar", "hero", "cards", "cards", "footer"],
  mobile: ["navbar", "hero", "cards", "cta", "footer"],
  minimal: ["hero", "cta", "footer"],
};

function detectTemplate(prompt: string): LayoutBlockType[] {
  const lower = prompt.toLowerCase();
  if (lower.includes("dashboard") || lower.includes("saas")) return TEMPLATES.dashboard;
  if (lower.includes("mobile") || lower.includes("app")) return TEMPLATES.mobile;
  if (lower.includes("minimal") || lower.includes("simple")) return TEMPLATES.minimal;
  return TEMPLATES.landing;
}

export function generateLayoutFromPrompt(prompt: string): Promise<LayoutStructure> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const types = detectTemplate(prompt);
      const layout = types.map((type, i) => ({
        id: `${type}-${Date.now()}-${i}`,
        type,
        props: { ...BLOCK_PROPS[type] },
      }));
      resolve({ layout });
    }, 800);
  });
}

export function getTemplates(): { id: string; label: string; prompt: string; layout: LayoutStructure }[] {
  return [
    {
      id: "landing",
      label: "Landing page",
      prompt: "Roofing company landing page",
      layout: {
        layout: TEMPLATES.landing.map((type, i) => ({
          id: `template-landing-${type}-${i}`,
          type,
          props: { ...BLOCK_PROPS[type] },
        })),
      },
    },
    {
      id: "dashboard",
      label: "SaaS dashboard",
      prompt: "SaaS dashboard",
      layout: {
        layout: TEMPLATES.dashboard.map((type, i) => ({
          id: `template-dashboard-${type}-${i}`,
          type,
          props: { ...BLOCK_PROPS[type] },
        })),
      },
    },
    {
      id: "mobile",
      label: "Mobile app homepage",
      prompt: "Mobile app homepage",
      layout: {
        layout: TEMPLATES.mobile.map((type, i) => ({
          id: `template-mobile-${type}-${i}`,
          type,
          props: { ...BLOCK_PROPS[type] },
        })),
      },
    },
  ];
}
