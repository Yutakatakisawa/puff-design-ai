"use client";

import { Signal, Wifi, Battery } from "lucide-react";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-black/30 text-white/90 text-xs">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
}
