# 開発ガイド

## ローカル開発環境での実行

Electronアプリケーションはデスクトップ環境が必要です。以下の環境で実行してください：

### 必要な環境

- Node.js (v20以上推奨)
- npm (v10以上推奨)
- デスクトップ環境（X11またはWayland）

### セットアップ手順

1. 依存関係のインストール:
```bash
cd frontend
npm install
```

2. アプリケーションの起動:
```bash
# 通常起動
npm start

# 開発モード（DevToolsが自動で開きます）
npm run dev
```

## ファイル構成の説明

### main.js (メインプロセス)
- アプリケーションのライフサイクル管理
- ウィンドウの作成と管理
- システムリソースへのアクセス

### preload.js (コンテキストブリッジ)
- メインプロセスとレンダラープロセスの安全な橋渡し
- `window.scanvasAPI` としてレンダラーにAPIを公開
- セキュリティを保ちながらバックエンド連携を可能にする

### renderer.js (レンダラープロセス)
- UI制御とイベントハンドリング
- ユーザー操作の処理
- preloadで公開されたAPIを経由してバックエンドと通信

### index.html
- UIの構造定義
- CSP（Content Security Policy）を設定してセキュリティを強化

### styles.css
- UIのスタイル定義
- レスポンシブデザイン対応

## セキュリティ設定

以下のセキュリティベストプラクティスを実装しています：

1. **Context Isolation**: `contextIsolation: true`
   - レンダラープロセスとメインプロセスのコンテキストを分離

2. **Node Integration**: `nodeIntegration: false`
   - レンダラープロセスでのNode.js APIの直接使用を無効化

3. **Preload Script**: 安全なAPIのみを公開
   - `contextBridge.exposeInMainWorld`を使用

4. **CSP**: Content Security Policyを設定
   - XSSなどの攻撃を防止

## CI/CD環境での注意

このプロジェクトはElectronを使用しているため、GUI環境が必要です。
CI/CD環境（GitHub ActionsなどのヘッドレスLinux環境）では、以下の制限があります：

- `npm start`や`electron .`は実行できません（X11/Waylandが必要）
- 構文チェックやユニットテストは可能です

ヘッドレス環境でのテストには、以下のような対応が必要です：
- Xvfb（仮想X11サーバー）の使用
- Spectronなどのテストフレームワークの導入
- ヘッドレスモード対応のテスト設計

## 今後の開発予定

- [ ] Cytoscape.jsの統合
- [ ] バックエンド（Python）との連携実装
- [ ] デバイス情報の詳細表示
- [ ] グラフのエクスポート機能
- [ ] ユニットテストの追加
