"use client";

import { motion } from "framer-motion";
import { Sparkles, Share2, User } from "lucide-react";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterPanel } from "@/components/CenterPanel";
import { RightPanel } from "@/components/RightPanel";
import { ExportBar } from "@/components/ExportBar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 glass-panel">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold text-slate-200">Puff Design AI</span>
          </div>
          <span className="text-xs text-slate-500">Last saved 2m ago</span>
        </div>
        <div className="flex items-center gap-4">
          <ExportBar />
          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent"
            aria-label="Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3-panel layout */}
      <main className="flex-1 flex min-h-0">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </main>
    </div>
  );
}
