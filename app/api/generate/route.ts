import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DesignMode, LayoutBlockType, LayoutStructure } from "@/lib/types";
import { generateLayoutVariants } from "@/lib/generate-layout";

type GenerateRequest = {
  prompt?: string;
  mode?: DesignMode;
  count?: number;
};

type GeminiBlock = {
  type: LayoutBlockType;
  props?: Record<string, unknown>;
};

type GeminiResponse = {
  variants: Array<{
    layout: GeminiBlock[];
  }>;
};

const ALLOWED_TYPES: LayoutBlockType[] = ["navbar", "hero", "features", "cards", "cta", "footer"];

function sanitizeJson(text: string): string {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function normalizeVariants(payload: GeminiResponse): LayoutStructure[] {
  return payload.variants.map((variant, variantIndex) => ({
    layout: variant.layout
      .filter((b) => ALLOWED_TYPES.includes(b.type))
      .map((block, i) => ({
        id: `${block.type}-${Date.now()}-${variantIndex}-${i}`,
        type: block.type,
        props: block.props ?? {},
      })),
  }));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const prompt = body.prompt?.trim();
    const mode: DesignMode = body.mode === "web" ? "web" : "app";
    const count = Math.max(1, Math.min(body.count ?? 3, 4));

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const variants = await generateLayoutVariants(prompt, count, mode);
      return NextResponse.json({ variants, source: "fallback" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const schemaHint = `{
  "variants": [{
    "layout": [
      { "type": "navbar", "props": { "logoText": "Brand", "navItems": "HOME|MENU|ABOUT|CONTACT" } },
      { "type": "hero", "props": { "text": "Headline", "subtext": "Supporting text", "heroBadge": "Badge label", "heroTags": "Tag1|Tag2|Tag3", "imageUrl": "https://..." } },
      { "type": "features", "props": { "text": "Section title", "subtext": "Intro", "featureItems": "Item1|Item2|Item3|Item4", "featureDescs": "Desc1|Desc2|Desc3|Desc4" } },
      { "type": "cards", "props": { "text": "Section title", "subtext": "Intro", "cardTitles": "Card1|Card2|Card3|Card4", "cardSubtexts": "Sub1|Sub2|Sub3|Sub4", "cardCount": 4, "imageUrl": "https://..." } },
      { "type": "cta", "props": { "text": "CTA headline", "subtext": "Supporting line", "buttonText": "Button" } },
      { "type": "footer", "props": { "text": "© 2026 Brand", "subtext": "Address or links" } }
    ]
  }]
}`;

    const instruction = [
      "You are an expert UI/UX designer. Create Stitch-level, production-ready landing layouts.",
      "Return ONLY valid JSON with no markdown, no comments, no extra text.",
      `Generate exactly ${count} distinct variants. Each variant = 4–6 sections in layout array.`,
      `Design mode: "${mode}" (app = mobile-first, web = desktop-first).`,
      "",
      "RICH PROPS (use pipe | to separate multiple items):",
      "- navbar: logoText, navItems (e.g. HOME|MENU|ABOUT|ACCESS|CONTACT)",
      "- hero: text, subtext, heroBadge (short badge text), heroTags (Tag1|Tag2|Tag3), imageUrl (Unsplash)",
      "- features: text, subtext, featureItems (Item1|Item2|Item3|Item4), featureDescs (matching descs)",
      "- cards: text, subtext, cardTitles (Title1|Title2|Title3|Title4), cardSubtexts, cardCount: 4, imageUrl",
      "- cta: text, subtext, buttonText",
      "- footer: text, subtext",
      "",
      "Create realistic, industry-specific copy in Japanese. Match the prompt's theme exactly.",
      "Use high-quality Unsplash imageUrl for hero/cards. Keep colors in hex (#RRGGBB).",
      "",
      "Output schema:",
      schemaHint,
      "",
      `User prompt: ${prompt}`,
    ].join("\n");

    const result = await model.generateContent(instruction);
    const raw = result.response.text();
    const json = sanitizeJson(raw);
    const parsed = JSON.parse(json) as GeminiResponse;
    const variants = normalizeVariants(parsed);

    if (!variants.length) {
      const fallback = await generateLayoutVariants(prompt, count, mode);
      return NextResponse.json({ variants: fallback, source: "fallback-empty" });
    }

    return NextResponse.json({ variants, source: "gemini" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

