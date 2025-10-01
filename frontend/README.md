# frontend

This directory contains the frontend application for the Scanvas project.

## 概要

Scanvas のフロントエンドは、Cytoscape.js を使用して PC、USB デバイス、ネットワークデバイスの接続関係を視覚化します。ユーザーはノードやエッジをクリックして詳細情報を確認できます。

## ファイル構成

- `index.html` - メイン HTML ファイル
- `renderer.js` - Cytoscape.js の初期化、グラフスタイル定義、インタラクティブ機能
- `styles.css` - ページ全体のスタイル定義
- `main.js` - Electron のメインプロセス
- `package.json` - プロジェクト設定と依存関係

## グラフスタイル定義

### ノードタイプ別スタイル

#### Computer（PC 本体）

- **形**: 四角 (rectangle)
- **色**: 青色 (#3498db)
#### Computer（PC本体）
#### USB Device（USB デバイス）

- **形**: 楕円 (ellipse)
- **色**: 緑色 (#2ecc71)

#### Network Device（ネットワークデバイス）

- **形**: ひし形 (diamond)
- **色**: オレンジ色 (#e67e22)

### エッジスタイル

- **線の太さ**: 2px
- **色**: グレー (#95a5a6)
- **矢印**: 三角形
- **カーブ**: ベジェ曲線

### 選択状態

- **枠線**: 赤色 (#e74c3c)、太さ 3px

## インタラクティブ機能

- **ノードクリック**: ノードのラベル、タイプ、ID を表示
- **エッジクリック**: 接続元と接続先の情報を表示
- **背景クリック**: 操作方法を表示

## レイアウト

- **タイプ**: breadthfirst（階層的配置）

## セットアップと実行

Electron でデスクトップアプリとして実行します。

```bash
# 依存関係をインストール
cd frontend
npm install

# アプリを起動
npm start
```
