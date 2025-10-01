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

## セットアップと実行

Electronでデスクトップアプリとして実行します。

```bash
# 依存関係をインストール
cd frontend
npm install

# アプリを起動
npm start