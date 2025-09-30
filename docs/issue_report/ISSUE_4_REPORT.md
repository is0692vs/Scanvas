# Issue #4: feat(backend): ローカルネットワーク上のアクティブデバイスをスキャンする機能を実装する

## 実施日

2025 年 9 月 30 日

## 作業内容

### 1. 実装したファイル

#### `backend/network_scanner.py`

ローカルネットワーク上のアクティブなデバイスを検出するスキャナーを実装しました。

**主要な関数:**

1. **`get_local_network_range()`**

   - 実行中のマシンの IP アドレスから、スキャン対象のネットワーク範囲を自動で特定
   - 例: `192.168.1.10` → `192.168.1.0/24`
   - 接続できない場合は一般的なローカル IP 範囲 `192.168.1.0/24` を返す

2. **`scan_local_network()`**
   - ARP (Address Resolution Protocol) リクエストを使用してネットワークデバイスを検出
   - Scapy ライブラリを使用して低レベルのパケット操作を実行
   - 各デバイスの IP アドレスと MAC アドレスを取得
   - デバイス情報をユニークな `node_id` と共に返す

**出力形式:**

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
  }
]
```

#### `backend/data_formatter.py` の更新

`data_formatter.py` に network_scanner を統合し、ネットワークデバイスもグラフに含めるように修正しました。

**主な変更点:**

1. **動的インポート**

   ```python
   try:
       from network_scanner import scan_local_network
       NETWORK_SCANNER_AVAILABLE = True
   except ImportError:
       MOCK_NETWORK_DEVICES = [...]
   ```

   - USB スキャナーと同様のフォールバック機構を実装
   - scapy が利用できない環境でもモックデータで動作可能

2. **`format_for_cytoscape()` 関数の拡張**

   - `network_devices` パラメータを追加
   - ネットワークデバイスをノードとして追加
   - PC 本体とネットワークデバイス間のエッジを作成

3. **メイン実行ブロックの更新**
   - ネットワークスキャナーが利用可能な場合は実際のスキャンを実行
   - 権限エラーや実行エラーが発生した場合はモックデータを使用
   - すべてのデータソース（PC 情報、USB、ネットワーク）を統合

#### `requirements.txt` の更新

```
psutil
pyusb
scapy
```

- scapy ライブラリを追加

#### `backend/README.md` の更新

- `network_scanner.py` の説明セクションを追加
- 実行方法とサンプル出力を記載
- root 権限が必要な点を強調
- テストセクションにネットワークスキャンのテストを追加
- `data_formatter.py` の説明を更新（ネットワークデバイス統合について）

## テスト方法

### 1. ネットワークスキャナー単体のテスト

```bash
sudo python backend/network_scanner.py
```

**期待される動作:**

- ローカルネットワーク上のアクティブなデバイスが JSON 形式で出力される
- 各デバイスに `node_id`, `node_type`, `label`, `details` フィールドが含まれる
- `node_id` は `net_` プレフィックスと IP アドレス（ドットをアンダースコアに置換）で構成される

**注意事項:**

- **root 権限が必要**: ARP パケットの送信には管理者権限が必要です
- **devcontainer 制限**: Docker コンテナ内ではネットワークアクセスが制限される場合があります
- 権限エラーが発生した場合は、適切なエラーメッセージが JSON 形式で返されます

### 2. data_formatter.py での統合テスト

```bash
python backend/data_formatter.py
```

**期待される動作:**

- Cytoscape.js 形式の JSON が出力される
- `local_pc` ノード（中心ノード）が含まれる
- USB デバイスノード（実際のデータまたはモック）が含まれる
- ネットワークデバイスノード（実際のデータまたはモック）が含まれる
- 各ノード間のエッジ（接続関係）が正しく設定されている

**フォールバック動作の確認:**

- scapy がインストールされていない環境では、MOCK_NETWORK_DEVICES が使用される
- 権限エラーが発生した場合も、モックデータにフォールバックする

## 完了条件の確認

- [x] `backend/network_scanner.py` を作成し、ARP リクエストによるネットワークスキャン機能を実装
- [x] `get_local_network_range()` 関数でネットワーク範囲を自動特定
- [x] `scan_local_network()` 関数でデバイスの IP アドレスと MAC アドレスを取得
- [x] ユニークな `node_id` を生成（`net_` プレフィックス + IP アドレス）
- [x] `data_formatter.py` にネットワークスキャナーを統合
- [x] 動的インポートとフォールバック機構を実装
- [x] `format_for_cytoscape()` 関数でネットワークデバイスを処理
- [x] requirements.txt に scapy を追加
- [x] backend/README.md にドキュメントを追加
- [x] エラーハンドリング（権限エラー、一般的な例外）を実装

## devcontainer 環境での制約

### ネットワークアクセスの制限

Docker コンテナは通常、ホストシステムのネットワークインターフェースに直接アクセスできません。以下の制約があります:

1. **ARP リクエストの制限**

   - コンテナ内から直接 ARP パケットを送信することが困難
   - ホストのネットワークモード（`--network host`）が必要な場合がある

2. **権限の問題**

   - root 権限でも、コンテナのセキュリティ設定によっては低レベルのネットワーク操作が制限される
   - CAP_NET_RAW などのケイパビリティが必要

3. **テスト方法の推奨**
   - ホストマシンで直接テストすることを推奨
   - または、devcontainer.json で適切なネットワーク設定とケイパビリティを追加

### フォールバック機構

これらの制約に対応するため、以下のフォールバック機構を実装しました:

```python
if NETWORK_SCANNER_AVAILABLE:
    try:
        network_devices = scan_local_network()
    except (PermissionError, Exception):
        # 権限エラーや実行エラーの場合はモックデータを使用
        network_devices = MOCK_NETWORK_DEVICES
else:
    network_devices = MOCK_NETWORK_DEVICES
```

## 今後の作業

### Issue #6: 単体テスト

- `network_scanner.py` の単体テストを作成
- モック環境でのテストを実装
- エラーハンドリングのテスト

### ネットワークスキャナーの機能拡張（将来の改善案）

- デバイス名の解決（DNS リバースルックアップ）
- デバイスタイプの推測（MAC アドレスベンダー情報）
- スキャン範囲のカスタマイズオプション
- スキャンタイムアウトの設定

### devcontainer での動作改善

- devcontainer.json にネットワーク関連の設定を追加
- 適切なケイパビリティ（CAP_NET_RAW）の付与
- ドキュメントへの設定方法の記載

## 備考

### Scapy について

- **Scapy**: Python で低レベルのネットワークパケット操作を行うための強力なライブラリ
- ARP、TCP、UDP、ICMP などの多様なプロトコルをサポート
- ネットワークスキャン、パケット解析、セキュリティテストなどに広く使用される

### ARP プロトコルについて

- **ARP (Address Resolution Protocol)**: IP アドレスから MAC アドレスを取得するためのプロトコル
- ローカルネットワーク内のデバイス発見に適している
- ブロードキャストで全デバイスに問い合わせ、応答があったデバイスを検出

### セキュリティ考慮事項

- ネットワークスキャンは、適切な権限を持つ環境でのみ実行してください
- 他者のネットワークを無断でスキャンすることは法的問題になる可能性があります
- 本機能は自身のローカルネットワークの可視化のみを目的としています
