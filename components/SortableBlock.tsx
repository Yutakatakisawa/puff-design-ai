"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { LayoutBlock } from "@/lib/types";
import { CanvasBlock } from "./canvas/CanvasBlock";

interface SortableBlockProps {
  block: LayoutBlock;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

export function SortableBlock({
  block,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={isDragging ? "opacity-50 z-50" : ""}
      {...attributes}
      {...listeners}
    >
      <CanvasBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelect={onSelect}
        onHover={onHover}
      />
    </motion.div>
  );
}
