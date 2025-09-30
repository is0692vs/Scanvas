// frontend/main.js

const { app, BrowserWindow } = require("electron");
const path = require("path");

// ウィンドウを作成する関数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // index.htmlをウィンドウに読み込ませる
  mainWindow.loadFile("index.html");
}

// アプリの準備ができたらウィンドウを作成
app.whenReady().then(createWindow);

// 全てのウィンドウが閉じられたらアプリを終了
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // macOS以外の場合
    app.quit();
  }
});
