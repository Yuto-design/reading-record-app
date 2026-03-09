# Reading Record App - draw.io 図一覧

このフォルダには、Reading Record App の構成・データ・画面遷移を整理した draw.io 図を格納しています。  
draw.io プラグイン（または [diagrams.net](https://app.diagrams.net/)）で `.drawio` ファイルを開いて編集・共有できます。

## 図の種類と目的

| ファイル | 目的 |
|----------|------|
| [01-architecture.drawio](01-architecture.drawio) | ルーティングとページ構成（BrowserRouter → Layout → 各ページ）の把握・オンボーディング |
| [02-component-hierarchy.drawio](02-component-hierarchy.drawio) | 各画面がどの feature に依存しているかの整理 |
| [03-data-flow.drawio](03-data-flow.drawio) | localStorage と各画面の読み書き関係の明確化 |
| [04-data-model.drawio](04-data-model.drawio) | ReadingSession / Book / Settings の仕様と関係の共通理解 |
| [05-screen-flow.drawio](05-screen-flow.drawio) | ユーザー体験やナビ設計の確認・改善検討 |

## 参照元

- ルーティング: `src/App.jsx`
- レイアウト: `src/components/Layout.jsx`
- 永続化: `src/utils/storage.js`
- データ操作: `src/utils/changeRecord.js`, `src/utils/changeTime.js`
