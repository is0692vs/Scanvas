# backend

This directory contains the backend services for the Scanvas project.

## 概要

Scanvas のバックエンドは、PC のシステム情報、USB 接続デバイス、ネットワークデバイスなどを収集し、Cytoscape.js が解釈できる JSON 形式に整形します。

## ファイル構成

### `system_info.py` (Issue #2)

PC 本体のシステム情報（OS、CPU、メモリ）を取得します。

**機能:**

- OS の情報（システム名、リリース、バージョン、マシンタイプ）
- CPU の情報（物理コア数、論理コア数、最大周波数、CPU 使用率）
- メモリの情報（合計、利用可能、使用中、使用率）

**実行方法:**

```bash
python backend/system_info.py
```

**出力例:**

```json
{
    "node_id": "local_pc",
    "node_type": "Computer",
    "label": "your-hostname",
    "details": {
        "os": {...},
        "cpu": {...},
        "memory": {...}
    }
}
```

### `data_formatter.py` (Issue #5)

各種データソースからの情報を統合し、Cytoscape.js が解釈できるグラフ形式の JSON に変換します。

**機能:**

- `system_info.py`から取得した PC 情報を中心ノードとして追加
- USB デバイスツリーをノードとエッジに変換（再帰的処理）
- `usb_scanner.py`が利用可能な場合は実際の USB デバイス情報を使用
- 将来的にネットワークデバイスも統合予定

**実行方法:**

```bash
python backend/data_formatter.py
```

**出力形式:**

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

### `usb_scanner.py` (Issue #3)

USB 接続デバイスの階層構造をスキャンし、親子関係を含むツリー構造で返します。

**機能:**

- 接続されているすべての USB デバイスを検出
- デバイスの詳細情報（ベンダー ID、プロダクト ID、メーカー、製品名）を取得
- USB ハブとデバイスの親子関係を解析
- 階層構造の JSON 形式で出力

**実行方法:**

```bash
python backend/usb_scanner.py
```

**出力例:**

```json
{
    "node_type": "USB Root",
    "label": "USB Root Hubs",
    "children": [
        {
            "node_type": "USB Device",
            "label": "VIA Labs, Inc. USB Hub",
            "details": {
                "bus": 1,
                "address": 2,
                "vendor_id": "0x2109",
                "product_id": "0x2817"
            },
            "children": [...]
        }
    ]
}
```

**注意事項:**

- pyusb ライブラリが必要です
- devcontainer 環境では USB デバイスへのアクセスが制限される場合があります
- アクセス権限エラーが発生する場合は、適切な権限設定が必要です

## 依存関係

### requirements.txt

```
psutil
pyusb
```

**インストール方法:**

```bash
pip install -r requirements.txt
```

## テスト方法

### 1. システム情報取得のテスト

```bash
python backend/system_info.py
```

実際の PC 情報が JSON 形式で出力されることを確認してください。

### 2. USB デバイススキャンのテスト

```bash
python backend/usb_scanner.py
```

接続されている USB デバイスの階層構造が JSON 形式で出力されることを確認してください。

**注意:** devcontainer 環境では USB デバイスへのアクセスが制限される場合があります。エラーが発生した場合は、エラーメッセージが JSON 形式で返されます。

### 3. データフォーマットのテスト

```bash
python backend/data_formatter.py
```

Cytoscape.js 形式の JSON が出力され、以下が含まれることを確認してください:

- `local_pc`ノード（実際のホスト名とシステム詳細）
- USB デバイスノード（実際のデバイス情報またはモックデータ）
- ノード間のエッジ（接続関係）

## 今後の実装予定

- **Issue #4**: ローカルネットワークデバイススキャン機能（`network_scanner.py`）
- **Issue #6**: 各機能の単体テスト

- **Issue #3**: USB 接続デバイスの階層構造スキャン機能（`usb_scanner.py`）
- **Issue #4**: ローカルネットワークデバイススキャン機能（`network_scanner.py`）
- **Issue #6**: 各機能の単体テスト
