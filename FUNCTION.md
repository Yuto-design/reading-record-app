# FUNCTION.md — アプリ主要ファイルの機能一覧

README の「プロジェクト構成」を補完し、**各ファイルが何をしているか**を開発者が追いやすい形でまとめたコード地図です。久しぶりに触るときの**振り返り**用に、逆引きとデータの流れを冒頭にまとめています。

- **配置**: リポジトリルート
- **対象**: `src/` 配下の主要な JS/JSX ファイル（CSS は「スタイルは ○○.css」と一言のみ）

各ファイルの記載方針:
- **役割**: アプリ全体で担っている役割（1〜2文）
- **主な機能・責務**: UI/振る舞い、入出力、副作用
- **主要な export / props / 引数**: 他ファイルからの利用のされ方
- **依存**: 使用する `utils`・`storage`・他 feature（必要に応じて）

---

## 振り返り用：逆引き・データの流れ

久しぶりにコードを見るときは、ここからたどると早い。

### やりたいこと → 主に触るファイル

| やりたいこと | 見る・触る場所 |
|-------------|----------------|
| ルートを増やす・変える | [App.jsx](src/App.jsx), [Layout.jsx](src/components/Layout.jsx) の `navItems` |
| 読書時間の「記録」がどこで保存されるか | [storage.js](src/utils/storage.js) の `saveReadingSession`。**呼び出し**は [Timer.jsx](src/features/readingSession/Timer.jsx)（停止時）と [ReadingCalendar.jsx](src/features/readingSession/ReadingCalendar.jsx)（分数追加） |
| 本の追加・編集・削除の流れ | [LibraryPage.jsx](src/pages/LibraryPage.jsx) が状態を握る → [BookForm](src/features/myLibrary/BookForm.jsx) / [BookDetail](src/features/myLibrary/BookDetail.jsx) → [storage.js](src/utils/storage.js) の `saveBook` / `deleteBook` |
| 目標（日・週・月・年・冊数）の保存先 | [storage.js](src/utils/storage.js) の `getSettings` / `setSettings`。**画面**は [SettingsPage.jsx](src/pages/SettingsPage.jsx)、**表示**は [HomeOverview.jsx](src/features/home/HomeOverview.jsx) と [StatsPage.jsx](src/pages/StatsPage.jsx) |
| データのエクスポート・インポート | [storage.js](src/utils/storage.js) の `exportData` / `importData`。**UI**は [SettingsPage.jsx](src/pages/SettingsPage.jsx) |
| 一覧のフィルタ・検索・並び替え | [LibraryPage.jsx](src/pages/LibraryPage.jsx) で状態を組み合わせ → [BookStatusSidebar](src/features/myLibrary/BookStatusSidebar.jsx)（ステータス・著者・タグ）、[LibrarySearchFilter](src/features/myLibrary/LibrarySearchFilter.jsx)（検索・ソート） |
| ホームの「今日の読書」表示 | [HomeOverview.jsx](src/features/home/HomeOverview.jsx)（storage の sessions + settings で集計・円形表示） |
| カレンダーで日付の記録を編集・削除 | [ReadingCalendar.jsx](src/features/readingSession/ReadingCalendar.jsx) 内の `DayDetailModal`。 [changeRecord.js](src/utils/changeRecord.js) の `updateReadingSession` / `deleteReadingSession` |

### データの置き場所（localStorage）

| キー | 中身 | 読む/書く主なファイル |
|------|------|------------------------|
| `reading_sessions` | 読書セッション配列（日付・分数・bookId 等） | storage.js（CRUD）, Timer, ReadingCalendar, StatsPage, HomeOverview, WeeklyReadingChart 等 |
| `reading_books` | 本の配列 | storage.js（CRUD）, LibraryPage, BookForm, BookDetail, CompletedPage, StatsPage, HomeRecentBooks 等 |
| `reading_settings` | 目標（日・週・月・年・冊数） | storage.js（get/set）, SettingsPage, HomeOverview, StatsPage |

### よく触ることになりがちなファイル

- **画面を増やす・変える**: `App.jsx`, `Layout.jsx`, 対応する `pages/*.jsx`
- **本の項目を増やす**: `storage.js` の `saveBook` 正規化, `BookForm.jsx`, `BookDetail.jsx`（表示）
- **読書セッションの項目を増やす**: `storage.js` の `saveReadingSession`, `Timer.jsx`, `ReadingCalendar.jsx` のモーダル
- **集計ロジックを変える**: `StatsPage.jsx`, `HomeOverview.jsx`
- **画像・容量まわり**: `utils/imageCompress.js`, `BookForm.jsx`（表紙・メモ添付）

### 自分用メモ（自由に追記して OK）

- （例: 「〇〇を変更したら △△ も確認すること」「XX のバグは YY が原因だった」など）

---

## 1. エントリ・ルーティング

### [src/index.js](src/index.js)

- **役割**: React アプリのエントリポイント。
- **主な機能**: `ReactDOM.createRoot` でルート要素を取得し、`<App />` をマウント。`index.css` を import。`StrictMode` でラップ。
- **export**: なし（副作用のみ）。

### [src/App.jsx](src/App.jsx)

- **役割**: ルーティングの定義とレイアウトの組み立て。
- **主な機能**: `BrowserRouter` と `Routes` でパスとコンポーネントを対応付け。`Layout` を親要素とし、その中に `Outlet` で子ルートを表示。
- **ルート一覧**:
  - `/`, `/home` → `Home`
  - `/reading` → `ReadingTimePage`
  - `/library` → `LibraryPage`
  - `/stats` → `StatsPage`
  - `/completed` → `CompletedPage`
  - `/settings` → `SettingsPage`
- **依存**: `react-router-dom`, 各ページコンポーネント, `Layout`, `App.css`。

---

## 2. 共通コンポーネント（components/）

### [src/components/Layout.jsx](src/components/Layout.jsx)

- **役割**: 全ページ共通のレイアウト（ヘッダー + メイン領域）。
- **主な機能**:
  - ヘッダーに「Reading Record」タイトル（`/` へのリンク）とナビゲーション（Home, Reading Time, My Library, Stats, Completed, Settings）を表示。
  - `useLocation()` で現在パスを取得し、`layout--home`, `layout--reading` などのクラスを付与してページ別スタイルを適用。
  - 子ルートは `<Outlet />` で描画。
- **ナビ**: `navItems` 配列（`to`, `label`, `isActive`, `icon`）で定義。各アイコンは SVG コンポーネント（HomeIcon, ReadingIcon 等）。
- **スタイル**: [src/components/Layout.css](src/components/Layout.css)

### [src/components/RevealOnScroll.jsx](src/components/RevealOnScroll.jsx)

- **役割**: スクロールでビューポートに入ったタイミングで子要素を表示するラッパー。
- **主な機能**: `useInView` で要素の交差を検知し、`isInView` が true のときに `home-reveal--visible` クラスを付与。
- **props**: `children`, `className`, `as`（ラップする要素、既定は `'div'`）, その他 DOM 属性。
- **依存**: [src/hooks/useInView.js](src/hooks/useInView.js)。スタイルは親（Home）の CSS で制御。

---

## 3. フック（hooks/）

### [src/hooks/useInView.js](src/hooks/useInView.js)

- **役割**: 要素がビューポートに入ったかどうかを検知するカスタムフック。
- **主な機能**: `IntersectionObserver` で対象要素を監視。交差したら `isInView` を true にし、一度 true になったらそのまま維持。
- **引数**: `options` — `threshold`（既定 0.1）, `rootMargin`（既定 `'0px 0px -40px 0px'`）。
- **戻り値**: `[ref, isInView]`。`ref` を監視したい要素に付与する。

---

## 4. ページ（pages/）

各ページは「どの feature を組み合わせているか」「storage のどのデータを読むか」を中心に記載。

### [src/pages/Home.jsx](src/pages/Home.jsx)

- **役割**: トップページ。今日の読書サマリー・今週のグラフ・最近追加した本を一覧できる。
- **主な機能**:
  - `HomeHero`（挨拶・キャッチコピー・CTA）、`HomeHeroFeatures`（4つの機能カード）、その下に「REPORT.」として `HomeOverview`（今日の読書と目標達成率）、`WeeklyReadingChart`（直近7日）、`HomeRecentBooks`（最近3冊）を配置。
  - REPORT 領域は `RevealOnScroll` でラップし、スクロールで表示。
  - 各カードから「READ MORE」で `/reading` または `/library` へリンク。
- **依存**: features/home（HomeHero, HomeHeroFeatures, HomeOverview, HomeRecentBooks）, features/readingSession（WeeklyReadingChart）, RevealOnScroll。スタイル: [src/pages/styles/PageCommon.css](src/pages/styles/PageCommon.css), [src/pages/styles/Home.css](src/pages/styles/Home.css)

### [src/pages/ReadingTimePage.jsx](src/pages/ReadingTimePage.jsx)

- **役割**: 読書時間の記録とタイマー・ポモドーロ・カレンダーを一画面に集約するページ。
- **主な機能**:
  - `Timer`: 開始/停止で読書時間を計測し、停止時にセッションを保存。`onSessionSaved` で親の `refreshKey` を更新し、カレンダー等の再描画を促す。
  - `PomodoroTimer`: 作業/休憩のカウントダウン（読書セッションとは連携しない）。
  - `ReadingCalendar`: `key={cal-${refreshKey}}` でセッション変更時に再マウント。日付クリックでその日の記録の編集・追加が可能。
- **依存**: Timer, PomodoroTimer, ReadingCalendar。スタイル: PageCommon.css, [src/pages/styles/ReadingTimePage.css](src/pages/styles/ReadingTimePage.css)

### [src/pages/LibraryPage.jsx](src/pages/LibraryPage.jsx)

- **役割**: 本棚の管理。本の一覧・検索・フィルタ・追加・詳細・編集・削除を行う。
- **主な機能**:
  - URL の `?book=id` を `useSearchParams` で読み、該当 ID があれば詳細を表示（`BookDetailPage`）。
  - `getBooks()` で一覧を取得。`useBookStatusFilter` でステータス（すべて・読みたい・読んでいる・読了）で絞り込み。
  - 著者・タグは `allAuthors` / `allTags` を算出し、`BookStatusSidebar` で著者セレクト・タグピルを表示。`filteredByAuthor` → `filteredByTags` の順で絞り込み。
  - `useLibrarySearchFilter` で検索クエリと並び替えを適用し、`sortedBooks` を `BookList` に渡す。
  - 「本を追加」で `BookForm` を表示。保存時は `saveBook` → `refreshBooks` → 追加フォームを閉じる。
  - 詳細表示時は `BookDetailPage` に `onSave`（`saveBook` + `refreshBooks`）, `onClose`, `onDelete`（`deleteBook` + `refreshBooks` + 詳細を閉じる）, `initialEditMode` を渡す。
- **依存**: storage（getBooks, saveBook, deleteBook）, BookForm, BookList, BookDetailPage, BookStatusSidebar, LibrarySearchFilter。スタイル: PageCommon.css, [src/pages/styles/LibraryPage.css](src/pages/styles/LibraryPage.css)

### [src/pages/StatsPage.jsx](src/pages/StatsPage.jsx)

- **役割**: 読書の統計と分析。月別・週間・曜日別の読書時間、目標達成率、ストリーク、タグ/著者別時間、評価分布などを表示。
- **主な機能**:
  - `getReadingSessions`, `getBooks`, `getSettings` を useEffect で取得し、useMemo で各種集計（月別読書時間・週間トレンド・曜日別・ストリーク・目標進捗・タグ/著者別時間・月別読了冊数・評価分布）を計算。
  - サマリー（総読書時間・記録数・1回あたり平均・読了冊数・平均評価）、目標の進捗バー、連続読書日数、直近7日・曜日別・月別の BarChart（Recharts）、タグ/著者リスト、評価分布グラフを表示。
  - データが無い場合は「今日からタイマーで記録を始めよう」の CTA リンクを表示。
- **依存**: storage, changeTime（formatMinutes）, recharts, date-fns。スタイル: PageCommon.css, [src/pages/styles/StatsPage.css](src/pages/styles/StatsPage.css)

### [src/pages/CompletedPage.jsx](src/pages/CompletedPage.jsx)

- **役割**: 読了した本の一覧と年別サマリーを表示するページ。
- **主な機能**:
  - `getBooks()` から `status === 'read'` を抽出し、`finishedAt` または `createdAt` で降順ソート。
  - 年別サマリー（各年の冊数）をチップ表示。読了リストは表紙・タイトル・著者・読了日・評価（★）・メモ（120字まで）を表示。
  - 各項目クリックで `navigate(/library?book=${bookId})` により Library の詳細を開く。
  - 0 冊の場合は「My Library で本を追加し、ステータスを読了にするとここに表示されます」と案内。
- **依存**: storage（getBooks）, date-fns（format）。スタイル: PageCommon.css, [src/pages/styles/CompletedPage.css](src/pages/styles/CompletedPage.css)

### [src/pages/SettingsPage.jsx](src/pages/SettingsPage.jsx)

- **役割**: 読書目標の設定とデータのエクスポート・インポートを行うページ。
- **主な機能**:
  - 目標: 1日・週・月・年（分）と目標読了冊数（冊/年）を入力。`getSettings()` で初期表示し、`setSettings(goals)` で保存。「保存しました」を 2 秒間表示。
  - エクスポート: `exportData()` で全データ（sessions, books, settings）を JSON で取得し、`reading-record-YYYY-MM-DD.json` としてダウンロード。
  - インポート: モード（上書き / マージ）をラジオで選択し、JSON ファイルを選択すると `importData(data, importMode)` で復元。成功・エラーをメッセージ表示。復元後に `getSettings()` で目標を再取得。
  - 現在の記録件数（セッション数・本数）を表示。
- **依存**: storage（getSettings, setSettings, exportData, importData, getReadingSessions, getBooks）, changeTime（formatMinutes）。スタイル: PageCommon.css, [src/pages/styles/SettingsPage.css](src/pages/styles/SettingsPage.css)

---

## 5. 機能別コンポーネント（features/）

### 5.1 features/home

#### [src/features/home/index.js](src/features/home/index.js)

- **役割**: home 機能のパブリック API。各コンポーネントを re-export。
- **export**: `HomeHero`, `HomeHeroFeatures`, `HomeOverview`, `HomeRecentBooks`。

#### [src/features/home/HomeHero.jsx](src/features/home/HomeHero.jsx)

- **役割**: トップのヒーロー領域。挨拶とキャッチコピーでアプリの概要を伝える。
- **主な機能**: 挨拶ラベルは `getBooks` / `getReadingSessions` の有無で「はじめの一冊を登録してみよう」か、時間帯で「おはよう」「こんにちは」「こんばんは」を表示。キャッチコピーと「今すぐ読み始める」（/reading）、「本棚をひらく」（/library）の CTA。
- **依存**: storage（getBooks, getReadingSessions）。スタイル: [src/features/home/styles/HomeHero.css](src/features/home/styles/HomeHero.css)

#### [src/features/home/HomeHeroFeatures.jsx](src/features/home/HomeHeroFeatures.jsx)

- **役割**: アプリの主な機能を 4 つのカードで紹介するセクション。
- **主な機能**: 静的データ `FEATURES_DATA`（タイマー・本棚・メモ・グラフ）に基づき、画像・タグ・タイトル・説明・READ MORE リンクを表示。
- **依存**: なし（外部画像 URL 使用）。スタイル: [src/features/home/styles/HomeHeroFeatures.css](src/features/home/styles/HomeHeroFeatures.css)

#### [src/features/home/HomeOverview.jsx](src/features/home/HomeOverview.jsx)

- **役割**: 今日・今週・今月・総時間・登録冊数と、設定した目標に対する達成率を円形で表示する。
- **主な機能**: `getReadingSessions`, `getBooks`, `getSettings` から今日/今週/今月の分数と目標を計算。円形プログレス（今日・今週・今月・総時間・登録冊数）を表示。データが無いときは「今日からタイマーで記録を始めよう」、目標達成時は「今日の目標、達成！」等のメッセージを表示。
- **依存**: storage, date-fns, changeTime（formatMinutes）。スタイル: [src/features/home/styles/HomeOverview.css](src/features/home/styles/HomeOverview.css)

#### [src/features/home/HomeRecentBooks.jsx](src/features/home/HomeRecentBooks.jsx)

- **役割**: 最近追加した本を最大 3 冊表示するブロック。
- **主な機能**: `getBooks()` を `createdAt` 降順でソートし先頭 3 冊を表示。表紙・タイトル・著者・ステータス（`getBookStatus`, `STATUS_LABELS`）。各カードは `/library?book=id` へのリンク。「もっと見る」で `/library`。
- **依存**: storage（getBooks）, BookStatusSidebar（getBookStatus）, constants（STATUS_LABELS）。スタイル: [src/features/home/styles/HomeRecentBooks.css](src/features/home/styles/HomeRecentBooks.css)

### 5.2 features/readingSession

#### [src/features/readingSession/Timer.jsx](src/features/readingSession/Timer.jsx)

- **役割**: 読書時間を計測し、停止時に 1 件の読書セッションとして保存するタイマー。
- **主な機能**: 開始で経過秒を 1 秒ごとに更新、停止で `saveReadingSession({ date, minutes, bookId? })` を呼び出し、`onSessionSaved` で親に通知。経過表示は `TimerChart`（円形プログレス）。「読んだ本」は `getBooks` の status が reading/read のものから選択可能（任意）。
- **props**: `onSessionSaved`（オプション）。
- **依存**: storage（saveReadingSession, getBooks）, date-fns（format）, TimerChart。スタイル: [src/features/readingSession/styles/Timer.css](src/features/readingSession/styles/Timer.css)

#### [src/features/readingSession/TimerChart.jsx](src/features/readingSession/TimerChart.jsx)

- **役割**: 経過秒を円形プログレスで表示するサブコンポーネント。
- **主な機能**: 経過秒を 3600 秒（1 時間）を 100% として表示。`elapsed` が 0 のときは "0:00"、それ以外は "分:秒" または "時:分:秒" で表示。`running` で色を切り替え。
- **props**: `elapsed`（秒）, `running`（boolean）。
- **依存**: react-circular-progressbar。

#### [src/features/readingSession/PomodoroTimer.jsx](src/features/readingSession/PomodoroTimer.jsx)

- **役割**: ポモドーロ式の作業/休憩カウントダウン。読書セッションの記録は行わない。
- **主な機能**: 作業時間（分）・休憩時間（分）・ラウンド数を入力可能。`CountdownCircleTimer` で作業→休憩→次ラウンドと進め、全ラウンド終了で停止。開始・停止・リセット。停止中は残り時間を保持し再開可能。
- **依存**: react-countdown-circle-timer。スタイル: [src/features/readingSession/styles/PomodoroTimer.css](src/features/readingSession/styles/PomodoroTimer.css)

#### [src/features/readingSession/ReadingCalendar.jsx](src/features/readingSession/ReadingCalendar.jsx)

- **役割**: 月間カレンダーで読書時間を日付ごとに表示し、日付クリックでその日の記録の編集・追加・削除を行う。
- **主な機能**: `getReadingSessions` を日付で集計し、各日に分数を表示。前月/次月で月を切り替え。日付クリックで `DayDetailModal` を開き、その日のセッション一覧・編集（分数・紐付き本）・削除・「分数を追加」で新規 `saveReadingSession`。`updateReadingSession`, `deleteReadingSession` を使用。
- **props**: `onSessionsChange`（記録変更時のコールバック）。
- **依存**: storage（getReadingSessions, saveReadingSession, getBooks, getBookById）, changeRecord（updateReadingSession, deleteReadingSession）, date-fns。スタイル: [src/features/readingSession/styles/ReadingCalendar.css](src/features/readingSession/styles/ReadingCalendar.css)

#### [src/features/readingSession/WeeklyReadingChart.jsx](src/features/readingSession/WeeklyReadingChart.jsx)

- **役割**: 直近 7 日間の読書時間を折れ線グラフで表示する。
- **主な機能**: `getReadingSessions` から日付ごとの分数を集計し、Recharts の `LineChart` で表示。`compact`, `theme`（light/dark）, `fullHeight` で Home 用・Reading Time 用の見た目を切り替え。
- **props**: `compact`, `theme`, `fullHeight`。
- **依存**: storage（getReadingSessions）, recharts, date-fns。スタイル: [src/features/readingSession/styles/WeeklyReadingChart.css](src/features/readingSession/styles/WeeklyReadingChart.css)

### 5.3 features/myLibrary

#### [src/features/myLibrary/constants.js](src/features/myLibrary/constants.js)

- **役割**: 本のステータス表示用ラベルを一元管理。
- **export**: `STATUS_LABELS` — `{ want: '読みたい', reading: '読んでいる', read: '読了' }`。

#### [src/features/myLibrary/BookStatusSidebar.jsx](src/features/myLibrary/BookStatusSidebar.jsx)

- **役割**: 本一覧のフィルタ UI（ステータス・著者・タグ）を提供するサイドバー。
- **主な機能**: ステータスタブ（すべて・読みたい・読んでいる・読了）で切り替え。著者一覧のセレクト、タグのピル（複数選択可）。`useBookStatusFilter(books)` で `statusFilter`, `filteredBooks`, `statusCounts` を算出。`getBookStatus(book)` は want/reading/read のいずれかを返すヘルパー。
- **export**: `getBookStatus`, `STATUS_FILTER_ALL`, `STATUS_FILTER_OPTIONS`, `useBookStatusFilter`, default `BookStatusSidebar`。
- **props**: statusFilter, onStatusChange, statusCounts, authorFilter, allAuthors, onAuthorChange, allTags, selectedTags, onToggleTag。
- **依存**: なし。スタイル: [src/features/myLibrary/styles/BookStatusSidebar.css](src/features/myLibrary/styles/BookStatusSidebar.css)

#### [src/features/myLibrary/LibrarySearchFilter.jsx](src/features/myLibrary/LibrarySearchFilter.jsx)

- **役割**: 本一覧の検索・並び替えの状態管理と UI を提供する。
- **主な機能**:
  - `useLibrarySearchFilter(filteredBooks)`: 検索クエリ（タイトル・著者・概要・メモ・出版社で部分一致）と sortBy（タイトル順・著者順・登録日昇順/降順・読了日昇順/降順）でフィルタ＆ソートし、`searchFilteredBooks`, `sortedBooks` を返す。
  - `LibrarySearchToolbar`: 検索入力と並び替えセレクトの UI。
  - `LibraryTagFilter`: タグピルで絞り込み（親で allTags, selectedTags, onToggleTag を管理）。
- **export**: `SORT_OPTIONS`, `useLibrarySearchFilter`, `LibraryTagFilter`, `LibrarySearchToolbar`。スタイル: [src/features/myLibrary/styles/LibrarySearchFilter.css](src/features/myLibrary/styles/LibrarySearchFilter.css)

#### [src/features/myLibrary/BookForm.jsx](src/features/myLibrary/BookForm.jsx)

- **役割**: 本の新規追加・編集用フォーム。全フィールドを一画面で入力する。
- **主な機能**: タイトル・著者・出版社・ページ数・表紙（URL 入力 or ファイル選択→`compressImageDataUrl` で圧縮）、ステータス（want/reading/read）、読了時は評価（1〜5★）・読了日、タグ（カンマ/読点で複数追加）、概要、読書メモ・メモ添付画像（最大 10 枚・圧縮）。送信で `onSave(bookData)`、キャンセルで `onCancel()`。
- **props**: `book`（編集時）, `onSave`, `onCancel`。
- **依存**: utils/imageCompress（compressImageDataUrl）。スタイル: [src/features/myLibrary/styles/BookForm.css](src/features/myLibrary/styles/BookForm.css)

#### [src/features/myLibrary/BookList.jsx](src/features/myLibrary/BookList.jsx)

- **役割**: 本の配列をカード一覧で表示し、選択・編集・削除の入口を提供する。
- **主な機能**: 各カードに表紙・タイトル・タグ（最大5個+残り数）・ステータス・著者・評価（読了時）。クリックで `onSelect(book)`、編集ボタンで `onEdit(book)`、削除ボタンで `onDelete(book.id)`。空のときは `emptyMessage` を表示。
- **props**: `books`, `onSelect`, `onEdit`, `onDelete`, `emptyMessage`。
- **依存**: BookStatusSidebar（getBookStatus）, constants（STATUS_LABELS）。スタイル: [src/features/myLibrary/styles/BookList.css](src/features/myLibrary/styles/BookList.css)

#### [src/features/myLibrary/BookDetail.jsx](src/features/myLibrary/BookDetail.jsx)

- **役割**: 1 冊の詳細表示と編集モードの切り替え。累計読書時間・メモ添付画像のライトボックスも担当。
- **主な機能**:
  - 表示: 表紙・タイトル・ステータス・タグ・著者・出版社/ページ数・累計読書時間（`getReadingSessions` で bookId 一致分を合計）、読了日・評価・概要・読書メモ・メモ添付画像。画像クリックでライトボックス（前/次・Escape で閉じる）。
  - 編集モード: `BookForm` を表示し、保存で `onSave`、詳細に戻る・削除ボタンを表示。削除時は confirm 後に `onDelete(book.id)` と `onClose()`。
- **props**: `book`, `onSave`, `onClose`, `onDelete`, `initialEditMode`。
- **依存**: BookForm, BookStatusSidebar（getBookStatus）, constants, storage（getReadingSessions）, changeTime（formatMinutes）。スタイル: [src/features/myLibrary/styles/BookDetail.css](src/features/myLibrary/styles/BookDetail.css)

#### [src/features/myLibrary/BookDetailPage.jsx](src/features/myLibrary/BookDetailPage.jsx)

- **役割**: URL や親から渡された `bookId` で本を取得し、`BookDetail` に渡す薄いラッパー。
- **主な機能**: `getBookById(bookId)` で本を取得。存在しない場合は null を返して何も描画しない。`onSave`, `onClose`, `onDelete`, `initialEditMode` をそのまま `BookDetail` に渡す。
- **props**: `bookId`, `onSave`, `onClose`, `onDelete`, `initialEditMode`。
- **依存**: storage（getBookById）, BookDetail。

---

## 6. ユーティリティ（utils/）

### [src/utils/storage.js](src/utils/storage.js)

- **役割**: 読書セッション・本・設定の localStorage 永続化と、エクスポート/インポートを提供する。
- **主な機能**:
  - キー: `reading_sessions`, `reading_books`, `reading_settings`。
  - 読書セッション: `getReadingSessions`, `setReadingSessions`, `saveReadingSession`（新規または id 指定で更新）。セッションは `id`, `date`, `minutes`, `bookId?`, `startedAt?`, `endedAt?`。
  - 本: `getBooks`, `getBookById(id)`, `saveBook(book)`（新規または id で更新）, `deleteBook(id)`。本は title, author, summary, status, imageUrl, rating, tags, createdAt, finishedAt, memo, memoAttachments, pageCount, publisher 等を正規化して保存。
  - 設定: `getSettings()`（未設定は DEFAULT_GOALS で補う）, `setSettings(settings)`。目標は dailyGoalMinutes, weeklyGoalMinutes, monthlyGoalMinutes, yearlyGoalMinutes, bookGoalCount。
  - `exportData()`: 全データを `{ version, exportedAt, sessions, books, settings }` で返す。
  - `importData(data, mode)`: `replace` で上書き、`merge` で既存にマージ。QuotaExceededError 時はメッセージ付きで throw。
- **型**: JSDoc で `ReadingSession`, `Book`, `BookStatus` を定義。

### [src/utils/changeTime.js](src/utils/changeTime.js)

- **役割**: 分数の表示用フォーマット。
- **export**: `formatMinutes(totalMinutes)` — 60 未満は「○分」、それ以上は「○時間○分」の文字列を返す。

### [src/utils/changeRecord.js](src/utils/changeRecord.js)

- **役割**: 読書セッションの更新・削除を storage 経由で行う。
- **export**:
  - `updateReadingSession(session)`: id 必須。該当セッションをマージして保存。見つからなければ null。
  - `deleteReadingSession(id)`: 指定 id のセッションを削除。
- **依存**: storage（getReadingSessions, setReadingSessions）。

### [src/utils/imageCompress.js](src/utils/imageCompress.js)

- **役割**: 画像の Data URL をリサイズ・圧縮し、localStorage の容量を抑える。
- **export**: `compressImageDataUrl(dataUrl, opts)`。opts は `maxSize`（長辺の最大 px、既定 1200）, `quality`（0〜1、既定 0.78）。Canvas で描画し `image/jpeg` の Data URL を返す。表紙・メモ添付で使用。
- **依存**: なし（ブラウザの Image, Canvas API）。

---

## 7. スタイルについて

各コンポーネント・ページの見た目は、上記のとおり「スタイルは ○○.css を参照」とファイルパスで触れている。CSS の詳細な説明は本ドキュメントの対象外とする。

---

振り返るときは、先頭の **「振り返り用：逆引き・データの流れ」** から辿ると、どこを触ればよいかすぐに思い出せます。自分用メモ欄に日付や気づきを残しておくと、あとで見返しやすくなります。
