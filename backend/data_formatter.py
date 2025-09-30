import json
# Issue #2で作成した関数をインポート
from system_info import get_system_info

# --- モックデータ (未実装の機能用) ---
# 本来は usb_scanner.build_device_tree() から取得する
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


def format_for_cytoscape(system_info_json, usb_tree):
    """
    各種データをCytoscape.jsが解釈できるJSONフォーマットに整形する。
    """
    elements = []

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
        node_id = usb_node["label"].replace(" ", "_")
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

    # TODO: Issue #4完了後、ここにネットワークデバイスの処理を追加

    return {"elements": elements}


# このファイルが直接実行された場合にのみ以下のコードを実行
if __name__ == "__main__":
    # Issue #2の関数を呼び出して、実際のPC情報を取得
    actual_system_info_json = get_system_info()

    # 実際のPC情報と、USBのモックデータを使ってフォーマット関数を呼び出す
    cytoscape_json = format_for_cytoscape(
        actual_system_info_json, MOCK_USB_TREE)

    # 整形されたJSONを画面に出力
    print(json.dumps(cytoscape_json, indent=2))
