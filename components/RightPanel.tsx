"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { useCanvasStore } from "@/lib/store";

export function RightPanel() {
  const { selectedId, selectedProps, layout, updateBlockProps } = useCanvasStore();
  const [tab, setTab] = useState<"props" | "chat">("chat");
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Stitch風に近づける提案をします。見出し、配色、CTAのどこを強化しますか？",
      createdAt: Date.now(),
    },
  ]);
  const block = selectedId ? layout.layout.find((b) => b.id === selectedId) : null;

  const filteredMessages = useMemo(
    () => messages.filter((m) => m.content.toLowerCase().includes(search.toLowerCase())),
    [messages, search]
  );

  const update = (key: string, value: string | number) => {
    if (!block) return;
    updateBlockProps(block.id, { [key]: value });
  };

  const applyRandomImage = () => {
    const seed = Math.floor(Math.random() * 1000);
    update("imageUrl", `https://picsum.photos/seed/puff-${seed}/1200/800`);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
      createdAt: Date.now(),
    };
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "了解です。次の案: ①ヒーロー見出しを短く ②CTAを目立たせる ③カード余白を増やす。",
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
  };

  return (
    <div className="glass-panel w-80 flex flex-col h-full rounded-l-xl overflow-hidden">
      <div className="p-3 border-b border-white/5 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTab("chat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              tab === "chat" ? "bg-accent/20 text-accent-light" : "text-slate-400 bg-white/5"
            }`}
          >
            AIチャット
          </button>
          <button
            type="button"
            onClick={() => setTab("props")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              tab === "props" ? "bg-accent/20 text-accent-light" : "text-slate-400 bg-white/5"
            }`}
          >
            プロパティ
          </button>
        </div>
        {tab === "chat" && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="チャット検索..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        )}
      </div>

      {tab === "chat" ? (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  m.role === "assistant"
                    ? "bg-surface-700/70 border-white/10 text-slate-200"
                    : "bg-accent/20 border-accent/30 text-slate-100 ml-8"
                }`}
              >
                {m.content}
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">検索結果はありません</p>
            )}
          </div>
          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="例: ヒーローをもっと高級感ある感じに"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="px-3 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent-light"
              >
                送信
              </button>
            </div>
            <button
              type="button"
              onClick={() => setChatInput("このプロンプトで3案作って。やってみる")}
              className="mt-2 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-light" />
              「やってみる」提案を作る
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!block || !selectedProps ? (
            <div className="flex items-center justify-center p-6 text-slate-500 text-sm">
              キャンバスのコンポーネントを選択してください。
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 capitalize">{block.type}</h3>
                <p className="text-xs text-slate-500 mt-0.5">選択中の要素を編集</p>
              </div>
              {"text" in selectedProps && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">メインテキスト</label>
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
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">サブテキスト</label>
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
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">ボタン文言</label>
                  <input
                    type="text"
                    value={String(selectedProps.buttonText ?? "")}
                    onChange={(e) => update("buttonText", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              )}
              {"imageUrl" in selectedProps && (
                <div className="rounded-lg border border-white/10 p-3 bg-surface-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-slate-300">画像URL（Canvasで再編集可）</label>
                    <button
                      type="button"
                      onClick={applyRandomImage}
                      className="text-[11px] px-2 py-1 rounded bg-accent/20 text-accent-light hover:bg-accent/30"
                    >
                      画像を差し替え
                    </button>
                  </div>
                  <input
                    type="text"
                    value={String(selectedProps.imageUrl ?? "")}
                    onChange={(e) => update("imageUrl", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    type="button"
                    onClick={() => update("imageUrl", "")}
                    className="mt-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    画像をクリア
                  </button>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">文字サイズ</label>
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
                <label className="block text-xs font-medium text-slate-400 mb-1.5">余白（Padding）</label>
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
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">背景色</label>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
