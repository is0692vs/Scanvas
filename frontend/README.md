# frontend

This directory contains the frontend application for the Scanvas project.

## 概要

Cytoscape.js を使用してネットワークトポロジーをグラフとして可視化するフロントエンドアプリケーションです。

## ファイル構成

- `index.html` - メインHTMLファイル
- `app.js` - Cytoscape.js の初期化とグラフ描画ロジック

## 実行方法

### ローカルでの実行

シンプルなHTTPサーバーを起動してブラウザで開きます：

```bash
# Python 3の場合
cd frontend
python3 -m http.server 8000

# Node.jsがインストールされている場合
npx http-server frontend -p 8000
```

ブラウザで `http://localhost:8000` を開きます。

## 機能

### グラフ可視化

- **ノード表示**: システム情報、USBデバイス、ネットワークデバイスをノードとして表示
- **エッジ表示**: デバイス間の接続関係を矢印で表示
- **レイアウト**: CoSEレイアウトアルゴリズムで自動配置

### ノードタイプとスタイル

- **Computer (PC本体)**: 赤色、大きめの円形
- **USB Device**: 紫色、角丸四角形
- **Network Device**: 緑色、ひし形

### インタラクション

- **ドラッグ**: グラフ全体を移動
- **スクロール**: ズームイン/アウト
- **ノードクリック**: ノードの詳細情報を表示
- **エッジクリック**: 接続情報を表示

## データフォーマット

バックエンドの `data_formatter.py` が生成する Cytoscape.js 形式の JSON を使用します：

```json
{
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "local_pc",
        "label": "hostname",
        "type": "Computer",
        "details": {...}
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "parent_id",
        "target": "child_id"
      }
    }
  ]
}
```

## サンプルデータ

`app.js` には、以下を含むサンプルデータが実装されています：

- PC本体（Computer）
- USBハブとキーボード（USB Device）
- ネットワークデバイス（Network Device）

## 今後の拡張

- バックエンドAPIとの統合（リアルタイムデータ取得）
- データの動的更新機能
- ノードの検索・フィルタリング機能
- グラフのエクスポート機能
