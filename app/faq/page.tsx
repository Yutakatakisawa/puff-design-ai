"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: { category: string; items: FaqItem[] }[] = [
  {
    category: "基本",
    items: [
      {
        question: "Puff Design とは何ですか？",
        answer:
          "Puff Design は AI を活用した UI デザインビルダーです。テキストプロンプトを入力するだけで、アプリやウェブサイトのデザインを自動生成できます。デザインの知識がなくても、プロ品質のレイアウトを瞬時に作成できます。",
      },
      {
        question: "デザインの知識がなくても使えますか？",
        answer:
          "はい、まったく問題ありません。Puff Design は「こんなデザインが欲しい」というイメージを日本語で入力するだけで、AI がレイアウト・配色・タイポグラフィをすべて自動で提案します。専門知識は不要です。",
      },
      {
        question: "どのようなデザインを生成できますか？",
        answer:
          "モバイルアプリの画面デザインとウェブサイトのデザインの両方に対応しています。ランディングページ、ダッシュボード、ECサイト、ポートフォリオ、企業サイトなど、幅広い種類のデザインを生成できます。",
      },
      {
        question: "生成されたデザインは商用利用できますか？",
        answer:
          "はい、Puff Design で生成されたデザインはすべて商用利用可能です。クライアントのプロジェクトや自社サービスに自由にお使いいただけます。",
      },
    ],
  },
  {
    category: "プロンプトと生成",
    items: [
      {
        question: "プロンプトのコツを教えてください",
        answer:
          "効果的なプロンプトのポイントは3つです。①目的を明確に（例：「カフェのLP」）、②雰囲気を指定（例：「ナチュラルで温かみのある」）、③具体的な要素を含める（例：「メニュー一覧とアクセスマップ付き」）。詳細なほど、よりイメージに近いデザインが生成されます。",
      },
      {
        question: "音声入力は使えますか？",
        answer:
          "はい、プロンプト入力欄のマイクボタンをクリックすると音声入力モードに切り替わります。話した内容がそのままプロンプトとして入力されます。Chrome ブラウザでの利用を推奨しています。",
      },
      {
        question: "1回のプロンプトで何パターン生成されますか？",
        answer:
          "1回のプロンプトで3つのデザイン案が同時に生成されます。左パネルの「AI案」セクションから案1〜3を切り替えて比較できます。",
      },
      {
        question: "画像やファイルを参考として添付できますか？",
        answer:
          "はい、プロンプト入力欄の「+」ボタンから、画像アップロード、スクリーンショット、ファイルアップロード、URL参照、カラーパレット指定などが可能です。参考画像を基にデザインを生成できます。",
      },
    ],
  },
  {
    category: "エクスポートと連携",
    items: [
      {
        question: "どの形式でエクスポートできますか？",
        answer:
          "React コンポーネント、Tailwind CSS レイアウト、HTML、JSON、WordPress テーマ、Wix Velo コードの6種類に対応しています。エクスポートパネルからワンクリックでダウンロードできます。",
      },
      {
        question: "WordPress にどうやって反映しますか？",
        answer:
          "エクスポートパネルの「WordPress」タブ、またはワンタッチエクスポートの「WordPress」ボタンをクリックします。生成された PHP テンプレートファイルを WordPress テーマフォルダに配置し、管理画面からテンプレートを選択するだけで反映されます。",
      },
      {
        question: "Wix への連携方法を教えてください",
        answer:
          "エクスポートパネルから「Wix」タブを選択し、生成された Wix Velo コードをコピーします。Wix エディターで対象ページのコードパネルを開き、コードを貼り付けるだけで反映されます。",
      },
    ],
  },
  {
    category: "料金プランとアカウント",
    items: [
      {
        question: "無料プランでは何ができますか？",
        answer:
          "無料プランでは月10回までデザイン生成が可能です。基本テンプレートの利用と PNG エクスポートに対応しています。まずは無料でお試しください。",
      },
      {
        question: "Pro プランと Unlimited プランの違いは？",
        answer:
          "Pro プラン（月額¥1,000）は月1,000回までの生成、全テンプレート、SVG/PNG エクスポート、優先 AI モデルが利用可能です。Unlimited プラン（月額¥3,000）は生成回数無制限、全フォーマットエクスポート、最速 AI モデル、専用サポートが付きます。",
      },
      {
        question: "プランの変更やキャンセルはいつでもできますか？",
        answer:
          "はい、プランの変更・キャンセルはいつでも可能です。アップグレードは即時反映され、ダウングレードは次の請求日から適用されます。キャンセル後も請求期間の終了まで現在のプランをご利用いただけます。",
      },
    ],
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-medium text-slate-200 pr-4">{item.question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-surface-900 text-slate-200">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </Link>
          <BrandMark size={18} />
          <span className="font-semibold">Puff Design</span>
          <span className="text-slate-500 text-sm">/ よくある質問</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">よくある質問</h1>
          <p className="text-slate-400">Puff Design に関するよくある質問と回答をまとめました</p>
        </div>

        <div className="space-y-10">
          {faqData.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold text-accent-light mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <FaqAccordion key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-white/10 bg-surface-800/60 p-8">
          <h3 className="text-lg font-semibold mb-2">まだ疑問がありますか？</h3>
          <p className="text-sm text-slate-400 mb-4">
            お探しの回答が見つからない場合は、フォーラムで質問するか、フィードバックをお送りください。
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/forum"
              className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors"
            >
              フォーラムへ
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
