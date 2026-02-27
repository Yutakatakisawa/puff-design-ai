"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Loader2, Monitor, Smartphone, MousePointer, Pencil, Hand, Image, ChevronDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCanvasStore } from "@/lib/store";
import { MOTION } from "@/lib/motion";
import { CanvasBlock } from "./canvas/CanvasBlock";
import { StatusBar } from "./canvas/StatusBar";
import { SortableBlock } from "./SortableBlock";

type CanvasTool = "select" | "edit" | "pan";
export function CenterPanel() {
  const {
    layout,
    variants,
    activeVariant,
    setActiveVariant,
    selectedId,
    setSelectedId,
    setSelectedProps,
    setZoom,
    zoom,
    previewMode,
    setPreviewMode,
    reorderBlocks,
    isGenerating,
  } =
    useCanvasStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");
  const [modifyOpen, setModifyOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const blocks = layout.layout;

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      const block = blocks.find((b) => b.id === id);
      setSelectedProps((block?.props as Record<string, unknown>) ?? null);
    },
    [blocks, setSelectedId, setSelectedProps]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) reorderBlocks(oldIndex, newIndex);
  };

  const scale = zoom / 100;

  return (
    <div className="flex-1 flex flex-col min-w-0 glass-panel rounded-xl overflow-hidden">
      {/* Stitch風 セカンダリーツールバー */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-surface-800/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setModifyOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5"
            >
              Modify <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPreviewOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5"
            >
              Preview <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          {variants.length > 1 && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
              {variants.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveVariant(i)}
                  className={`px-2 py-1 rounded text-xs ${
                    activeVariant === i ? "bg-accent/20 text-accent-light" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  案{i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-surface-700/50 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                previewMode === "mobile" ? "bg-accent/20 text-accent-light" : "text-slate-400"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                previewMode === "desktop" ? "bg-accent/20 text-accent-light" : "text-slate-400"
              }`}
            >
              <Monitor className="w-3 h-3" />
              Desktop
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-surface-700/50 p-1">
            <button type="button" onClick={() => setZoom(zoom - 10)} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="min-w-[3rem] text-center text-xs text-slate-400">{zoom}%</span>
            <button type="button" onClick={() => setZoom(zoom + 10)} className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-auto flex items-start justify-center p-6"
        style={{
          background: "#1a1a22",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <motion.div
          className="relative"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOTION.smooth}
        >
          {previewMode === "mobile" ? (
            <div className="w-[320px] rounded-[2.5rem] border-[10px] border-surface-600 bg-surface-800 shadow-2xl overflow-hidden">
              <div className="h-[44px] bg-surface-900 flex items-center justify-center rounded-t-[1.5rem]">
                <div className="w-20 h-1.5 rounded-full bg-surface-600" />
              </div>
              <StatusBar />
              <div className="min-h-[500px] max-h-[70vh] overflow-y-auto bg-surface-900">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    <p className="text-sm text-slate-400">AIがレイアウトを生成中...</p>
                  </div>
                ) : blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] gap-2 text-slate-500">
                    <p className="text-sm">プロンプトを入力して「生成する」</p>
                    <p className="text-xs">または左のテンプレートを選択</p>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                      <AnimatePresence mode="popLayout">
                        {blocks.map((block) => (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            isSelected={selectedId === block.id}
                            isHovered={hoveredId === block.id}
                            onSelect={() => handleSelect(block.id)}
                            onHover={(v) => setHoveredId(v ? block.id : null)}
                          />
                        ))}
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          ) : (
            <div className="w-[980px] max-w-[calc(100vw-28rem)] rounded-2xl border border-white/10 bg-surface-800 shadow-2xl overflow-hidden">
              <div className="h-11 bg-surface-900/90 border-b border-white/5 px-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">Desktop Preview</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
              </div>
              <div className="min-h-[540px] max-h-[70vh] overflow-y-auto bg-surface-900">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                  <Loader2 className="w-10 h-10 text-accent animate-spin" />
                  <p className="text-sm text-slate-400">AIがレイアウトを生成中...</p>
                </div>
              ) : blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-2 text-slate-500">
                  <p className="text-sm">プロンプトを入力して「生成する」</p>
                  <p className="text-xs">または左のテンプレートを選択</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence mode="popLayout">
                      {blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedId === block.id}
                          isHovered={hoveredId === block.id}
                          onSelect={() => handleSelect(block.id)}
                          onHover={(v) => setHoveredId(v ? block.id : null)}
                        />
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                </DndContext>
              )}
            </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Stitch風 キャンバスツールバー（下部） */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-surface-800/30">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTool("select")}
            className={`p-2 rounded-lg ${activeTool === "select" ? "bg-accent/20 text-accent-light" : "text-slate-500 hover:text-slate-300"}`}
            title="選択"
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("edit")}
            className={`p-2 rounded-lg ${activeTool === "edit" ? "bg-accent/20 text-accent-light" : "text-slate-500 hover:text-slate-300"}`}
            title="編集"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("pan")}
            className={`p-2 rounded-lg ${activeTool === "pan" ? "bg-accent/20 text-accent-light" : "text-slate-500 hover:text-slate-300"}`}
            title="移動"
          >
            <Hand className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 rounded-lg text-slate-500 hover:text-slate-300" title="ズーム">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 rounded-lg text-slate-500 hover:text-slate-300" title="フレーム">
            <Image className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-slate-500">{zoom}%</span>
      </div>
    </div>
  );
}
