import usb.core
import usb.util
import json


def get_device_details(dev):
    """USBデバイスの詳細情報を辞書として取得する"""
    details = {
        "bus": dev.bus,
        "address": dev.address,
        "vendor_id": hex(dev.idVendor),
        "product_id": hex(dev.idProduct),
    }
    try:
        details["manufacturer"] = usb.util.get_string(dev, dev.iManufacturer)
    except usb.core.USBError:
        details["manufacturer"] = "N/A"

    try:
        details["product"] = usb.util.get_string(dev, dev.iProduct)
    except usb.core.USBError:
        details["product"] = "N/A"
        details["product"] = "N/A"

    return details


def build_device_tree():
    """
    USBデバイスの階層ツリーを構築し、Pythonの辞書として返す。
    """
    devices = list(usb.core.find(find_all=True))
    device_map = {}

    # まず、全デバイスの基本情報を作成
    for dev in devices:
        details = get_device_details(dev)
        label = f"{details['manufacturer']} {details['product']}".strip()
        # バス番号とアドレスからユニークなIDを生成
        node_id = f"usb_{dev.bus}_{dev.address}"

        # キーをタプル(bus, address)に変更
        unique_key = (dev.bus, dev.address)

        device_map[unique_key] = {
            "node_id": node_id,
            "node_type": "USB Device",
            "label": label if label != "N/A N/A" else "Unknown USB Device",
            "details": details,
            "children": []
        }

    # 仮のルートノードを作成
    root = {
        "node_type": "USB Root",
        "label": "USB Root Hubs",
        "children": []
    }

    # 親子関係を構築
    for dev in devices:
        current_key = (dev.bus, dev.address)
        # parentがNoneでない場合、それは何らかのハブに接続されている
        if dev.parent is not None:
            # 親のキーもタプルで検索
            parent_key = (dev.parent.bus, dev.parent.address)
            if parent_key in device_map:
                parent_info = device_map[parent_key]
                parent_info["children"].append(device_map[current_key])
            else:
                # 親が見つからない場合もルートに追加(念のため)
                root["children"].append(device_map[current_key])
        # parentがNoneの場合、それはルートハブに直接接続されている
        else:
            root["children"].append(device_map[current_key])

    return root


# このファイルが直接実行された場合にのみ以下のコードを実行
if __name__ == "__main__":
    try:
        usb_tree_data = build_device_tree()
        print(json.dumps(usb_tree_data, indent=4))
    except usb.core.NoBackendError:
        error_msg = {
            "error": "libusb backend not found. Please ensure it is installed correctly."
        }
        print(json.dumps(error_msg, indent=4))
    except Exception as e:
        error_msg = {
            "error": "An unexpected error occurred.",
            "error_detail": str(e),
            "error_type": type(e).__name__
        }
        print(json.dumps(error_msg, indent=4))
