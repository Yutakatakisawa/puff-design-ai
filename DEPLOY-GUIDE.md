# Puff Design AI デプロイガイド（初心者向け）

大学1年生でも分かるように、一つずつ丁寧に説明します。

---

## Part 1: GitHub にプロジェクトをプッシュする

### 1-1. Git がインストールされているか確認

PowerShell またはターミナルを開いて、次を入力：

```
git --version
```

「command not found」と出たら、[Git のダウンロードページ](https://git-scm.com/downloads)からインストールしてください。

---

### 1-2. GitHub アカウントを作る

1. [github.com](https://github.com) を開く
2. 「Sign up」からアカウント登録
3. メール認証を完了する

---

### 1-3. 新しいリポジトリを作る

1. GitHub にログインした状態で、右上の「+」→「New repository」をクリック
2. **Repository name**: `puff-design-ai`（好きな名前でOK）
3. **Public** を選択
4. 「Add a README file」は**チェックしない**（既にローカルにファイルがあるため）
5. 「Create repository」をクリック

---

### 1-4. プロジェクトフォルダで Git を初期化してプッシュ

PowerShell で、プロジェクトのフォルダに移動：

```
cd C:\Users\takis\.cursor\projects\puff-design-ai
```

まだ Git リポジトリになっていない場合、初期化：

```
git init
```

GitHub で作ったリポジトリの URL を使って、リモートを追加（`YOUR_USERNAME` は自分の GitHub ユーザー名に置き換え）：

```
git remote add origin https://github.com/YOUR_USERNAME/puff-design-ai.git
```

全ファイルをステージングしてコミット：

```
git add .
git commit -m "Initial commit: Puff Design AI"
```

GitHub にプッシュ：

```
git push -u origin main
```

※ 初回は GitHub のユーザー名とパスワード（またはトークン）を聞かれます。

---

## Part 2: Vercel にインポートしてデプロイする

### 2-1. Vercel にログイン

1. [vercel.com](https://vercel.com) を開く
2. 「Sign Up」→「Continue with GitHub」で GitHub アカウントと連携
3. 必要なら Vercel の認可を許可

---

### 2-2. プロジェクトをインポート

1. ダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」で、`puff-design-ai` が出ていればそれを選択
3. 出てこない場合は「Configure GitHub App」でリポジトリへのアクセスを許可してから再度表示を確認

---

### 2-3. プロジェクト設定

1. **Framework Preset**: `Next.js`（自動検出されることが多い）
2. **Root Directory**: そのままでOK（`./`）
3. **Environment Variables** の「Add」をクリック
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 自分の Gemini API キー（[Google AI Studio](https://aistudio.google.com/) で取得）
4. 「Deploy」をクリック

---

### 2-4. デプロイ完了

1〜3 分ほど待つと、緑色の「Visit」ボタンが表示されます。
2. クリックすると、公開されたサイトの URL が開きます（例: `https://puff-design-ai-xxxx.vercel.app`）

---

## トラブルシューティング

### 「git push できない」

- GitHub のパスワードの代わりに **Personal Access Token** が必要な場合があります
- [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) で新しいトークンを作成し、パスワードの代わりに入力

### 「Vercel でビルドエラーが出る」

- `npm run build` をローカルで実行してみる
- エラー内容を確認し、Vercel のデプロイログでも同じエラーが出ていないか確認

### 「API が動かない」

- Vercel のプロジェクト設定 → Environment Variables で `GEMINI_API_KEY` が正しく設定されているか確認
- デプロイ後も環境変数は反映されているので、再デプロイ（Redeploy）を試す

---

## 参考リンク

- [Git 入門](https://git-scm.com/book/ja/v2)
- [Vercel ドキュメント](https://vercel.com/docs)
- [Next.js デプロイ](https://nextjs.org/docs/deployment)
