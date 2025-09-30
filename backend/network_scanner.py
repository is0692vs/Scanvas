import json
from scapy.all import srp, Ether, ARP
import socket


def get_local_network_range():
    """
    実行中のマシンのIPアドレスから、スキャン対象のネットワーク範囲を自動で特定する。
    例: 192.168.1.10 -> 192.168.1.0/24
    """
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
        ip_parts = ip_address.split('.')
        network_range = f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0/24"
        return network_range
    except Exception:
        # 接続できない場合は一般的なローカルIP範囲を返す
        return "192.168.1.0/24"


def scan_local_network():
    """
    ローカルネットワークをスキャンし、アクティブなデバイスのリストを返す。
    """
    network_range = get_local_network_range()

    # ARPリクエストを作成
    arp_request = ARP(pdst=network_range)
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request

    # ARPリクエストを送信し、応答を待つ (timeout=2秒)
    # answered_listには応答があったデバイスのペアが格納される
    answered_list = srp(arp_request_broadcast, timeout=2, verbose=False)[0]

    devices = []
    for sent, received in answered_list:
        device_info = {
            "node_id": f"net_{received.psrc.replace('.', '_')}",
            "node_type": "Network Device",
            "label": received.psrc,  # IPアドレスをラベルに
            "details": {
                "ip_address": received.psrc,
                "mac_address": received.hwsrc
            }
        }
        devices.append(device_info)

    return devices


# このファイルが直接実行された場合にのみ以下のコードを実行
if __name__ == "__main__":
    try:
        network_devices = scan_local_network()
        print(json.dumps(network_devices, indent=4))
    except PermissionError:
        error_msg = {
            "error": "Permission denied. Please run this script with sudo."
        }
        print(json.dumps(error_msg, indent=4))
    except Exception as e:
        error_msg = {"error": str(e)}
        print(json.dumps(error_msg, indent=4))
