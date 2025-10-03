import json
import socket
import sys
import subprocess

try:
    import scapy.all as scapy
    SCAPY_AVAILABLE = True
except Exception:
    scapy = None
    SCAPY_AVAILABLE = False


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

    devices = []

    if SCAPY_AVAILABLE:
        try:
            # ARPリクエストを作成
            arp_request = scapy.ARP(pdst=network_range)
            broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
            arp_request_broadcast = broadcast / arp_request

            # ARPリクエストを送信し、応答を待つ
            answered_list = scapy.srp(
                arp_request_broadcast, timeout=2, verbose=False
            )[0]

            for sent, received in answered_list:
                device_info = {
                    "node_id": f"net_{received.psrc.replace('.', '_')}",
                    "node_type": "Network Device",
                    "label": received.psrc,
                    "details": {
                        "ip_address": received.psrc,
                        "mac_address": received.hwsrc
                    }
                }
                devices.append(device_info)
            return devices
        except PermissionError:
            # 実行権限がない場合はフォールバックへ
            print(
                "[network_scanner] Permission denied for scapy; "
                "falling back to arp -a",
                file=sys.stderr,
            )
        except Exception as e:
            print(
                "[network_scanner] scapy scan failed: %s; "
                "falling back to arp -a" % (e,),
                file=sys.stderr,
            )

    # フォールバック: システムの arp -a コマンドを使って近隣ホストを列挙
    try:
        # macOS / Linux 用の `arp -a` 出力をパース
        arp_cmd = ["arp", "-a"]
        out = subprocess.check_output(
            arp_cmd, stderr=subprocess.STDOUT, text=True
        )
        for line in out.splitlines():
            # 例の出力行 (macOS/Linux): IPが括弧、MACは 'at' の直後に出る
            parts = line.split()
            if "(" in line and ")" in line:
                # IPは (x.x.x.x) 形式、MACは 'at' の直後
                try:
                    ip = None
                    mac = None
                    for i, p in enumerate(parts):
                        if p.startswith("(") and p.endswith(")"):
                            ip = p.strip("()")
                        if p == "at" and i + 1 < len(parts):
                            mac = parts[i + 1]
                    if ip:
                        device_info = {
                            "node_id": f"net_{ip.replace('.', '_')}",
                            "node_type": "Network Device",
                            "label": ip,
                            "details": {
                                "ip_address": ip,
                                "mac_address": mac
                            }
                        }
                        devices.append(device_info)
                except Exception:
                    # パースエラーはスキップ
                    continue
        return devices
    except FileNotFoundError:
        print(
            "[network_scanner] arp not found; cannot enumerate devices",
            file=sys.stderr,
        )
        return []
    except subprocess.CalledProcessError as e:
        print(
            "[network_scanner] arp command failed:",
            str(e),
            file=sys.stderr,
        )
        return []


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
