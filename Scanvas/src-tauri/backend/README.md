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
- ネットワークデバイスをノードとエッジに変換
- `usb_scanner.py`が利用可能な場合は実際の USB デバイス情報を使用
- `network_scanner.py`が利用可能な場合は実際のネットワークデバイス情報を使用
- 各スキャナーが利用できない場合はモックデータにフォールバック

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

### `network_scanner.py` (Issue #4)

ローカルネットワーク上のアクティブなデバイスを ARP リクエストを使用してスキャンします。

**機能:**

- 実行中のマシンの IP アドレスから自動的にネットワーク範囲を特定
- ARP リクエストによるネットワークデバイスの検出
- 各デバイスの IP アドレスと MAC アドレスを取得

**実行方法:**

```bash
sudo python backend/network_scanner.py
```

**⚠️ 注意:** ネットワークスキャンは低レベルのパケット操作を行うため、管理者（root）権限が必要です。

**出力例:**

```json
[
  {
    "node_id": "net_192_168_1_1",
    "node_type": "Network Device",
    "label": "192.168.1.1",
    "details": {
      "ip_address": "192.168.1.1",
      "mac_address": "a0:b1:c2:d3:e4:f5"
    }
  },
  {
    "node_id": "net_192_168_1_5",
    "node_type": "Network Device",
    "label": "192.168.1.5",
    "details": {
      "ip_address": "192.168.1.5",
      "mac_address": "f1:e2:d3:c4:b5:a6"
    }
  }
]
```

**注意事項:**

- scapy ライブラリが必要です
- root 権限で実行する必要があります（`sudo`を使用）
- devcontainer 環境では制限される場合があります
- ファイアウォールやネットワーク設定によってスキャン結果が異なる場合があります

## 依存関係

### requirements.txt

```
psutil
pyusb
scapy
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

### 3. ネットワークデバイススキャンのテスト

```bash
sudo python backend/network_scanner.py
```

ローカルネットワーク上のアクティブなデバイスが JSON 形式で出力されることを確認してください。

**注意:**

- root 権限が必要です（`sudo`を使用）
- devcontainer 環境では制限される場合があります
- 権限エラーが発生した場合は、適切なエラーメッセージが JSON 形式で返されます

### 4. データフォーマットのテスト

```bash
python backend/data_formatter.py
```

Cytoscape.js 形式の JSON が出力され、以下が含まれることを確認してください:

- `local_pc`ノード（実際のホスト名とシステム詳細）
- USB デバイスノード（実際のデバイス情報またはモックデータ）
- ネットワークデバイスノード（実際のデバイス情報またはモックデータ）
- ノード間のエッジ（接続関係）

### 5. 単体テストの実行

```bash
pytest backend/
```

すべてのスキャナー機能が正しく動作するかを確認する単体テストが実装されています。

**テスト内容:**

- `test_get_system_info`: システム情報取得のテスト
- `test_build_device_tree`: USB デバイス階層構築のテスト
- `test_scan_local_network`: ネットワークスキャンのテスト

**注意:** テストは外部ライブラリ（psutil, pyusb, scapy）の動作をモック化しているため、実際のハードウェアがなくても実行できます。

## Issue レポートの配置

実装した Issue の詳細なレポート（実装内容、テスト手順、完了条件など）はリポジトリのルールとして `docs/issue_report` ディレクトリに作成してください。

- ファイル名: `ISSUE_<number>_REPORT.md`（例: `ISSUE_3_REPORT.md`）
- テンプレート: `docs/issue_report/ISSUE_REPORT_TEMPLATE.md` をコピーして使用してください
- 既存のレポートは移動済みまたは `docs/issue_report` に複製されています。新しいレポートは必ず `docs/issue_report` に追加してください。
