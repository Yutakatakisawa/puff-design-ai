"use client";

import { create } from "zustand";
import type { LayoutBlock, LayoutStructure, ComponentProps } from "./types";

interface CanvasState {
  layout: LayoutStructure;
  selectedId: string | null;
  selectedProps: ComponentProps | null;
  zoom: number;
  isGenerating: boolean;
  setLayout: (layout: LayoutStructure) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedProps: (props: ComponentProps | null) => void;
  updateBlockProps: (id: string, props: Partial<ComponentProps>) => void;
  setZoom: (zoom: number) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  setIsGenerating: (v: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  layout: { layout: [] },
  selectedId: null,
  selectedProps: null,
  zoom: 84,
  isGenerating: false,
  setLayout: (layout) => set({ layout, selectedId: null, selectedProps: null }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setSelectedProps: (selectedProps) => set({ selectedProps }),
  updateBlockProps: (id, props) =>
    set((state) => {
      const layout = state.layout.layout.map((block) =>
        block.id === id
          ? { ...block, props: { ...block.props, ...props } }
          : block
      );
      const selectedBlock = layout.find((b) => b.id === id);
      return {
        layout: { layout },
        selectedProps: selectedBlock?.props as ComponentProps | null,
      };
    }),
  setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(150, zoom)) }),
  reorderBlocks: (fromIndex, toIndex) =>
    set((state) => {
      const blocks = [...state.layout.layout];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { layout: { layout: blocks } };
    }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
