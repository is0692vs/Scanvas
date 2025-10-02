import json
import sys
from scapy.all import srp, Ether, ARP, IP, ICMP
import socket
import subprocess
import ipaddress


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


def ping_sweep(network_range):
    """
    指定されたネットワーク範囲に対してpingを実行し、応答のあるホストを返す。
    """
    devices = []
    try:
        network = ipaddress.ip_network(network_range, strict=False)
        for ip in network.hosts():
            ip_str = str(ip)
            # pingコマンドを実行
            result = subprocess.run(
                ['ping', '-c', '1', '-W', '1', ip_str],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=2
            )
            if result.returncode == 0:
                # ping成功
                device_info = {
                    "node_id": f"net_{ip_str.replace('.', '_')}",
                    "node_type": "Network Device",
                    "label": ip_str,
                    "details": {
                        "ip_address": ip_str,
                        "mac_address": "Unknown"  # pingではMACアドレスがわからない
                    }
                }
                devices.append(device_info)
    except Exception as e:
        print(f"Ping sweep error: {e}", file=sys.stderr)
    return devices


def scan_local_network():
    """
    ローカルネットワークをスキャンし、アクティブなデバイスのリストを返す。
    ARPスキャンとpingスウィープの両方を使用。
    """
    network_range = get_local_network_range()

    devices = []

    # まずARPスキャンを試す
    try:
        # ARPリクエストを作成
        arp_request = ARP(pdst=network_range)
        broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request

        # ARPリクエストを送信し、応答を待つ (timeout=2秒)
        # answered_listには応答があったデバイスのペアが格納される
        answered_list = srp(arp_request_broadcast, timeout=2, verbose=False)[0]

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
    except (PermissionError, Exception) as e:
        print(f"ARP scan failed: {e}, falling back to ping sweep for gateway", file=sys.stderr)
        # ゲートウェイのIPを取得してping
        try:
            gateway_ip = get_gateway_ip()
            if gateway_ip:
                devices = ping_single(gateway_ip)
        except Exception as e2:
            print(f"Ping sweep also failed: {e2}", file=sys.stderr)

    return devices


def get_gateway_ip():
    """
    デフォルトゲートウェイのIPアドレスを取得
    """
    try:
        with open('/proc/net/route') as f:
            for line in f:
                fields = line.strip().split()
                if fields[1] != '00000000' or not int(fields[3], 16) & 2:
                    continue
                # ゲートウェイIPを取得
                gateway_hex = fields[2]
                gateway_ip = '.'.join(str(int(gateway_hex[i:i+2], 16)) for i in range(6, -1, -2))
                return gateway_ip
    except Exception as e:
        print(f"Failed to get gateway IP: {e}", file=sys.stderr)
    return None


def ping_single(ip):
    """
    単一のIPにpingを実行
    """
    devices = []
    try:
        result = subprocess.run(
            ['ping', '-c', '1', '-W', '1', ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=2
        )
        if result.returncode == 0:
            device_info = {
                "node_id": f"net_{ip.replace('.', '_')}",
                "node_type": "Network Device",
                "label": ip,
                "details": {
                    "ip_address": ip,
                    "mac_address": "Unknown"
                }
            }
            devices.append(device_info)
    except Exception as e:
        print(f"Ping failed for {ip}: {e}", file=sys.stderr)
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
