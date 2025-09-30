import psutil
import platform
import json

def get_system_info():
    """
    PC本体のシステム情報（OS, CPU, メモリ）を取得し、
    JSON形式で返す関数。
    """
    try:
        # OS情報
        uname = platform.uname()
        os_info = {
            "system": uname.system,
            "release": uname.release,
            "version": uname.version,
            "machine": uname.machine
        }

        # CPU情報
        cpu_info = {
            "physical_cores": psutil.cpu_count(logical=False),
            "total_cores": psutil.cpu_count(logical=True),
            "max_frequency": f"{psutil.cpu_freq().max:.2f}Mhz",
            "cpu_usage_percent": psutil.cpu_percent(interval=1)
        }

        # メモリ情報
        svmem = psutil.virtual_memory()
        memory_info = {
            "total": f"{svmem.total / (1024**3):.2f} GB",
            "available": f"{svmem.available / (1024**3):.2f} GB",
            "used": f"{svmem.used / (1024**3):.2f} GB",
            "percentage": f"{svmem.percent}%"
        }

        # 全ての情報を一つの辞書にまとめる
        all_info = {
            "node_id": "local_pc", # グラフの中心ノードとしての一意のID
            "node_type": "Computer",
            "label": uname.node, # PCのホスト名
            "details": {
                "os": os_info,
                "cpu": cpu_info,
                "memory": memory_info
            }
        }
        
        # 辞書をJSON形式の文字列に変換して返す
        return json.dumps(all_info, indent=4)

    except Exception as e:
        return json.dumps({"error": str(e)})

# このファイルが直接実行された場合にのみ以下のコードを実行
if __name__ == "__main__":
    system_info_json = get_system_info()
    print(system_info_json)