# Issue #7: feat(frontend): Electron プロジェクトを初期セットアップする

## 実施日

2025 年 9 月 30 日

## 作業内容

### 1. 実装したファイル

#### `frontend/package.json` (生成・編集)

Node.js プロジェクトの設定ファイルを作成し、Electron アプリとして動作するように設定しました。

**主な設定:**

- `main`: エントリーポイントを `main.js` に設定
- `scripts.start`: `electron .` コマンドで起動できるように設定
- `devDependencies`: Electron を開発依存関係として追加

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "This directory contains the frontend application for the Scanvas project.",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^33.2.1"
  }
}
```

#### `frontend/main.js` (新規作成)

Electron のメインプロセスファイル。アプリケーションのライフサイクルとウィンドウの管理を担当します。

**主な機能:**

- `createWindow()`: 800x600 のウィンドウを作成し、index.html を読み込む
- `app.whenReady()`: アプリが準備できたらウィンドウを作成
- `app.on('window-all-closed')`: 全ウィンドウが閉じられたらアプリを終了（macOS を除く）

```javascript
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

#### `frontend/index.html` (新規作成)

アプリケーションの UI を定義する HTML ファイル。

**表示内容:**

- タイトル: "Scanvas"
- 見出し: "Hello from Scanvas! 👋"
- 説明文: "Electron アプリが正常に起動しました。"

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Scanvas</title>
  </head>
  <body>
    <h1>Hello from Scanvas! 👋</h1>
    <p>Electronアプリが正常に起動しました。</p>
  </body>
</html>
```

## テスト方法

### 1. Electron のインストール

```bash
cd frontend/
npm install
```

**期待される動作:**

- `node_modules/` ディレクトリが作成される
- Electron およびその依存関係がインストールされる
- `package-lock.json` が生成される

### 2. アプリケーションの起動

```bash
npm start
```

**期待される動作:**

- デスクトップに 800x600 のウィンドウが表示される
- ウィンドウのタイトルバーに "Scanvas" と表示される
- ウィンドウ内に "Hello from Scanvas! 👋" という見出しが表示される
- "Electron アプリが正常に起動しました。" というメッセージが表示される

**注意:**

- devcontainer 内で実行していても、GUI は自動的にホスト OS に転送されます
- X11 フォワーディングが正しく設定されている必要があります

### 3. アプリケーションの終了

- ウィンドウの閉じるボタンをクリック
- または、ターミナルで `Ctrl+C` を実行

## 完了条件の確認

- [x] `frontend/package.json` を作成し、適切に設定
- [x] `main` プロパティを `main.js` に設定
- [x] `scripts.start` を `electron .` に設定
- [x] `devDependencies` に Electron を追加
- [x] `frontend/main.js` を作成
- [x] ウィンドウ作成機能を実装
- [x] アプリライフサイクルの管理を実装
- [x] `frontend/index.html` を作成
- [x] "Hello from Scanvas! 👋" メッセージを表示
- [ ] `npm install` で Electron をインストール（ユーザーが実行）
- [ ] `npm start` でアプリが正常に起動することを確認（ユーザーが実行）

## Electron の基本構造

### メインプロセス vs レンダラープロセス

**メインプロセス (`main.js`):**

- Node.js 環境で実行される
- アプリケーションのライフサイクルを管理
- ウィンドウの作成・管理を担当
- ファイルシステムやネイティブ API へのアクセスが可能
- 1 つのアプリケーションに 1 つのみ

**レンダラープロセス (`index.html`, JavaScript, CSS):**

- Chromium 環境で実行される
- Web 技術（HTML/CSS/JavaScript）で UI を構築
- ブラウザと同じセキュリティ制約がある
- 各ウィンドウごとに独立したプロセス
- 複数存在可能（ウィンドウごと）

### プロセス間通信 (IPC)

メインプロセスとレンダラープロセスは独立しているため、通信には IPC（Inter-Process Communication）を使用します。

```javascript
// メインプロセス
const { ipcMain } = require("electron");
ipcMain.on("channel-name", (event, arg) => {
  // 処理
});

// レンダラープロセス
const { ipcRenderer } = require("electron");
ipcRenderer.send("channel-name", data);
```

今後、バックエンドとの通信を実装する際に IPC を使用します。

## devcontainer での Electron 実行

### X11 フォワーディング

devcontainer は Docker コンテナ内で実行されますが、GUI アプリケーションはホスト OS に転送されます。

**必要な設定:**

- X11 サーバーがホスト OS で起動している
- `DISPLAY` 環境変数が正しく設定されている
- `.devcontainer/devcontainer.json` に適切な設定がある

```json
{
  "runArgs": ["--net=host"],
  "containerEnv": {
    "DISPLAY": "${localEnv:DISPLAY}"
  }
}
```

### トラブルシューティング

#### 1. `npm install` がフリーズする場合

- ターミナルを再起動
- `npm cache clean --force` でキャッシュをクリア
- 別のターミナルで実行

#### 2. GUI が表示されない場合

- ホスト OS で X11 サーバーが起動しているか確認
- `echo $DISPLAY` で DISPLAY 環境変数を確認
- `xhost +local:` で X11 アクセス権限を許可

#### 3. Electron のバージョン互換性エラー

- Node.js のバージョンを確認（Electron と互換性があるか）
- `npm install electron@latest --save-dev` で最新版を再インストール

## 今後の作業

### Issue #8: Cytoscape.js の統合

- Cytoscape.js ライブラリをインストール
- グラフ表示エリアを HTML に追加
- サンプルグラフを表示

### Issue #9: バックエンドとの連携

- IPC を使用してメインプロセスからバックエンドの Python スクリプトを呼び出す
- `child_process` モジュールで Python スクリプトを実行
- 取得したデータを Cytoscape.js に渡して可視化

### UI/UX の改善

- CSS でスタイリング
- ツールバー・サイドバーの追加
- ダークモード対応

## 備考

### Electron の利点

1. **クロスプラットフォーム**: Windows、macOS、Linux で同じコードが動作
2. **Web 技術**: HTML/CSS/JavaScript でデスクトップアプリを開発
3. **豊富なエコシステム**: npm の膨大なライブラリが利用可能
4. **ネイティブ機能**: Node.js により OS のネイティブ機能にアクセス可能

### 類似プロジェクト

- **Visual Studio Code**: Electron ベースのコードエディタ
- **Slack**: チャットアプリケーション
- **Discord**: ゲーマー向けチャットアプリ
- **Figma Desktop**: デザインツール

### パッケージング（将来の課題）

開発が完了したら、`electron-builder` や `electron-packager` を使用して、実行可能ファイルを作成できます。

```bash
npm install --save-dev electron-builder
```

```json
{
  "scripts": {
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.scanvas.app",
    "productName": "Scanvas",
    "files": ["**/*"],
    "directories": {
      "output": "dist"
    }
  }
}
```

これで Issue #7 は完了です！Electron プロジェクトの基礎が整い、今後のフロントエンド開発の土台ができました。
