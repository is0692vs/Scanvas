import json
import sys

# Issue #2で作成した関数をインポート
from system_info import get_system_info

# Issue #3で作成したUSBスキャナーをインポート
USB_SCANNER_AVAILABLE = False
MOCK_USB_TREE = None
build_device_tree_func = None

try:
    from usb_scanner import build_device_tree
    build_device_tree_func = build_device_tree
    USB_SCANNER_AVAILABLE = True
except ImportError:
    # フォールバック用のモックデータ
    MOCK_USB_TREE = {
        "node_type": "USB Root",
        "children": [
            {
                "node_type": "USB Device",
                "label": "VIA Labs, Inc. USB Hub",
                "details": {"vendor_id": "0x1234"},
                "children": [
                    {
                        "node_type": "USB Device",
                        "label": "HHKB-Hybrid",
                        "details": {"vendor_id": "0x5678"},
                        "children": []
                    }
                ]
            }
        ]
    }

# Issue #4で作成したネットワークスキャナーをインポート
NETWORK_SCANNER_AVAILABLE = False
MOCK_NETWORK_DEVICES = []
scan_local_network_func = None

try:
    from network_scanner import scan_local_network
    scan_local_network_func = scan_local_network
    NETWORK_SCANNER_AVAILABLE = True
except ImportError:
    print(
        "[data_formatter] network_scanner not available; "
        "using mock network list",
        file=sys.stderr,
    )
    # フォールバック用のモックデータ
    MOCK_NETWORK_DEVICES = [
        {
            "node_id": "net_192_168_1_1",
            "node_type": "Network Device",
            "label": "192.168.1.1",
            "details": {
                "ip_address": "192.168.1.1",
                "mac_address": "aa:bb:cc:dd:ee:ff"
            }
        }
    ]


def get_usb_tree():
    """Get USB device tree, using actual scanner if available."""
    if USB_SCANNER_AVAILABLE and build_device_tree_func is not None:
        return build_device_tree_func()
    else:
        return MOCK_USB_TREE


def get_network_devices():
    """Get network devices, using actual scanner if available."""
    if NETWORK_SCANNER_AVAILABLE and scan_local_network_func is not None:
        try:
            return scan_local_network_func()
        except PermissionError as e:
            print("[data_formatter] PermissionError from network scanner:",
                  str(e), file=sys.stderr)
            return MOCK_NETWORK_DEVICES
        except Exception as e:
            print("[data_formatter] network scan failed:",
                  str(e), file=sys.stderr)
            return MOCK_NETWORK_DEVICES
    else:
        return MOCK_NETWORK_DEVICES


def format_for_cytoscape(system_info_json, usb_tree, network_devices=None):
    """
    各種データをCytoscape.jsが解釈できるJSONフォーマットに整形する。

    Args:
        system_info_json: PC本体の情報(JSON文字列)
        usb_tree: USBデバイスの階層構造(辞書)
        network_devices: ネットワークデバイスのリスト(辞書のリスト)
    """
    elements = []
    if network_devices is None:
        network_devices = []

    # 1. PC本体の情報をJSONから読み込み、中央のノードとして追加
    system_info = json.loads(system_info_json)
    pc_node = {
        "group": "nodes",
        "data": {
            "id": system_info["node_id"],
            "label": system_info["label"],
            "type": system_info["node_type"],
            "details": system_info["details"]
        }
    }
    elements.append(pc_node)

    # 2. USBデバイスをノードとエッジとして追加する再帰関数
    def process_usb_node(usb_node, parent_id):
        """USBノードをCytoscapeの要素に変換し、elementsリストに追加する"""
        # usb_nodeに含まれるユニークなIDをそのまま使う
        node_id = usb_node["node_id"]

        elements.append({
            "group": "nodes",
            "data": {
                "id": node_id,
                "label": usb_node["label"],
                "type": usb_node["node_type"],
                "details": usb_node.get("details", {})
            }
        })
        elements.append({
            "group": "edges",
            "data": {"source": parent_id, "target": node_id}
        })
        for child in usb_node["children"]:
            process_usb_node(child, node_id)

    # 3. USBツリーの処理を開始
    for device in usb_tree["children"]:
        process_usb_node(device, pc_node["data"]["id"])

    # 4. ネットワークデバイスをノードとエッジとして追加
    for network_device in network_devices:
        # ネットワークデバイスのノードを追加
        elements.append({
            "group": "nodes",
            "data": {
                "id": network_device["node_id"],
                "label": network_device["label"],
                "type": network_device["node_type"],
                "details": network_device.get("details", {})
            }
        })
        # PC本体との接続エッジを追加
        elements.append({
            "group": "edges",
            "data": {
                "source": pc_node["data"]["id"],
                "target": network_device["node_id"]
            }
        })

    return {"elements": elements}


# このファイルが直接実行された場合にのみ以下のコードを実行
if __name__ == "__main__":
    # Issue #2の関数を呼び出して、実際のPC情報を取得
    actual_system_info_json = get_system_info()

    # USB情報を取得（利用可能な場合は実際のスキャン、そうでなければモック）
    usb_tree = get_usb_tree()

    # ネットワークデバイス情報を取得
    # （利用可能な場合は実際のスキャン、そうでなければモック）
    network_devices = get_network_devices()

    # 実際のPC情報、USB情報、ネットワーク情報を統合
    cytoscape_json = format_for_cytoscape(
        actual_system_info_json,
        usb_tree,
        network_devices
    )

    # 整形されたJSONを画面に出力
    print(json.dumps(cytoscape_json, indent=2))
    print("Python script finished successfully.", file=sys.stderr)
