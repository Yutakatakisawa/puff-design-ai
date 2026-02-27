"use client";

import { ArrowLeft, Shield, Database, Cookie, Eye, Lock, UserCheck, Mail } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

interface Section {
  icon: React.ElementType;
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    icon: Database,
    title: "収集する情報",
    content: [
      "Puff Design では、サービスの提供と改善のために以下の情報を収集します。",
      "アカウント情報：ご登録時にご提供いただくメールアドレス、表示名。これらはアカウントの識別とログインに使用されます。",
      "利用データ：デザイン生成回数、使用機能、エクスポート形式などの利用状況。サービスの品質向上と料金プランの管理に使用されます。",
      "プロンプトデータ：入力されたプロンプトのテキスト。デザイン生成のために AI モデルに送信されます。音声入力を使用した場合、音声はテキストに変換された後に処理され、音声データ自体は保存されません。",
      "デバイス情報：ブラウザの種類、OS、画面解像度などの技術情報。サービスの互換性確保に使用されます。",
    ],
  },
  {
    icon: Cookie,
    title: "Cookie の使用",
    content: [
      "Puff Design では以下の Cookie を使用しています。",
      "必須 Cookie（puff_session）：ログイン状態の維持に必要です。有効期間は30日間です。この Cookie なしではサービスをご利用いただけません。",
      "同意 Cookie（puff_cookie_consent）：Cookie 使用への同意状況を記録します。有効期間は1年間です。",
      "分析 Cookie（puff_analytics）：サービスの利用状況を匿名で収集し、機能改善に役立てます。この Cookie はオプションであり、ログイン画面からいつでも無効にできます。",
      "Cookie の設定はブラウザの設定からも管理できます。ただし、必須 Cookie を無効にするとサービスにログインできなくなります。",
    ],
  },
  {
    icon: Eye,
    title: "情報の利用目的",
    content: [
      "収集した情報は以下の目的でのみ使用されます。",
      "サービスの提供：ユーザー認証、デザイン生成、エクスポート機能の提供。",
      "サービスの改善：利用パターンの分析に基づく機能の改善、新機能の開発。",
      "カスタマーサポート：お問い合わせへの対応、技術的な問題の解決。",
      "料金管理：プランに応じた生成回数の管理、アップグレード・ダウングレードの処理。",
      "お客様の情報を広告目的で第三者に販売・提供することは一切ありません。",
    ],
  },
  {
    icon: Lock,
    title: "データの保護",
    content: [
      "お客様のデータの安全性を最優先に考えています。",
      "通信の暗号化：すべての通信は TLS（SSL）によって暗号化されています。",
      "データの保管：サーバー上のデータは暗号化された状態で保管されます。",
      "アクセス制御：お客様のデータにアクセスできるのは、業務上必要な最小限のスタッフに限られます。",
      "AI モデルへの送信：プロンプトデータは AI モデルでの処理のために送信されますが、学習データとして使用されることはありません。",
    ],
  },
  {
    icon: UserCheck,
    title: "ユーザーの権利",
    content: [
      "お客様は以下の権利を有しています。",
      "アクセス権：ご自身のデータの閲覧を請求できます。",
      "訂正権：不正確なデータの訂正を請求できます。",
      "削除権：アカウントとそれに紐づくすべてのデータの削除を請求できます。削除は請求から30日以内に完了します。",
      "データポータビリティ権：ご自身のデータを一般的な形式でエクスポートできます。",
      "同意の撤回：分析 Cookie への同意はいつでも撤回できます。ログイン画面の設定から変更してください。",
    ],
  },
  {
    icon: Shield,
    title: "未成年者のプライバシー",
    content: [
      "Puff Design は 13 歳未満のお子様を対象としたサービスではありません。13 歳未満の方からの情報を意図的に収集することはありません。",
      "13 歳未満のお子様が当サービスに情報を提供したことが判明した場合、速やかに該当データを削除します。",
    ],
  },
  {
    icon: Mail,
    title: "お問い合わせ・ポリシーの変更",
    content: [
      "本プライバシーポリシーに関するご質問やご懸念がある場合は、以下の方法でお問い合わせください。",
      "メール：privacy@puffdesign.app",
      "フォーラム：Puff Design フォーラムの「プライバシー」カテゴリに投稿",
      "本ポリシーは必要に応じて更新されることがあります。重要な変更がある場合は、サービス内の通知およびメールでお知らせします。",
      "最終更新日：2026年2月26日",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-900 text-slate-200">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </Link>
          <BrandMark size={18} />
          <span className="font-semibold">Puff Design</span>
          <span className="text-slate-500 text-sm">/ プライバシーポリシー</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-accent-light" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">プライバシーに関するお知らせ</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Puff Design はお客様のプライバシーを尊重し、個人情報の保護に努めています。
            本ページでは、当サービスにおける情報の取り扱いについて説明します。
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-surface-800/40 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-accent-light" />
                </div>
                <h2 className="text-lg font-semibold">
                  {i + 1}. {section.title}
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-400 leading-relaxed pl-12">
                {section.content.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
