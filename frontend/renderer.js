// レンダラープロセス - UI制御とイベントハンドリング

document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scan-btn');
  const statusDiv = document.getElementById('status');
  const infoContent = document.getElementById('info-content');

  // スキャンボタンのイベントリスナー
  scanButton.addEventListener('click', async () => {
    statusDiv.textContent = 'スキャン中...';
    scanButton.disabled = true;

    try {
      // 将来のバックエンド連携のための準備
      const systemInfo = await window.scanvasAPI.getSystemInfo();
      const usbDevices = await window.scanvasAPI.getUSBDevices();
      const networkDevices = await window.scanvasAPI.getNetworkDevices();

      // TODO: データをCytoscape.jsでビジュアライズ
      infoContent.innerHTML = `
        <h3>スキャン結果</h3>
        <pre>${JSON.stringify({ systemInfo, usbDevices, networkDevices }, null, 2)}</pre>
      `;

      statusDiv.textContent = 'スキャン完了';
    } catch (error) {
      console.error('スキャンエラー:', error);
      statusDiv.textContent = 'エラーが発生しました';
      infoContent.innerHTML = `<p style="color: red;">エラー: ${error.message}</p>`;
    } finally {
      scanButton.disabled = false;
    }
  });

  // 初期化時のメッセージ
  console.log('Scanvas Electron App initialized');
  statusDiv.textContent = '準備完了';
});
