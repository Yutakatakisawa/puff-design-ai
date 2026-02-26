"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Loader2 } from "lucide-react";
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
import { CanvasBlock } from "./canvas/CanvasBlock";
import { StatusBar } from "./canvas/StatusBar";
import { SortableBlock } from "./SortableBlock";

export function CenterPanel() {
  const { layout, selectedId, setSelectedId, setSelectedProps, setZoom, zoom, reorderBlocks, isGenerating } =
    useCanvasStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-xs font-medium text-slate-400">Canvas</span>
        <div className="flex items-center gap-1 rounded-lg bg-surface-700/50 p-1">
          <button
            type="button"
            onClick={() => setZoom(zoom - 10)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs text-slate-400">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom(zoom + 10)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <motion.div
          className="relative"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          {/* Mobile phone mockup */}
          <div className="w-[320px] rounded-[2.5rem] border-[10px] border-surface-600 bg-surface-800 shadow-2xl overflow-hidden">
            <div className="h-[44px] bg-surface-900 flex items-center justify-center rounded-t-[1.5rem]">
              <div className="w-20 h-1.5 rounded-full bg-surface-600" />
            </div>
            <StatusBar />
            <div className="min-h-[500px] max-h-[70vh] overflow-y-auto bg-surface-900">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                  <Loader2 className="w-10 h-10 text-accent animate-spin" />
                  <p className="text-sm text-slate-400">Generating layout...</p>
                </div>
              ) : blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-2 text-slate-500">
                  <p className="text-sm">Enter a prompt and hit Generate</p>
                  <p className="text-xs">or pick a template from the left</p>
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
        </motion.div>
      </div>
    </div>
  );
}
