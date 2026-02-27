"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  FileJson,
  Code,
  Check,
  Download,
  Copy,
  Braces,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { useCanvasStore } from "@/lib/store";
import { exportHtml, exportReact, exportTailwindLayout, exportWordPress, exportWix } from "@/lib/export-utils";

function WordPressIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.037 15.441L7.26 8.61c.6-.03 1.14-.09 1.14-.09.54-.06.48-.87-.06-.84 0 0-1.62.12-2.67.12-.18 0-.42 0-.66-.03A8.006 8.006 0 0 1 12 4c2.34 0 4.47.9 6.09 2.37-.03 0-.09-.03-.15-.03-1.08 0-1.83.93-1.83 1.95 0 .9.54 1.68 1.08 2.58.42.72.9 1.65.9 3 0 .93-.36 2.01-.84 3.51l-1.11 3.69-3.99-11.88c.6-.03 1.14-.09 1.14-.09.54-.06.48-.87-.06-.84 0 0-1.62.12-2.67.12-.18 0-.39 0-.63-.03l5.4 16.08c-1.2.42-2.49.66-3.84.66-.48 0-.93-.03-1.38-.09zM19.14 17.7l2.7-7.8c.51-1.26.66-2.28.66-3.18 0-.33-.03-.63-.06-.93A7.983 7.983 0 0 1 20 12c0 2.13-.84 4.05-2.19 5.49l1.33.21zM3.66 13.08l3.24 8.88A8.013 8.013 0 0 1 4 12c0-.96.18-1.89.48-2.73l-.82 3.81z" />
    </svg>
  );
}

function WixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.832 6.218c-.69.347-1.085 1.039-1.085 1.85v7.084l-2.704-7.764c-.267-.77-.822-1.31-1.6-1.31-.777 0-1.332.54-1.598 1.31L11.54 15.04V7.997c0-.793-.364-1.502-1.085-1.85-.71-.343-1.537-.27-2.142.27L4.77 9.643l-.644-.774c-.517-.62-1.418-.697-2.012-.174-.595.524-.654 1.437-.132 2.057l1.71 2.058c.302.364.751.57 1.224.564.471-.005.914-.22 1.209-.59l1.544-1.932v5.3c0 .93.535 1.63 1.379 1.85.295.077.595.072.88-.002.593-.153 1.055-.607 1.285-1.267l2.626-7.388 2.627 7.389c.23.66.692 1.113 1.285 1.267.284.073.584.078.879.001.844-.22 1.38-.92 1.38-1.85V9.35l.643.805c.296.37.738.584 1.21.59.471.005.92-.201 1.223-.565l1.71-2.058c.522-.62.464-1.533-.131-2.057-.595-.523-1.496-.446-2.013.174l-.644.775-3.542-3.226c-.605-.54-1.432-.613-2.142-.27z" />
    </svg>
  );
}

export function ExportBar() {
  const { layout } = useCanvasStore();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"html" | "react" | "tailwind" | "json" | "wordpress" | "wix">("react");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const currentContent = useMemo(() => {
    if (active === "html") return exportHtml(layout);
    if (active === "react") return exportReact(layout);
    if (active === "tailwind") return exportTailwindLayout(layout);
    if (active === "wordpress") return exportWordPress(layout);
    if (active === "wix") return exportWix(layout);
    return JSON.stringify(layout, null, 2);
  }, [active, layout]);

  const handleDownload = () => {
    const map: Record<string, { filename: string; mime: string }> = {
      html: { filename: "export.html", mime: "text/html" },
      react: { filename: "ExportedLayout.tsx", mime: "text/tsx" },
      tailwind: { filename: "layout.txt", mime: "text/plain" },
      json: { filename: "layout.json", mime: "application/json" },
      wordpress: { filename: "wordpress-theme.php", mime: "text/php" },
      wix: { filename: "wix-page.js", mime: "text/javascript" },
    };
    const { filename, mime } = map[active] ?? { filename: "export.txt", mime: "text/plain" };
    const blob = new Blob([currentContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  const handleOneClickExport = (target: string) => {
    setExporting(target);
    setTimeout(() => {
      handleDownload();
      setExporting(null);
    }, 800);
  };

  const isEmpty = layout.layout.length === 0;

  const tabs = [
    { key: "react" as const, label: "React", icon: FileJson },
    { key: "tailwind" as const, label: "Tailwind", icon: Code },
    { key: "html" as const, label: "HTML", icon: FileCode },
    { key: "wordpress" as const, label: "WordPress", icon: WordPressIcon },
    { key: "wix" as const, label: "Wix", icon: WixIcon },
    { key: "json" as const, label: "JSON", icon: Braces },
  ];

  return (
    <div className="relative flex items-center gap-2">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        disabled={isEmpty}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/5 text-slate-300 text-xs font-medium hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileCode className="w-3.5 h-3.5" />
        Export
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-10 right-0 z-50 w-[38rem] rounded-xl border border-white/10 bg-surface-800 shadow-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">エクスポート</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  コピー
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg bg-accent/20 text-xs text-accent-light hover:bg-accent/30 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  ダウンロード
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={`px-2 py-1.5 rounded-lg text-xs border flex items-center justify-center gap-1 transition-colors ${
                    active === tab.key
                      ? "bg-accent/20 border-accent/40 text-accent-light"
                      : "border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            <textarea
              readOnly
              value={currentContent}
              className="w-full h-48 rounded-lg bg-surface-900 border border-white/10 text-[11px] leading-5 text-slate-300 p-3 font-mono"
            />

            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[11px] text-slate-500 mb-2">ワンタッチエクスポート</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActive("wordpress");
                    handleOneClickExport("wordpress");
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-slate-200 transition-colors"
                >
                  <WordPressIcon className="w-4 h-4" />
                  WordPress
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  {exporting === "wordpress" && <span className="text-[10px] text-emerald-400">...</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActive("wix");
                    handleOneClickExport("wix");
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-slate-200 transition-colors"
                >
                  <WixIcon className="w-4 h-4" />
                  Wix
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  {exporting === "wix" && <span className="text-[10px] text-emerald-400">...</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActive("html");
                    handleOneClickExport("html");
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-slate-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  HTML
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  {exporting === "html" && <span className="text-[10px] text-emerald-400">...</span>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
