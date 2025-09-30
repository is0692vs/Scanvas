# frontend

This directory contains the frontend application for the Scanvas project.

## 概要

Scanvasのフロントエンドは、Cytoscape.jsを使用してPC、USBデバイス、ネットワークデバイスの接続関係を視覚化します。

## ファイル構成

- `index.html` - メインHTMLファイル
- `app.js` - Cytoscape.jsの初期化とグラフスタイル定義
- `styles.css` - ページ全体のスタイル定義

## グラフスタイル定義

### ノードタイプ別スタイル

#### Computer（PC本体）
- **形**: 長方形 (rectangle)
- **色**: 青色 (#4A90E2)
- **サイズ**: 80px × 60px
- **枠線**: 濃い青 (#2E5C8A)

#### USB Device（USBデバイス）
- **形**: 楕円 (ellipse)
- **色**: 緑色 (#7ED321)
- **サイズ**: 60px × 60px
- **枠線**: 濃い緑 (#5FA319)

#### Network Device（ネットワークデバイス）
- **形**: ダイヤモンド (diamond)
- **色**: オレンジ色 (#F5A623)
- **サイズ**: 70px × 70px
- **枠線**: 濃いオレンジ (#C78419)

### エッジスタイル

- **線の太さ**: 3px
- **色**: グレー (#999)
- **矢印**: 三角形、方向は子ノードへ
- **カーブ**: ベジェ曲線

### インタラクション

- **ノード選択時**: 赤い枠線 (#FF6B6B)、オーバーレイ効果
- **エッジ選択時**: 太くなり、赤色に変化
- **ノードクリック**: 右側のパネルに詳細情報を表示

## セットアップ

### 1. Cytoscape.jsのインストール

#### オプションA: CDNから読み込む（推奨）
`index.html`の以下の行を修正:
```html
<script src="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js"></script>
```

#### オプションB: ローカルにダウンロード
```bash
cd frontend
curl -L -o cytoscape.min.js https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js
```

#### オプションC: npmを使用
```bash
cd frontend
npm init -y
npm install cytoscape
```

### 2. 開発サーバーの起動

```bash
cd frontend
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開きます。

## 使用方法

### サンプルデータでの動作確認

`app.js`には以下のサンプルデータが含まれています：
- PC本体ノード
- USBハブとキーボード
- ネットワークデバイス

### バックエンドデータの読み込み

バックエンドから取得したデータを読み込むには、`loadGraphData()`関数を使用します：

```javascript
fetch('/api/graph-data')
  .then(response => response.json())
  .then(data => {
    loadGraphData(data);
  });
```

または、データを直接渡すこともできます：

```javascript
const data = {
  "elements": [
    // backend/data_formatter.pyの出力形式
  ]
};
loadGraphData(data);
```

## デバッグ

以下の関数がグローバルスコープで利用可能です：

- `window.cy` - Cytoscapeインスタンス
- `window.loadGraphData(data)` - 新しいデータを読み込む
- `window.relayout()` - レイアウトを再計算

ブラウザのコンソールで以下のようにアクセスできます：
```javascript
// 全ノードを取得
cy.nodes();

// レイアウトを再計算
relayout();

// 新しいデータを読み込み
loadGraphData(newData);
```

## カスタマイズ

### 色の変更

`app.js`の`style`セクションで各ノードタイプの`background-color`を変更できます。

### レイアウトの変更

`layout`セクションでレイアウトアルゴリズムを変更できます：
- `breadthfirst` - 階層型レイアウト（デフォルト）
- `circle` - 円形レイアウト
- `grid` - グリッドレイアウト
- `cose` - 力指向レイアウト

## 今後の拡張

- [ ] バックエンドAPIとの統合
- [ ] ノード詳細情報のより詳細な表示
- [ ] フィルタリング機能
- [ ] 検索機能
- [ ] エクスポート機能（PNG、SVG）
- [ ] レスポンシブデザイン対応

