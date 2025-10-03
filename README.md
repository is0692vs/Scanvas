# Scanvas

**Scanvas**は、システムに接続された USB デバイスとネットワークデバイスを視覚的に表示する Tauri ベースのデスクトップアプリケーションです。

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 特徴

- 🔌 **USB デバイススキャン**: 接続された USB デバイスを自動検出
- 🌐 **ネットワークスキャン**: ローカルネットワーク上のデバイスを検出
- 📊 **視覚的な表示**: Cytoscape.js を使用したインタラクティブなグラフビュー
- 💻 **クロスプラットフォーム**: Linux、macOS、Windows で動作
- 🚀 **高速**: Rust + Tauri による高パフォーマンス

---

## 📦 ダウンロード

### Linux ARM64

最新リリースから以下のパッケージをダウンロードできます：

- **Debian/Ubuntu**: `scanvas_0.1.0_arm64.deb`
- **Fedora/RHEL**: `scanvas-0.1.0-1.aarch64.rpm`
- **AppImage**: `scanvas_0.1.0_aarch64.AppImage` (推奨)

詳細なインストール手順は [RELEASE_PACKAGES.md](./RELEASE_PACKAGES.md) を参照してください。

---

## 🚀 使い方

### AppImage の場合

```bash
# ダウンロード後、実行権限を付与
chmod +x scanvas_0.1.0_aarch64.AppImage

# 実行
./scanvas_0.1.0_aarch64.AppImage
```

### .deb パッケージの場合

```bash
sudo dpkg -i scanvas_0.1.0_arm64.deb
sudo apt-get install -f  # 依存関係の解決

# 実行
scanvas
```

### .rpm パッケージの場合

```bash
sudo dnf install scanvas-0.1.0-1.aarch64.rpm

# 実行
scanvas
```

---

## 🛠️ 開発

### 必要な環境

- **Node.js** 18 以降
- **Rust** 1.70 以降
- **Python** 3.8 以降
- **GTK 3** (Linux)

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/Scanvas.git
cd Scanvas

# 依存関係をインストール
cd Scanvas
npm install

# Pythonの依存関係をインストール
cd ../backend
pip install -r ../requirements.txt
```

### 開発モードで実行

```bash
cd Scanvas
npm run tauri dev
```

### ビルド

```bash
cd Scanvas
npm run tauri build
```

生成されたパッケージは `Scanvas/src-tauri/target/release/bundle/` に保存されます。

詳細なビルド手順は [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) を参照してください。

---

## 📁 プロジェクト構造

```
Scanvas/
├── backend/                    # Pythonバックエンド
│   ├── data_formatter.py      # メインスクリプト
│   ├── network_scanner.py     # ネットワークスキャナー
│   ├── system_info.py         # システム情報収集
│   └── usb_scanner.py         # USBデバイススキャナー
├── Scanvas/                    # Tauriアプリ
│   ├── src/                   # フロントエンド
│   │   ├── index.html
│   │   ├── renderer.js
│   │   └── styles.css
│   └── src-tauri/             # Rustバックエンド
│       ├── src/
│       │   └── main.rs
│       └── tauri.conf.json
├── BUILD_SUMMARY.md           # ビルド詳細
├── RELEASE_PACKAGES.md        # パッケージ情報
└── BUILD_REPORT.md            # ビルドレポート
```

---

## 🔧 システム要件

### 最小要件

- **プロセッサ**: ARM64 または x86_64
- **メモリ**: 512MB 以上
- **ディスク**: 50MB 以上の空き容量
- **OS**: Linux (Kernel 3.10 以降) / macOS 10.15 以降 / Windows 10 以降

### 推奨要件

- **メモリ**: 1GB 以上
- **ディスク**: 100MB 以上の空き容量

---

## 📚 ドキュメント

- [ビルド手順](./BUILD_SUMMARY.md) - 詳細なビルドプロセス
- [パッケージ情報](./RELEASE_PACKAGES.md) - インストールと使用方法
- [ビルドレポート](./BUILD_REPORT.md) - 最新のビルド結果
- [バックエンドドキュメント](./backend/README.md) - Python スクリプトの詳細

---

## 🤝 コントリビューション

プルリクエストは歓迎します！大きな変更の場合は、まず issue を開いて変更内容を議論してください。

1. フォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. コミット (`git commit -m 'Add some AmazingFeature'`)
4. プッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

---

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](./LICENSE) ファイルを参照してください。

---

## 👥 作成者

- **開発者**: Your Name
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🙏 謝辞

- [Tauri](https://tauri.app/) - クロスプラットフォームアプリフレームワーク
- [Cytoscape.js](https://js.cytoscape.org/) - グラフ可視化ライブラリ
- [Rust](https://www.rust-lang.org/) - システムプログラミング言語
- [Python](https://www.python.org/) - バックエンドスクリプト

---

**Happy Scanning! 🔍✨**
