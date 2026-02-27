"use client";

import { create } from "zustand";
import type { LayoutStructure, ComponentProps, PreviewMode, DesignMode } from "./types";

interface CanvasState {
  layout: LayoutStructure;
  variants: LayoutStructure[];
  activeVariant: number;
  selectedId: string | null;
  selectedProps: ComponentProps | null;
  designMode: DesignMode;
  previewMode: PreviewMode;
  zoom: number;
  isGenerating: boolean;
  setLayout: (layout: LayoutStructure) => void;
  setVariants: (variants: LayoutStructure[]) => void;
  setActiveVariant: (index: number) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedProps: (props: ComponentProps | null) => void;
  setDesignMode: (mode: DesignMode) => void;
  updateBlockProps: (id: string, props: Partial<ComponentProps>) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setZoom: (zoom: number) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  setIsGenerating: (v: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  layout: { layout: [] },
  variants: [],
  activeVariant: 0,
  selectedId: null,
  selectedProps: null,
  designMode: "app",
  previewMode: "mobile",
  zoom: 84,
  isGenerating: false,
  setLayout: (layout) => set({ layout, selectedId: null, selectedProps: null }),
  setVariants: (variants) =>
    set({
      variants,
      activeVariant: 0,
      layout: variants[0] ?? { layout: [] },
      selectedId: null,
      selectedProps: null,
    }),
  setActiveVariant: (index) =>
    set((state) => ({
      activeVariant: index,
      layout: state.variants[index] ?? state.layout,
      selectedId: null,
      selectedProps: null,
    })),
  setSelectedId: (selectedId) => set({ selectedId }),
  setSelectedProps: (selectedProps) => set({ selectedProps }),
  setDesignMode: (designMode) => set({ designMode }),
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
  setPreviewMode: (previewMode) => set({ previewMode }),
  reorderBlocks: (fromIndex, toIndex) =>
    set((state) => {
      const blocks = [...state.layout.layout];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { layout: { layout: blocks } };
    }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
