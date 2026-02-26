"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Layout, LayoutDashboard, Smartphone, Layers } from "lucide-react";
import type { ComponentProps, LayoutStructure } from "@/lib/types";
import { useCanvasStore } from "@/lib/store";
import { generateLayoutFromPrompt, getTemplates } from "@/lib/generate-layout";

export function LeftPanel() {
  const [prompt, setPrompt] = useState("");
  const { setLayout, setIsGenerating, layout, selectedId, setSelectedId, setSelectedProps } = useCanvasStore();
  const templates = getTemplates();
  const blocks = layout.layout;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const layout = await generateLayoutFromPrompt(prompt.trim());
      setLayout(layout);
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
    <div className="glass-panel w-72 flex flex-col h-full rounded-r-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Roofing company landing page..."
          className="w-full h-24 px-3 py-2.5 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent resize-none"
          rows={3}
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {blocks.length > 0 && (
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Layers className="w-3.5 h-3.5" /> Layers
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
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">
            Templates
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
        </div>
      </div>
    </div>
  );
}
