"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Eye,
  Pin,
  Clock,
  Search,
  Plus,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  likes: number;
  views: number;
  timeAgo: string;
  pinned?: boolean;
  solved?: boolean;
  preview: string;
}

const categories = [
  { label: "すべて", value: "all" },
  { label: "使い方", value: "usage" },
  { label: "プロンプト共有", value: "prompts" },
  { label: "バグ報告", value: "bugs" },
  { label: "機能リクエスト", value: "features" },
  { label: "テンプレート", value: "templates" },
  { label: "エクスポート", value: "export" },
];

const posts: ForumPost[] = [
  {
    id: "1",
    title: "【公式】Puff Design コミュニティガイドライン",
    author: "Puff Team",
    category: "usage",
    replies: 0,
    likes: 42,
    views: 1280,
    timeAgo: "固定",
    pinned: true,
    preview:
      "Puff Design フォーラムへようこそ！ここではデザインのコツ、プロンプトの共有、バグ報告などを行えます。建設的な議論を心がけましょう。",
  },
  {
    id: "2",
    title: "効果的なプロンプトの書き方まとめ",
    author: "design_master",
    category: "prompts",
    replies: 24,
    likes: 89,
    views: 3420,
    timeAgo: "2時間前",
    pinned: true,
    preview:
      "プロンプトのコツをまとめました。業種+目的+雰囲気+要素を指定すると精度が上がります。例：「和風カフェのLP、落ち着いた雰囲気、メニューとアクセス付き」",
  },
  {
    id: "3",
    title: "WordPress エクスポートで Gutenberg ブロックが正しく表示されない",
    author: "wp_lover",
    category: "bugs",
    replies: 8,
    likes: 12,
    views: 456,
    timeAgo: "4時間前",
    solved: true,
    preview:
      "WordPress 6.4 でエクスポートした PHP テンプレートを使うと、カバーブロックのレイアウトが崩れます。解決策を見つけたので共有します。",
  },
  {
    id: "4",
    title: "音声入力機能が素晴らしい！使い方のコツ",
    author: "voice_user",
    category: "usage",
    replies: 15,
    likes: 34,
    views: 892,
    timeAgo: "6時間前",
    preview:
      "マイクボタンから音声入力を使ってみたら、キーボードで打つよりも自然にプロンプトが書けました。日本語認識もかなり正確です。",
  },
  {
    id: "5",
    title: "不動産サイト用のプロンプトテンプレートを共有",
    author: "realestate_dev",
    category: "templates",
    replies: 19,
    likes: 67,
    views: 2100,
    timeAgo: "1日前",
    preview:
      "不動産サイトでよく使うプロンプトパターンを5つ共有します。物件一覧、物件詳細、会社概要、お問い合わせ、アクセスマップ。",
  },
  {
    id: "6",
    title: "Wix にエクスポートする手順を詳しく教えてください",
    author: "wix_beginner",
    category: "export",
    replies: 6,
    likes: 18,
    views: 540,
    timeAgo: "1日前",
    solved: true,
    preview:
      "Wix Velo コードをどこに貼ればいいのかわからなかったのですが、解決しました。手順をまとめます。",
  },
  {
    id: "7",
    title: "ダークモード/ライトモード切替機能のリクエスト",
    author: "ui_enthusiast",
    category: "features",
    replies: 31,
    likes: 56,
    views: 1890,
    timeAgo: "2日前",
    preview:
      "生成するデザインにダークモードとライトモードの両方のバリエーションを自動生成してほしいです。皆さんどう思いますか？",
  },
  {
    id: "8",
    title: "ECサイトのデザインを Puff Design で作ってみた結果",
    author: "ec_builder",
    category: "prompts",
    replies: 22,
    likes: 45,
    views: 1650,
    timeAgo: "3日前",
    preview:
      "アパレルECサイトをPuff Designで一から作りました。プロンプトの工夫と修正のプロセスを紹介します。",
  },
  {
    id: "9",
    title: "Pro プランにアップグレードした感想",
    author: "pro_user",
    category: "usage",
    replies: 11,
    likes: 28,
    views: 980,
    timeAgo: "4日前",
    preview:
      "無料プランからProプランに変更しました。生成速度が明らかに向上し、テンプレートも豊富です。月1000回の生成で十分足りています。",
  },
];

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedPosts = filtered.filter((p) => p.pinned);
  const regularPosts = filtered.filter((p) => !p.pinned);

  return (
    <div className="min-h-screen bg-surface-900 text-slate-200">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
            </Link>
            <BrandMark size={18} />
            <span className="font-semibold">Puff Design</span>
            <span className="text-slate-500 text-sm">/ フォーラム</span>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新しいトピック
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="トピックを検索..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800 border border-white/10 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <button
            type="button"
            className="p-2.5 rounded-xl bg-surface-800 border border-white/10 hover:bg-surface-700 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.value
                  ? "bg-accent/20 text-accent-light border border-accent/30"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {pinnedPosts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-3.5 h-3.5 text-accent-light" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">固定トピック</span>
            </div>
            <div className="space-y-2">
              {pinnedPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-accent/15 bg-accent/[0.03] p-4 hover:bg-accent/[0.06] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Pin className="w-3 h-3 text-accent-light shrink-0" />
                        <h3 className="text-sm font-semibold text-white truncate">{post.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{post.preview}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {regularPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-white/10 bg-surface-800/40 p-4 hover:bg-surface-800/70 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{post.title}</h3>
                    {post.solved && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] text-emerald-400 font-medium">
                        解決済み
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.preview}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.timeAgo}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.replies}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">該当するトピックが見つかりませんでした</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
