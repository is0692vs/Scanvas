# Issue #5 実装レポート

## 実施日
2025年9月30日

## 作業内容

### 1. ファイル作成
`backend/data_formatter.py`を新規作成し、Cytoscape.js形式のJSONフォーマット変換機能を実装しました。

### 2. 実装内容

#### 主要機能
- **`format_for_cytoscape(system_info_json, usb_tree)`関数**
  - Issue #2で作成した`system_info.py`の`get_system_info()`関数を統合
  - PC本体情報を中心ノードとしてグラフに追加
  - USBデバイスツリーを再帰的に処理してノードとエッジに変換
  - Cytoscape.jsが解釈できる`elements`配列形式で出力

#### モックデータ
現時点でIssue #3（USB）とIssue #4（ネットワーク）が未実装のため、以下のモックデータを使用:
```python
MOCK_USB_TREE = {
    "node_type": "USB Root",
    "children": [
        {
            "node_type": "USB Device",
            "label": "VIA Labs, Inc. USB Hub",
            "details": {"vendor_id": "0x1234"},
            "children": [...]
        }
    ]
}
```

### 3. 出力フォーマット

実行結果として以下のCytoscape.js形式のJSONを出力:

```json
{
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "local_pc",
        "label": "dcc256ba0329",
        "type": "Computer",
        "details": {
          "os": {...},
          "cpu": {...},
          "memory": {...}
        }
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "VIA_Labs,_Inc._USB_Hub",
        "label": "VIA Labs, Inc. USB Hub",
        "type": "USB Device",
        "details": {"vendor_id": "0x1234"}
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "local_pc",
        "target": "VIA_Labs,_Inc._USB_Hub"
      }
    }
  ]
}
```

### 4. ドキュメント更新
`backend/README.md`を更新し、以下の情報を追加:
- ファイル構成の説明
- 各モジュールの機能詳細
- 実行方法とテスト手順
- 依存関係の管理方法
- 今後の実装予定

## テスト方法

### 前提条件
- Issue #2が完了していること（`backend/system_info.py`が存在）
- `psutil`がインストールされていること

### テスト手順

#### 1. 依存関係のインストール
```bash
pip install -r requirements.txt
```

#### 2. システム情報取得のテスト
```bash
python backend/system_info.py
```

**期待される結果:**
- 実際のPCのホスト名が`label`フィールドに表示される
- OSのシステム情報が正しく取得される
- CPU情報（コア数、使用率）が表示される
- メモリ情報（合計、使用中、利用可能）が表示される

#### 3. データフォーマッターのテスト
```bash
python backend/data_formatter.py
```

**期待される結果:**
- `elements`配列が出力される
- `local_pc`ノードに実際のPC情報が含まれる
- USBデバイスノード（モックデータ）が含まれる
- ノード間のエッジ（`source`と`target`）が正しく定義される
- JSON形式が正しく整形されている

#### 4. 出力検証項目
- ✅ `"group": "nodes"`のエントリが存在する
- ✅ `"group": "edges"`のエントリが存在する
- ✅ PC本体ノードのIDが`"local_pc"`である
- ✅ PC本体ノードの`label`が実際のホスト名である
- ✅ USBデバイスノードがPC本体ノードに接続されている

## 完了条件の確認

### Issue #5の完了条件
- [x] Cytoscape.js形式のJSONフォーマットが定義されている
- [x] `system_info.py`の出力が統合されている
- [x] USBツリー（モックデータ）が正しくノードとエッジに変換される
- [x] 実行可能なPythonスクリプトとして動作する
- [x] ドキュメントが整備されている

## 今後の作業

### Issue #3: USB接続デバイススキャン
- `usb_scanner.py`の実装
- `MOCK_USB_TREE`を実際のUSBデバイス情報に置き換える

### Issue #4: ネットワークデバイススキャン
- `network_scanner.py`の実装
- `format_for_cytoscape()`関数にネットワークノード処理を追加

### Issue #6: 単体テスト
- 各モジュールのテストコード作成
- テスト自動化の構築

## 備考
- 現在のブランチ: `5-featbackend-全ての収集データをグラフ用の統一jsonフォーマットに整形する機能を実装する`
- Issue #2の成果を正しく統合できていることを確認済み
- Cytoscape.jsのドキュメントに準拠したフォーマットを採用
