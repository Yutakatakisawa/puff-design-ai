"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, FileJson, Code, Check } from "lucide-react";
import { useCanvasStore } from "@/lib/store";
import { exportHtml, exportReact, exportTailwindLayout } from "@/lib/export-utils";

export function ExportBar() {
  const { layout } = useCanvasStore();
  const [copied, setCopied] = useState<"html" | "react" | "tailwind" | null>(null);

  const handleExport = (type: "html" | "react" | "tailwind") => {
    let content: string;
    let filename: string;
    let mime: string;
    if (type === "html") {
      content = exportHtml(layout);
      filename = "export.html";
      mime = "text/html";
    } else if (type === "react") {
      content = exportReact(layout);
      filename = "ExportedLayout.tsx";
      mime = "text/tsx";
    } else {
      content = exportTailwindLayout(layout);
      filename = "layout.txt";
      mime = "text/plain";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const isEmpty = layout.layout.length === 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 mr-2">Export:</span>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleExport("html")}
        disabled={isEmpty}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5 text-slate-300 text-xs font-medium hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copied === "html" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileCode className="w-3.5 h-3.5" />}
        HTML
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleExport("react")}
        disabled={isEmpty}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5 text-slate-300 text-xs font-medium hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copied === "react" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileJson className="w-3.5 h-3.5" />}
        React
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleExport("tailwind")}
        disabled={isEmpty}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5 text-slate-300 text-xs font-medium hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copied === "tailwind" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code className="w-3.5 h-3.5" />}
        Tailwind
      </motion.button>
    </div>
  );
}
