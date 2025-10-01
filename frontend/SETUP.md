# Scanvas フロントエンド セットアップガイド

## 概要

このフロントエンドアプリケーションは、Cytoscape.jsを使用してネットワークトポロジーを可視化します。

## セットアップ方法

### 方法1: シンプルなHTTPサーバーで実行（推奨）

最も簡単な方法は、組み込みのHTTPサーバーを使用することです：

#### Python 3を使用

```bash
cd frontend
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

#### Node.jsを使用（npxが利用可能な場合）

```bash
npx http-server frontend -p 8000
```

### 方法2: Cytoscape.jsを手動でダウンロード

外部CDNへのアクセスが制限されている環境では、Cytoscape.jsをローカルにダウンロードします：

```bash
cd frontend
curl -L -o cytoscape.min.js https://unpkg.com/cytoscape@3.28.1/dist/cytoscape.min.js
```

その後、方法1と同様にHTTPサーバーを起動します。

### 方法3: Node.jsパッケージマネージャーで管理

```bash
cd frontend
npm install cytoscape
# package.jsonの設定に従ってCytoscape.jsがインストールされます
```

## 使用方法

### 基本操作

1. **グラフの移動**: 背景をドラッグ
2. **ズーム**: マウスホイールでスクロール
3. **ノード詳細の表示**: ノードをクリック

### データフォーマット

フロントエンドは、バックエンドの`data_formatter.py`が出力するCytoscape.js形式のJSONを受け取ります：

```json
{
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "unique_id",
        "label": "表示名",
        "type": "Computer | USB Device | Network Device",
        "details": { ... }
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "source_node_id",
        "target": "target_node_id"
      }
    }
  ]
}
```

### サンプルデータのテスト

現在、`app.js`にはサンプルデータが含まれています。バックエンドと統合する前にフロントエンドの動作を確認できます。

バックエンドからサンプルデータを生成するには：

```bash
cd ../backend
python data_formatter.py > sample_output.json
```

## トラブルシューティング

### CDNからCytoscape.jsが読み込めない

組み込みのモック実装が自動的にロードされます。基本的な可視化機能は動作しますが、すべての高度な機能が利用できるわけではありません。

完全な機能を使用するには、Cytoscape.jsをローカルにダウンロードしてください（方法2を参照）。

### CORS エラー

ファイルを直接ブラウザで開く（`file://`プロトコル）と、CORSエラーが発生する可能性があります。必ずHTTPサーバー経由でアクセスしてください。

## 次のステップ

- [ ] バックエンドAPIとの統合
- [ ] リアルタイムデータ更新
- [ ] グラフのエクスポート機能
- [ ] ノードの検索・フィルタリング機能

## 関連ドキュメント

- [Cytoscape.js公式ドキュメント](https://js.cytoscape.org/)
- [バックエンドREADME](../backend/README.md)
