# frontend

This directory contains the frontend application for the Scanvas project.

## 概要

Scanvas のフロントエンドは Electron を使用したデスクトップアプリケーションです。
ローカルデバイスとネットワークの情報を可視化するためのUIを提供します。

## セットアップ

### 依存関係のインストール

```bash
cd frontend
npm install
```

### セットアップの検証

```bash
npm run verify
```

このコマンドで、すべての必須ファイルと設定が正しく配置されているか確認できます。

## 起動方法

### 通常起動

```bash
npm start
```

### 開発モード（DevTools自動起動）

```bash
npm run dev
```

## ファイル構成

- `main.js`: Electronのメインプロセス（ウィンドウ管理、アプリケーションライフサイクル）
- `preload.js`: セキュアなコンテキストブリッジ（レンダラーとメインの橋渡し）
- `renderer.js`: レンダラープロセス（UI制御、イベントハンドリング）
- `index.html`: UIのHTML構造
- `styles.css`: UIのスタイル定義
- `package.json`: プロジェクト設定と依存関係

## アーキテクチャ

### プロセス分離

Electronのベストプラクティスに従い、メインプロセスとレンダラープロセスを明確に分離しています：

- **メインプロセス**: ウィンドウ管理、システムAPIへのアクセス
- **レンダラープロセス**: UI表示とユーザー操作
- **Preloadスクリプト**: 両プロセス間の安全な通信を提供

### セキュリティ

- `contextIsolation: true` - コンテキスト分離を有効化
- `nodeIntegration: false` - レンダラーでのNode.js統合を無効化
- Content Security Policy (CSP) を設定

## 今後の実装予定

- Cytoscape.js を使用したグラフビジュアライゼーション
- バックエンド（Python）との連携
- デバイス情報の詳細表示
- エクスポート機能
