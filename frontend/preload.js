const { contextBridge, ipcRenderer } = require('electron');

// レンダラープロセスに安全なAPIを公開
contextBridge.exposeInMainWorld('scanvasAPI', {
  // 将来のバックエンド連携用のAPIを準備
  getSystemInfo: () => {
    // TODO: バックエンドとの連携を実装
    return Promise.resolve({ status: 'not_implemented' });
  },
  getUSBDevices: () => {
    // TODO: バックエンドとの連携を実装
    return Promise.resolve({ status: 'not_implemented' });
  },
  getNetworkDevices: () => {
    // TODO: バックエンドとの連携を実装
    return Promise.resolve({ status: 'not_implemented' });
  }
});
