"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  SearchCheck,
  LogOut,
  EllipsisVertical,
  CircleHelp,
  MessageSquareText,
  BookOpenText,
  Send,
  ShieldAlert,
  Globe,
  Smartphone,
  FileText,
  Plus,
  Search,
  PanelsTopLeft,
  Users2,
  Sparkles,
  Check,
  Crown,
  Zap,
  Infinity,
  Mic,
  MicOff,
  Image,
  Camera,
  Upload,
  Link as LinkIcon,
  Palette,
  X,
  User,
  Settings,
  ChevronDown,
  Share2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterPanel } from "@/components/CenterPanel";
import { RightPanel } from "@/components/RightPanel";
import { ExportBar } from "@/components/ExportBar";
import { useCanvasStore } from "@/lib/store";
import type { LayoutStructure } from "@/lib/types";
import { generateLayoutVariants } from "@/lib/generate-layout";

type AuthMode = "login" | "signup";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSec: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export default function Home() {
  const { layout, setLayout, designMode, setDesignMode, setPreviewMode, setVariants, setIsGenerating } = useCanvasStore();
  const hasEditorContent = layout.layout.length > 0;
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [analyticsCookie, setAnalyticsCookie] = useState(true);
  const [cookieNonce, setCookieNonce] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [pricingOpen, setPricingOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const menuItems = [
    { label: "よくある質問", href: "/faq", icon: CircleHelp, external: false },
    { label: "フォーラム", href: "/forum", icon: MessageSquareText, external: false },
    { label: "プロンプトガイド", href: "https://developers.google.com", icon: BookOpenText, external: true },
    { label: "フィードバックを送信", href: "https://forms.gle", icon: Send, external: true },
    { label: "プライバシーに関するお知らせ", href: "/privacy", icon: ShieldAlert, external: false },
  ];

  useEffect(() => {
    if (!accountMenuOpen) return;
    const close = () => setAccountMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [accountMenuOpen]);

  useEffect(() => {
    const hasSession = Boolean(readCookie("puff_session"));
    const hasConsent = readCookie("puff_cookie_consent") === "accepted";
    setCookieConsent(hasConsent);
    setAnalyticsCookie(readCookie("puff_analytics") !== "0");
    setIsAuthed(hasSession);
    setIsReady(true);
  }, []);

  const cookieStatus = useMemo(
    () => ({
      session: Boolean(readCookie("puff_session")),
      consent: readCookie("puff_cookie_consent") === "accepted",
      analytics: readCookie("puff_analytics") !== "0",
    }),
    [cookieNonce]
  );

  const handleAuth = async () => {
    setAuthError("");
    if (!email.trim() || !password.trim()) {
      setAuthError("メールアドレスとパスワードを入力してください。");
      return;
    }
    if (authMode === "signup" && !name.trim()) {
      setAuthError("サインアップには名前が必要です。");
      return;
    }
    if (password.length < 6) {
      setAuthError("パスワードは6文字以上にしてください。");
      return;
    }
    if (!cookieConsent) {
      setAuthError("ログイン/登録にはCookie同意が必要です。");
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), name: name.trim(), password }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!data.ok) {
          setAuthError(data.error || "登録に失敗しました");
          return;
        }
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const loginData = (await loginRes.json()) as { ok: boolean; user?: { email: string; name: string }; error?: string };

      if (!loginData.ok) {
        setAuthError(loginData.error || "ログインに失敗しました");
        return;
      }

      const sessionSeed = `${loginData.user?.email ?? email}:${Date.now()}`;
      const token = btoa(sessionSeed).replaceAll("=", "");
      writeCookie("puff_session", token, 60 * 60 * 24 * 30);
      writeCookie("puff_cookie_consent", "accepted", 60 * 60 * 24 * 365);
      writeCookie("puff_analytics", analyticsCookie ? "1" : "0", 60 * 60 * 24 * 365);
      localStorage.setItem(
        "puff_user",
        JSON.stringify({
          name: loginData.user?.name ?? (name || email.split("@")[0]),
          email: loginData.user?.email ?? email,
        })
      );
      setIsAuthed(true);
      setCookieNonce((v) => v + 1);
    } catch {
      setAuthError("接続エラーです。しばらくしてからお試しください。");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearCookie("puff_session");
    localStorage.removeItem("puff_user");
    setIsAuthed(false);
    setCookieNonce((v) => v + 1);
  };

  const switchDesignMode = (mode: "app" | "web") => {
    setDesignMode(mode);
    setPreviewMode(mode === "app" ? "mobile" : "desktop");
  };

  const generateWithGemini = async (basePrompt: string): Promise<LayoutStructure[]> => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: basePrompt, mode: designMode, count: 3 }),
    });
    if (!res.ok) throw new Error(`Generate API failed: ${res.status}`);
    const data = (await res.json()) as { variants?: LayoutStructure[] };
    if (!data.variants?.length) throw new Error("No variants returned");
    return data.variants;
  };

  const handleGenerate = async (value?: string) => {
    const basePrompt = (value ?? prompt).trim();
    if (!basePrompt) return;
    setIsGenerating(true);
    try {
      const variants = await generateWithGemini(basePrompt);
      setVariants(variants);
      setPrompt(basePrompt);
    } catch {
      const fallback = await generateLayoutVariants(basePrompt, 3, designMode);
      setVariants(fallback);
      setPrompt(basePrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
        (window as unknown as { _puffRecognition?: { stop: () => void } })._puffRecognition?.stop();
      }
      return;
    }
    setIsListening(true);
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognitionClass = (window as unknown as { webkitSpeechRecognition: new () => {
        lang: string; continuous: boolean; interimResults: boolean;
        start(): void; stop(): void;
        onresult: ((e: { results: unknown }) => void) | null;
        onerror: (() => void) | null; onend: (() => void) | null;
      } }).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = "ja-JP";
      recognition.continuous = true;
      recognition.interimResults = true;
      (window as unknown as { _puffRecognition: { stop: () => void } })._puffRecognition = recognition;
      recognition.onresult = (event) => {
        const results = (event as { results: Array<{ [k: number]: { transcript: string } }> }).results;
        let transcript = "";
        for (let i = 0; i < results.length; i++) {
          transcript += results[i]?.[0]?.transcript ?? "";
        }
        setPrompt(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(false);
      alert("このブラウザは音声入力に対応していません。Chrome をお使いください。");
    }
  };

  const addMenuItems = [
    { label: "画像をアップロード", icon: Image },
    { label: "スクリーンショット", icon: Camera },
    { label: "ファイルをアップロード", icon: Upload },
    { label: "URLから参照", icon: LinkIcon },
    { label: "カラーパレット指定", icon: Palette },
  ];

  const recentProjects = [
    "Visual Match Tiles - PRD",
    "The Ornithologist - PRD",
    "Stitch x Figma Editor",
    "モニエル瓦修理工事ページ",
    "3D Preview",
    "Dashboard",
    "Generated Screen",
  ];

  if (!isReady) {
    return <div className="h-screen bg-surface-900" />;
  }

  if (!isAuthed) {
    return (
      <div className="h-screen bg-surface-900 text-slate-200 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BrandMark size={20} />
              <h1 className="text-xl font-semibold">Puff Design</h1>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              アカウント登録（サインアップ）またはログインが必要です。初めての方は「サインアップ」でアカウントを作成してください。
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  authMode === "login" ? "bg-accent/20 text-accent-light" : "bg-white/5 text-slate-400"
                }`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  authMode === "signup" ? "bg-accent/20 text-accent-light" : "bg-white/5 text-slate-400"
                }`}
              >
                サインアップ
              </button>
            </div>

            <div className="space-y-3">
              {authMode === "signup" && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="名前"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-700 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-accent/50"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-700 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-accent/50"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-700 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={cookieConsent}
                  onChange={(e) => setCookieConsent(e.target.checked)}
                />
                必須Cookieに同意する（ログインに必要）
              </label>
              <label className="flex items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  checked={analyticsCookie}
                  onChange={(e) => setAnalyticsCookie(e.target.checked)}
                />
                分析Cookieを有効化する
              </label>
            </div>

            {authError && <p className="mt-3 text-sm text-rose-400">{authError}</p>}

            <button
              type="button"
              onClick={handleAuth}
              disabled={authLoading}
              className="mt-4 w-full py-2.5 rounded-lg bg-accent hover:bg-accent-light transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {authLoading ? "処理中..." : authMode === "login" ? "ログインして開始" : "サインアップして開始"}
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">最初の画面: Cookieチェック</h2>
              <button
                type="button"
                onClick={() => setCookieNonce((v) => v + 1)}
                className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300"
              >
                更新
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-surface-700/60 p-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-light" />
                  セッションCookie
                </span>
                <span className={cookieStatus.session ? "text-emerald-400" : "text-rose-400"}>
                  {cookieStatus.session ? "検出" : "未検出"}
                </span>
              </div>
              <div className="rounded-lg border border-white/10 bg-surface-700/60 p-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-light" />
                  同意Cookie
                </span>
                <span className={cookieStatus.consent ? "text-emerald-400" : "text-rose-400"}>
                  {cookieStatus.consent ? "accepted" : "未同意"}
                </span>
              </div>
              <div className="rounded-lg border border-white/10 bg-surface-700/60 p-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <SearchCheck className="w-4 h-4 text-accent-light" />
                  分析Cookie
                </span>
                <span className={cookieStatus.analytics ? "text-emerald-400" : "text-slate-500"}>
                  {cookieStatus.analytics ? "有効" : "無効"}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              ここでCookie状態を確認してから、ログイン/サインアップできます。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0b0b10] text-slate-100 overflow-hidden">
      <aside className="w-[300px] border-r border-white/10 bg-[#11121a] flex flex-col">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BrandMark size={18} />
            <span className="font-semibold">Puff Design</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-lg bg-white/10 text-sm py-2 flex items-center justify-center gap-1.5">
              <PanelsTopLeft className="w-4 h-4" /> マイプロジェクト
            </button>
            <button className="rounded-lg border border-white/10 text-sm py-2 flex items-center justify-center gap-1.5 text-slate-300">
              <Users2 className="w-4 h-4" /> 共有アイテム
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="プロジェクトを検索"
              className="w-full rounded-lg bg-[#0b0b11] border border-white/10 pl-8 pr-3 py-2 text-sm text-slate-200"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs text-slate-500 mb-2">最近</p>
          <div className="space-y-1">
            {recentProjects.map((title, idx) => (
              <div key={title} className="rounded-lg p-2 hover:bg-white/5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 border border-white/10" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{title}</p>
                    <p className="text-[11px] text-slate-500">Feb {26 - (idx % 5)}, 2026</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 px-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {hasEditorContent && (
              <>
                <button
                  type="button"
                  onClick={() => setLayout({ layout: [] })}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  新しいデザイン
                </button>
                <ExportBar />
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-light text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  共有
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a href="https://docs.google.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              <FileText className="w-4 h-4" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              <MessageSquareText className="w-4 h-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setPricingOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-indigo-500 text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-accent/20"
            >
              <Crown className="w-3.5 h-3.5" />
              アップグレード
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="アカウント"
              >
                <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-light" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-surface-800/95 backdrop-blur-xl p-2 shadow-2xl z-[60]"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-xs text-slate-500">アカウント</p>
                      <p className="text-sm font-medium truncate">ログイン中</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAccountMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                    >
                      <Settings className="w-4 h-4 text-accent-light" />
                      アカウント設定
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAccountMenuOpen(false); setPricingOpen(true); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                    >
                      <CreditCard className="w-4 h-4 text-accent-light" />
                      プラン・請求
                    </button>
                    {menuItems.map((item) =>
                      item.external ? (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                        >
                          <item.icon className="w-4 h-4 text-accent-light" />
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5"
                        >
                          <item.icon className="w-4 h-4 text-accent-light" />
                          {item.label}
                        </Link>
                      )
                    )}
                    <div className="my-1 border-t border-white/10" />
                    <button
                      type="button"
                      onClick={() => { setAccountMenuOpen(false); handleLogout(); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      ログアウト
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className={`flex-1 flex ${hasEditorContent ? "overflow-hidden" : "overflow-auto"}`}>
          {hasEditorContent ? (
            <>
              <LeftPanel />
              <CenterPanel />
              <RightPanel />
            </>
          ) : (
          <div className="max-w-4xl mx-auto pt-16 px-6 pb-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AIがデザインを自動生成
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  理想の
                </span>
                <span className="mx-3">
                  <span className="inline-flex p-1 rounded-xl border border-white/10 bg-surface-700/40 align-middle">
                    <button
                      type="button"
                      onClick={() => switchDesignMode("app")}
                      className={`px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                        designMode === "app"
                          ? "bg-accent/20 text-accent-light shadow-lg shadow-accent/10"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      アプリ
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDesignMode("web")}
                      className={`px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                        designMode === "web"
                          ? "bg-accent/20 text-accent-light shadow-lg shadow-accent/10"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      ウェブ
                    </button>
                  </span>
                </span>
                <span className="bg-gradient-to-r from-accent-light via-accent to-indigo-400 bg-clip-text text-transparent">
                  UI
                </span>
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                プロンプトを入力するだけで、プロ品質のUIデザインをAIが瞬時に生成します。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-accent/30 shadow-[0_0_0_1px_rgba(167,139,250,0.2),0_0_60px_rgba(167,139,250,0.12)] bg-gradient-to-b from-[#13111c] to-[#0f0d14] p-5"
            >
              {isListening && (
                <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                  <span className="text-sm text-rose-300">音声入力中… 話してください</span>
                </div>
              )}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="どんなデザインを作りたいですか？ 例：「カフェのLP」「フィットネスアプリ」"
                className="w-full h-32 bg-transparent resize-none outline-none text-slate-100 placeholder-slate-500 text-base leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setAddMenuOpen((v) => !v)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-slate-300" />
                    </button>
                    <AnimatePresence>
                      {addMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute bottom-12 left-0 w-56 rounded-xl border border-white/10 bg-surface-800/95 backdrop-blur-xl p-1.5 shadow-2xl z-50"
                        >
                          {addMenuItems.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => setAddMenuOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-accent-light" />
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      isListening
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/10"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                    title="音声入力"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-light text-white text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-accent/20"
                  >
                    生成する
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-4"
            >
              <p className="text-xs text-slate-500 mb-2">
                クイックスタート — クリックするとデザインが生成され、編集・プレビュー画面に移動します
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerate("スキーが好きな人向けのアプリを作って")}
                  className="text-left px-4 py-3 rounded-xl border border-white/8 hover:border-accent/20 hover:bg-white/[0.03] text-sm text-slate-400 hover:text-slate-200 transition-all"
                >
                  スキーが好きな人向けのアプリを作って
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate("体調記録アプリの日次チェックイン画面を作って")}
                  className="text-left px-4 py-3 rounded-xl border border-white/8 hover:border-accent/20 hover:bg-white/[0.03] text-sm text-slate-400 hover:text-slate-200 transition-all"
                >
                  体調記録アプリのチェックイン画面
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate("月額3000円のサブスクリプションサービスのLP、料金プランと特典を訴求")}
                  className="text-left px-4 py-3 rounded-xl border border-white/8 hover:border-accent/20 hover:bg-white/[0.03] text-sm text-slate-400 hover:text-slate-200 transition-all"
                >
                  月額3000円のサブスクLP（料金・特典訴求）
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate("カフェのLPを作って")}
                  className="text-left px-4 py-3 rounded-xl border border-white/8 hover:border-accent/20 hover:bg-white/[0.03] text-sm text-slate-400 hover:text-slate-200 transition-all"
                >
                  カフェのLPを作って
                </button>
              </div>
            </motion.div>
          </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {pricingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setPricingOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl rounded-2xl border border-white/10 bg-surface-800 shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">料金プラン</h3>
                  <p className="text-sm text-slate-400 mt-1">あなたに合ったプランを選んでください</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPricingOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-surface-700/40 p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Free</h4>
                      <p className="text-[11px] text-slate-500">無料プラン</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-white">¥0</span>
                    <span className="text-xs text-slate-500 ml-1">/ 月</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300 mb-5 flex-1">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      月10回までデザイン生成
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      基本テンプレート
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      PNG エクスポート
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    現在のプラン
                  </button>
                </div>

                <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-b from-accent/[0.08] to-surface-700/40 p-5 flex flex-col relative shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-white text-[11px] font-medium">
                    おすすめ
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-accent-light" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Pro</h4>
                      <p className="text-[11px] text-accent-light">プロプラン</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-white">¥1,000</span>
                    <span className="text-xs text-slate-400 ml-1">/ 月</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-200 mb-5 flex-1">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-light mt-0.5 shrink-0" />
                      月1,000回までデザイン生成
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-light mt-0.5 shrink-0" />
                      全テンプレートアクセス
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-light mt-0.5 shrink-0" />
                      SVG / PNG エクスポート
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-light mt-0.5 shrink-0" />
                      優先AIモデル
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
                  >
                    Pro にアップグレード
                  </button>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.05] to-surface-700/40 p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Infinity className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Unlimited</h4>
                      <p className="text-[11px] text-amber-400">無制限プラン</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-white">¥3,000</span>
                    <span className="text-xs text-slate-400 ml-1">/ 月</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-200 mb-5 flex-1">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      無制限デザイン生成
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      全テンプレート + 優先アクセス
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      全フォーマットエクスポート
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      最速AIモデル + 専用サポート
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                  >
                    Unlimited にアップグレード
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
