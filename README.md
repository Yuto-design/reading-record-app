# Reading Record App（読書記録アプリ）

読書時間の記録と、読んだ本をまとめる「自分用図書館」機能を持つ Web アプリです。  
データはブラウザの **localStorage** に保存されるため、バックエンド不要でそのまま利用できます。

## 主な機能

| ページ | パス | 説明 |
|--------|------|------|
| **Home** | `/`, `/home` | 今日の読書サマリー・今週のグラフ・最近追加した本の一覧 |
| **Reading Time** | `/reading` | 読書タイマー・ポモドーロタイマー・月間カレンダー |
| **Library** | `/library` | 本の登録・一覧・検索・詳細・編集（読みたい / 読んでいる / 読了） |
| **Stats** | `/stats` | 月別・週別の読書時間グラフ、目標達成率 |
| **Completed** | `/completed` | 読了した本の一覧と年別サマリー |
| **Settings** | `/settings` | 日・週・月・年・冊数の目標設定、データのエクスポート／インポート |

- **読書セッション**: タイマーで計測した時間を日付ごとに記録。直近 7 日間の折れ線グラフや月間カレンダーで可視化。
- **図書館**: タイトル・著者・概要・表紙画像・評価・タグ・読書メモ・読了日などを登録し、ステータス（読みたい / 読んでいる / 読了）で管理。
- **目標**: 1 日・1 週間・1 ヶ月・1 年の読書時間（分）と年間読了冊数を設定し、Stats などで達成率を確認可能。

## 技術スタック

- **React** 19（Create React App）
- **React Router** v7（画面切り替え）
- **Recharts**（折れ線・棒グラフ）
- **date-fns**（日付フォーマット・週・月の計算）
- **localStorage**（読書セッション・本・設定の永続化）

その他: `react-circular-progressbar`（目標達成率）、`react-countdown-circle-timer`（ポモドーロ）など。

## 必要な環境

- **Node.js** 18 以上（推奨: 20+）
- **npm** または **yarn**

## セットアップ・起動

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/reading-record-app.git
cd reading-record-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリが表示されます。

## 利用可能なスクリプト

| コマンド | 説明 |
|----------|------|
| `npm start` | 開発モードで起動（ホットリロード有効） |
| `npm run build` | 本番用にビルド（`build/` に出力） |
| `npm test` | テストランナーを起動（Watch モード） |
| `npm run eject` | CRA の設定をプロジェクトに展開（非推奨・取り消し不可） |

## プロジェクト構成

```
src/
  App.jsx              # ルーティング（BrowserRouter, Routes）
  components/          # 共通レイアウト（Layout）、RevealOnScroll など
  pages/               # 各画面（Home, ReadingTimePage, LibraryPage, ...）
  features/            # 機能単位のコンポーネント
    home/              # ホーム用（HomeHero, HomeOverview, HomeRecentBooks など）
    readingSession/    # タイマー、ポモドーロ、カレンダー、週間グラフ
    myLibrary/         # 図書館（BookList, BookForm, BookDetail, 検索・フィルタ）
  utils/               # storage（localStorage 読み書き）、changeTime, changeRecord, imageCompress
  hooks/               # useInView など
docs/
  diagrams/            # draw.io 形式の設計図（アーキテクチャ・画面遷移・データモデルなど）
```

設計図の詳細は `docs/diagrams/` 内の drawio ファイルを参照してください。

## データの保存について

- すべてのデータは **同一オリジンの localStorage** にのみ保存されます。
- サーバーへは送信されないため、別デバイスや別ブラウザとは自動同期されません。
- **Settings** の「エクスポート」で JSON をダウンロードし、別環境では「インポート」で取り込むことができます（上書き or マージを選択可能）。

## PWA について

`public/manifest.json` が含まれており、ホスティング環境によっては PWA としてインストール可能です。オフライン動作やプッシュ通知は現状未実装です。

## ライセンス

private リポジトリの場合は利用規約に従ってください。
