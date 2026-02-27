"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Layout, LayoutDashboard, Smartphone, Layers } from "lucide-react";
import type { ComponentProps, LayoutStructure } from "@/lib/types";
import { useCanvasStore } from "@/lib/store";
import { generateLayoutVariants, getTemplates } from "@/lib/generate-layout";

export function LeftPanel() {
  const [prompt, setPrompt] = useState("");
  const {
    setLayout,
    setVariants,
    setActiveVariant,
    activeVariant,
    variants,
    setIsGenerating,
    layout,
    selectedId,
    setSelectedId,
    setSelectedProps,
    designMode,
  } = useCanvasStore();
  const templates = getTemplates();
  const blocks = layout.layout;

  const generateWithGemini = async (basePrompt: string): Promise<LayoutStructure[]> => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: basePrompt,
        mode: designMode,
        count: 3,
      }),
    });
    if (!res.ok) {
      throw new Error(`Generate API failed: ${res.status}`);
    }
    const data = (await res.json()) as { variants?: LayoutStructure[] };
    if (!data.variants?.length) {
      throw new Error("No variants returned");
    }
    return data.variants;
  };

  const handleGenerate = async (rawPrompt?: string) => {
    const basePrompt = (rawPrompt ?? prompt).trim();
    if (!basePrompt) return;
    setIsGenerating(true);
    try {
      let generatedVariants: LayoutStructure[];
      try {
        generatedVariants = await generateWithGemini(basePrompt);
      } catch {
        generatedVariants = await generateLayoutVariants(basePrompt, 3, designMode);
      }
      setVariants(generatedVariants);
      if (rawPrompt) setPrompt(basePrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyTemplate = (layout: LayoutStructure) => {
    setLayout(layout);
  };

  const templateIcons = [
    <Layout key="1" className="w-4 h-4" />,
    <LayoutDashboard key="2" className="w-4 h-4" />,
    <Smartphone key="3" className="w-4 h-4" />,
  ];

  return (
    <div className="glass-panel w-80 flex flex-col h-full rounded-r-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">デザインを説明してください</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: 屋根工事店向けのLP。赤基調で信頼感ある雰囲気。"
          className="w-full h-32 px-3 py-3 rounded-xl bg-surface-700/80 border border-accent/30 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="mt-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerate()}
            disabled={!prompt.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            デザイン生成
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {variants.length > 1 && (
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
              AI案（複数パターン）
            </label>
            <div className="grid grid-cols-3 gap-2">
              {variants.map((_, i) => (
                <button
                  key={`variant-${i}`}
                  type="button"
                  onClick={() => setActiveVariant(i)}
                  className={`rounded-lg px-2 py-1.5 text-xs border transition-colors ${
                    activeVariant === i
                      ? "bg-accent/20 border-accent/40 text-accent-light"
                      : "bg-surface-700/40 border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  案 {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {blocks.length > 0 && (
          <details className="group" open>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Layers className="w-3.5 h-3.5" /> レイヤー
            </label>
            <ul className="space-y-1">
              {blocks.map((block) => (
                <li key={block.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(block.id);
                      setSelectedProps((block.props as ComponentProps) ?? null);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      selectedId === block.id
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "bg-surface-700/30 border border-white/5 text-slate-400 hover:bg-surface-600/50 hover:text-slate-300"
                    }`}
                  >
                    <span className="capitalize">{block.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
        <details className="group">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">
            テンプレート
          </label>
          <ul className="space-y-2">
            {templates.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => applyTemplate(t.layout)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-700/50 border border-white/5 text-left text-sm text-slate-300 hover:bg-surface-600/50 hover:border-accent/30 transition-colors"
                >
                  <span className="text-accent">{templateIcons[i]}</span>
                  <span>{t.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
