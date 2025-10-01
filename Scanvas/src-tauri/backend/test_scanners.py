import json
import json
from unittest.mock import MagicMock, patch

# テスト対象の関数をインポート
from system_info import get_system_info
from usb_scanner import build_device_tree
from network_scanner import scan_local_network

# --- 1. system_info.py のテスト ---


def test_get_system_info(mocker):
    """
    get_system_infoが正しい構造のJSONを返すかテストする
    """
    # psutilとplatformの動作をモック（偽の動作に置き換え）
    mocker.patch('system_info.platform.uname', return_value=MagicMock(
        system='Linux', release='test-release', version='test-version', machine='x86_64', node='test-pc'))
    mocker.patch('system_info.psutil.cpu_count', return_value=4)
    mocker.patch('system_info.psutil.cpu_freq',
                 return_value=MagicMock(max=2400.0))
    mocker.patch('system_info.psutil.cpu_percent', return_value=10.0)
    mocker.patch('system_info.psutil.virtual_memory', return_value=MagicMock(
        total=8*1024**3, available=4*1024**3, used=4*1024**3, percent=50.0))

    result_json = get_system_info()
    result = json.loads(result_json)

    assert "error" not in result
    assert result["node_id"] == "local_pc"
    assert result["details"]["cpu"]["total_cores"] == 4

# --- 2. usb_scanner.py のテスト ---


@patch('usb_scanner.usb.core.find')
def test_build_device_tree(mock_find):
    """
    build_device_treeがUSBデバイスの階層を正しく構築できるかテストする
    """
    # pyusbのfind関数が返す偽のデバイスリストを作成
    dev1 = MagicMock()
    dev1.bus = 1
    dev1.address = 1
    dev1.idVendor = 0x123
    dev1.idProduct = 0x456
    dev1.parent = None

    # dev2の親としてdev1を設定
    dev2 = MagicMock()
    dev2.bus = 1
    dev2.address = 2
    dev2.idVendor = 0x789
    dev2.idProduct = 0xabc
    dev2.parent = dev1

    mock_find.return_value = [dev1, dev2]

    # get_stringの動作もモック化
    with patch(
        'usb_scanner.usb.util.get_string',
        side_effect=[
            "Manufacturer1", "Product1",
            "Manufacturer2", "Product2"
        ]
    ):
        result = build_device_tree()

        assert result["node_type"] == "USB Root"
        # dev1がルートの子であり、dev2がdev1の子であることを確認
        assert len(result["children"]) == 1
        assert result["children"][0]["node_id"] == "usb_1_1"
        assert len(result["children"][0]["children"]) == 1
        assert result["children"][0]["children"][0]["node_id"] == "usb_1_2"

# --- 3. network_scanner.py のテスト ---


@patch('network_scanner.srp')
@patch(
    'network_scanner.get_local_network_range',
    return_value="192.168.1.0/24"
)
def test_scan_local_network(mock_get_range, mock_srp):
    """
    scan_local_networkがネットワークデバイスを正しく検出できるかテストする
    """
    # scapyのsrp関数が返す偽の応答リストを作成
def test_scan_local_network(mock_get_range: MagicMock, mock_srp: MagicMock):
    mock_response = MagicMock()
    mock_response.psrc = "192.168.1.1"  # IPアドレス
    mock_response.hwsrc = "00:11:22:33:44:55"  # MACアドレス

    # srpは (answered_list, unanswered_list) のタプルを返す
    # answered_listは (sent, received) のタプルのリスト
    mock_srp.return_value = ([(mock_sent, mock_response)], [])

    result = scan_local_network()

    assert len(result) == 1
    assert result[0]["node_id"] == "net_192_168_1_1"
    assert result[0]["details"]["mac_address"] == "00:11:22:33:44:55"
