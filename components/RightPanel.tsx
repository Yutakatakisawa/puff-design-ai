"use client";

import { useCanvasStore } from "@/lib/store";

export function RightPanel() {
  const { selectedId, selectedProps, layout, updateBlockProps } = useCanvasStore();
  const block = selectedId ? layout.layout.find((b) => b.id === selectedId) : null;

  if (!block || !selectedProps) {
    return (
      <div className="glass-panel w-80 flex flex-col h-full rounded-l-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-slate-300">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-slate-500 text-sm">
          Select a component on the canvas to edit its properties.
        </div>
      </div>
    );
  }

  const update = (key: string, value: string | number) => {
    updateBlockProps(block.id, { [key]: value });
  };

  return (
    <div className="glass-panel w-80 flex flex-col h-full rounded-l-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-slate-300 capitalize">{block.type}</h3>
        <p className="text-xs text-slate-500 mt-0.5">Component properties</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {"text" in selectedProps && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Text</label>
            <input
              type="text"
              value={String(selectedProps.text ?? "")}
              onChange={(e) => update("text", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        )}
        {"subtext" in selectedProps && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Subtext</label>
            <input
              type="text"
              value={String(selectedProps.subtext ?? "")}
              onChange={(e) => update("subtext", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        )}
        {"buttonText" in selectedProps && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Button text</label>
            <input
              type="text"
              value={String(selectedProps.buttonText ?? "")}
              onChange={(e) => update("buttonText", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Font size</label>
          <input
            type="number"
            min={10}
            max={48}
            value={Number(selectedProps.fontSize ?? 16)}
            onChange={(e) => update("fontSize", parseInt(e.target.value, 10) || 16)}
            className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Padding</label>
          <input
            type="number"
            min={0}
            max={64}
            value={Number(selectedProps.padding ?? 16)}
            onChange={(e) => update("padding", parseInt(e.target.value, 10) || 16)}
            className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        {"backgroundColor" in selectedProps && (() => {
          const bgVal = String(selectedProps.backgroundColor ?? "#1e1b4b");
          const hexVal = /^#[0-9a-f]{6}$/i.test(bgVal) ? bgVal : "#1e1b4b";
          return (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Background color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={hexVal}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-white/5 bg-surface-700"
                />
                <input
                  type="text"
                  value={bgVal}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
