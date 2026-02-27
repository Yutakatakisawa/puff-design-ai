import type { LayoutStructure, LayoutBlockType, TemplateItem, DesignMode } from "./types";

const BLOCK_PROPS: Record<LayoutBlockType, Record<string, unknown>> = {
  navbar: { text: "ナビゲーション", fontSize: 14, padding: 12 },
  hero: {
    text: "素晴らしいものを作る",
    subtext: "数秒でAI搭載UI",
    imageUrl: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1400&q=80",
    fontSize: 28,
    padding: 24,
    backgroundColor: "#1e1b4b",
  },
  features: {
    text: "特徴",
    fontSize: 20,
    padding: 20,
  },
  cards: {
    text: "カード",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    fontSize: 18,
    padding: 16,
  },
  cta: {
    text: "無料見積りを試す",
    buttonText: "やってみる",
    fontSize: 22,
    padding: 28,
    backgroundColor: "#6d28d9",
  },
  footer: {
    text: "© 2026 Puff Design",
    fontSize: 12,
    padding: 16,
  },
};

const TEMPLATES: Record<string, LayoutBlockType[]> = {
  landing: ["navbar", "hero", "features", "cards", "cta", "footer"],
  dashboard: ["navbar", "hero", "cards", "features", "cards", "footer"],
  mobile: ["navbar", "hero", "cards", "cta", "footer"],
  minimal: ["hero", "cta", "footer"],
};

function detectTemplate(prompt: string, mode: DesignMode): LayoutBlockType[] {
  const lower = prompt.toLowerCase();
  if (lower.includes("dashboard") || lower.includes("saas")) return TEMPLATES.dashboard;
  if (lower.includes("mobile") || lower.includes("app")) return TEMPLATES.mobile;
  if (lower.includes("web") || lower.includes("website")) return TEMPLATES.landing;
  if (lower.includes("minimal") || lower.includes("simple")) return TEMPLATES.minimal;
  if (lower.includes("cafe") || lower.includes("café") || lower.includes("カフェ") || lower.includes("コーヒー") || lower.includes("coffee")) return TEMPLATES.landing;
  if (lower.includes("restaurant") || lower.includes("レストラン") || lower.includes("飲食") || lower.includes("居酒屋") || lower.includes("イタリアン")) return TEMPLATES.landing;
  if (lower.includes("lp") || lower.includes("landing") || lower.includes("ランディング")) return TEMPLATES.landing;
  if (mode === "web") return TEMPLATES.landing;
  if (mode === "app") return TEMPLATES.mobile;
  return TEMPLATES.landing;
}

function makeCopy(prompt: string, variant: number): Record<LayoutBlockType, Record<string, unknown>> {
  const lower = prompt.toLowerCase();
  const isRoof = lower.includes("roof") || prompt.includes("屋根");
  const isSaas = lower.includes("saas") || lower.includes("dashboard");
  const isCafe =
    lower.includes("cafe") ||
    lower.includes("café") ||
    lower.includes("カフェ") ||
    lower.includes("コーヒー") ||
    lower.includes("coffee") ||
    lower.includes("喫茶");
  const isRestaurant =
    lower.includes("restaurant") ||
    lower.includes("レストラン") ||
    lower.includes("飲食") ||
    lower.includes("居酒屋") ||
    lower.includes("イタリアン") ||
    lower.includes("フレンチ");

  if (isCafe) {
    const cafeHeros = [
      { text: "毎日を、ちょっと特別に。", subtext: "自家焙煎の香りが届く、あたたかいカフェへ", badge: "自家焙煎珈琲", tags: "最短即日配送|無料テイスティング|駐車場完備" },
      { text: "本格珈琲と手作りのあたたかさ", subtext: "くつろぎのひとときをお届けします", badge: "豆からこだわる一杯", tags: "ペア割|Wi-Fi完備|予約可" },
      { text: "COFFEE & LIFE", subtext: "一杯のコーヒーが、一日の始まりに", badge: "Specialty Coffee", tags: "テイクアウト|イートイン|ギフト対応" },
    ];
    const cafeNavItems = "HOME|MENU|ABOUT|ACCESS|CONTACT";
    const cafeFeatureItems = "厳選豆の焙煎|こだわりのドリンク|手作りスイーツ|ゆったり空間";
    const cafeFeatureDescs = "新鮮な生豆を店舗で丁寧に焙煎|季節のフルーツや豆乳を使ったオリジナル|毎朝焼き上げる焼き菓子とケーキ|落ち着いた空間でまったり過ごせます";
    const cafeCardTitles = "ブレンド珈琲|シングルオリジン|デカフェ|季節限定ドリンク";
    const cafeCardSubtexts = "定番の一杯、深いコクと香り|産地を感じるストレートの味わい|カフェインレスで夜も安心|旬のフルーツやスパイスをプラス";
    const cafeCtas = [
      { text: "メニューを見る", subtext: "ドリンク・フード・スイーツのラインナップ", buttonText: "メニューを見る" },
      { text: "ご予約・お問い合わせ", subtext: "カジュアルな雰囲気でお気軽に", buttonText: "お問い合わせ" },
      { text: "まずは一杯、お試しください", subtext: "ご来店お待ちしております", buttonText: "アクセス" },
    ];
    const h = cafeHeros[variant % cafeHeros.length];
    const c = cafeCtas[variant % cafeCtas.length];
    return {
      navbar: {
        logoText: variant === 0 ? "CAFE PUFF" : variant === 1 ? "珈琲舎" : "COFFEE HOUSE",
        navItems: cafeNavItems,
        fontSize: 14,
        padding: 14,
      },
      hero: {
        text: h.text,
        subtext: h.subtext,
        heroBadge: h.badge,
        heroTags: h.tags,
        imageUrl:
          variant === 0
            ? "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80"
            : variant === 1
              ? "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80"
              : "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=80",
        fontSize: 26,
        padding: 28,
        backgroundColor: variant === 1 ? "#3d2817" : variant === 2 ? "#2c1810" : "#1a140f",
      },
      features: {
        text: "当店のこだわり",
        subtext: "お客様に最高の一杯をお届けするために",
        featureItems: cafeFeatureItems,
        featureDescs: cafeFeatureDescs,
        fontSize: 20,
        padding: 22,
      },
      cards: {
        text: "おすすめメニュー",
        subtext: "シンプルで上質な味わいをご提供",
        cardTitles: cafeCardTitles,
        cardSubtexts: cafeCardSubtexts,
        cardCount: 4,
        imageUrl:
          variant === 0
            ? "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
            : "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
        fontSize: 18,
        padding: 18,
      },
      cta: {
        text: c.text,
        subtext: c.subtext,
        buttonText: c.buttonText,
        fontSize: 20,
        padding: 28,
        backgroundColor: variant === 0 ? "#6f4e37" : variant === 1 ? "#8b6914" : "#5c4033",
      },
      footer: {
        text: "© 2026 Cafe Puff",
        subtext: "本格珈琲と手作りの味 — 東京都渋谷区〇〇 1-2-3",
      },
    };
  }

  if (isRestaurant) {
    const restHeros = [
      { text: "一期一会の食体験を", subtext: "旬の食材と匠の技でおもてなしいたします", badge: "完全予約制", tags: "個室あり|ペア可|記念日対応" },
      { text: "本場の味を、日常に", subtext: "イタリア直送のオリーブオイルと生パスタ", badge: "Chef's Table", tags: "ランチ|ディナー|テイクアウト" },
    ];
    const restNavItems = "HOME|メニュー|コース|アクセス|ご予約";
    const restFeatureItems = "厳選食材|シェフの技|ワインセレクト|プライベート空間";
    const restFeatureDescs = "契約農家から直接仕入れた旬の野菜|経験豊富なシェフが腕によりをかけて|ソムリエ厳選のペアリング|個室で特別なひとときを";
    const restCardTitles = "前菜・アペティフ|メインコース|デザート|ドリンク";
    const restCardSubtexts = "季節の前菜5種盛り|黒毛和牛のグリル|パティシエ特製|ワイン・カクテル";
    const restCtas = [
      { text: "ご予約はこちら", subtext: "お電話・Webで24時間受付", buttonText: "予約する" },
      { text: "メニューをご覧ください", subtext: "コース・単品のご案内", buttonText: "メニューを見る" },
    ];
    const h = restHeros[variant % restHeros.length];
    const c = restCtas[variant % restCtas.length];
    return {
      navbar: {
        logoText: variant === 0 ? "Restaurant Puff" : "TABLE D'OR",
        navItems: restNavItems,
      },
      hero: {
        text: h.text,
        subtext: h.subtext,
        heroBadge: h.badge,
        heroTags: h.tags,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
        backgroundColor: variant === 0 ? "#1a0f0a" : "#2d1810",
      },
      features: {
        text: "当店のこだわり",
        subtext: "お客様に最高の食体験を",
        featureItems: restFeatureItems,
        featureDescs: restFeatureDescs,
      },
      cards: {
        text: "人気メニュー",
        subtext: "旬の食材と技の結晶",
        cardTitles: restCardTitles,
        cardSubtexts: restCardSubtexts,
        cardCount: 4,
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      },
      cta: {
        text: c.text,
        subtext: c.subtext,
        buttonText: c.buttonText,
        backgroundColor: "#8b4513",
      },
      footer: { text: "© 2026 Restaurant Puff", subtext: "東京都港区〇〇 — 03-xxxx-xxxx" },
    };
  }

  if (isRoof) {
    const roofNavItems = "HOME|施工実績|サービス|料金案内|お問い合わせ";
    const roofFeatureItems = "無料現地調査|最短即日対応|10年保証|地域密着";
    const roofFeatureDescs = "ご自宅まで伺い状態を確認|お急ぎのご依頼にも対応|アフターサポートも万全|地元で30年の実績";
    const roofCardTitles = "雨漏り修理|屋根カバー工法|葺き替え|塗装リフォーム";
    const roofCardSubtexts = "漏水箇所の特定から修理まで|コストを抑えた屋根補修|全面葺き替えで耐久性UP|美観・防水の両立";
    return {
      navbar: {
        logoText: variant === 0 ? "屋根工事プロ" : variant === 1 ? "屋根ドットJP" : "雨漏り110番",
        navItems: roofNavItems,
      },
      hero: {
        text: variant === 0 ? "雨漏り・屋根修理を最短対応" : variant === 1 ? "地域密着の屋根リフォーム" : "屋根のトラブル、お任せください",
        subtext: "無料点検・最短即日・職人直営",
        heroBadge: "無料見積り・相談",
        heroTags: "10年保証|対応エリア広域|即日対応可",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
        backgroundColor: variant === 2 ? "#7c3aed" : "#1e1b4b",
      },
      features: {
        text: "選ばれる理由",
        subtext: "安心と品質で地域に貢献",
        featureItems: roofFeatureItems,
        featureDescs: roofFeatureDescs,
      },
      cards: {
        text: "施工メニュー",
        subtext: "お客様のニーズに合わせた施工をご提案",
        cardTitles: roofCardTitles,
        cardSubtexts: roofCardSubtexts,
        cardCount: 4,
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      },
      cta: {
        text: "今すぐ無料見積り",
        subtext: "お電話・Webフォームで24時間受付",
        buttonText: "無料相談はこちら",
        backgroundColor: variant === 1 ? "#9333ea" : "#6d28d9",
      },
      footer: { text: "© 2026 屋根工事プロ", subtext: "東京都〇〇区 — 施工エリア：関東一円" },
    };
  }

  if (isSaas) {
    const saasNavItems = "Product|Pricing|Docs|Blog|Login";
    const saasFeatureItems = "Realtime dashboards|AI forecasting|Team collaboration|API integration";
    const saasFeatureDescs = "Live metrics and alerts|Predict trends and anomalies|Share reports in Slack|Connect any data source";
    const saasCardTitles = "Analytics|Reports|Alerts|Integrations";
    const saasCardSubtexts = "Track KPIs in realtime|Export PDF and CSV|Custom thresholds|Slack, Jira, Linear";
    return {
      navbar: {
        logoText: "Nebula Analytics",
        navItems: saasNavItems,
      },
      hero: {
        text: variant === 0 ? "Data to decisions, instantly" : variant === 1 ? "Scale your SaaS with AI insights" : "One dashboard for your entire stack",
        subtext: "Realtime metrics, forecasting, and automation for modern teams",
        heroBadge: "14-day free trial",
        heroTags: "No credit card|SOC 2 compliant|5-min setup",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
      },
      features: {
        text: "Core capabilities",
        subtext: "Everything you need to ship faster",
        featureItems: saasFeatureItems,
        featureDescs: saasFeatureDescs,
      },
      cards: {
        text: "Dashboard widgets",
        subtext: "Pre-built and customizable blocks",
        cardTitles: saasCardTitles,
        cardSubtexts: saasCardSubtexts,
        cardCount: 4,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      },
      cta: {
        text: "Start your 14-day trial",
        subtext: "No credit card required — full access",
        buttonText: "Get started free",
      },
      footer: { text: "© 2026 Nebula Analytics", subtext: "Terms · Privacy · Status" },
    };
  }

  return {
    navbar: {
      logoText: "Puff Design",
      navItems: "Home|Features|Pricing|Docs|Contact",
    },
    hero: {
      text: variant === 0 ? "Design faster with AI" : "From prompt to polished UI",
      subtext: "Generate, edit, and export in minutes",
      heroBadge: "AI-powered design",
      heroTags: "No design skills needed|Export to Web|Unlimited variants",
      imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80",
    },
    features: {
      text: "Highlights",
      subtext: "Why teams choose Puff Design",
      featureItems: "Prompt to UI|Real-time preview|One-click export|Figma-ready",
      featureDescs: "Describe it, get it|See changes instantly|HTML, React, Vue|Import to Figma",
    },
    cards: {
      text: "Showcase cards",
      subtext: "Pre-built blocks for any project",
      cardTitles: "Landing pages|Dashboards|Mobile UI|E-commerce",
      cardSubtexts: "Hero, features, CTA|Charts and tables|iOS and Android|Product grids",
      cardCount: 4,
      imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    },
    cta: {
      text: "Create your first layout",
      subtext: "Free tier — no credit card required",
      buttonText: "Try it free",
    },
    footer: { text: "© 2026 Puff Design", subtext: "Terms · Privacy · Support" },
  };
}

function toLayout(types: LayoutBlockType[], prompt: string, variant = 0): LayoutStructure {
  const copy = makeCopy(prompt, variant);
  return {
    layout: types.map((type, i) => ({
      id: `${type}-${Date.now()}-${variant}-${i}`,
      type,
      props: { ...BLOCK_PROPS[type], ...copy[type] },
    })),
  };
}

export function generateLayoutFromPrompt(prompt: string, mode: DesignMode = "app"): Promise<LayoutStructure> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const types = detectTemplate(prompt, mode);
      resolve(toLayout(types, prompt, 0));
    }, 700);
  });
}

export function generateLayoutVariants(prompt: string, count = 3, mode: DesignMode = "app"): Promise<LayoutStructure[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const types = detectTemplate(prompt, mode);
      const variants = Array.from({ length: count }, (_, i) => toLayout(types, prompt, i));
      resolve(variants);
    }, 900);
  });
}

export function getTemplates(): TemplateItem[] {
  return [
    {
      id: "cafe",
      label: "カフェLP",
      prompt: "カフェのLPを作って",
      layout: toLayout(TEMPLATES.landing, "カフェのLPを作って", 0),
    },
    {
      id: "landing",
      label: "屋根会社LP",
      prompt: "屋根工事店向けLPを作って",
      layout: toLayout(TEMPLATES.landing, "屋根工事店向けLP", 0),
    },
    {
      id: "dashboard",
      label: "SaaSダッシュボード",
      prompt: "SaaS dashboard",
      layout: toLayout(TEMPLATES.dashboard, "SaaS dashboard", 1),
    },
    {
      id: "mobile",
      label: "モバイルアプリ",
      prompt: "Mobile app homepage",
      layout: toLayout(TEMPLATES.mobile, "Mobile app homepage", 2),
    },
  ];
}
