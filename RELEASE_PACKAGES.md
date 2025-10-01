# Scanvas - リリースパッケージ情報

## 📦 生成済みパッケージ

### Linux ARM64 版

#### 1. Debian/Ubuntu パッケージ

```
ファイル: scanvas_0.1.0_arm64.deb
場所: Scanvas/src-tauri/target/release/bundle/deb/
用途: Debian、Ubuntu、Linux Mint等
```

**インストール方法:**

```bash
sudo dpkg -i scanvas_0.1.0_arm64.deb
sudo apt-get install -f  # 依存関係の解決
```

**アンインストール:**

```bash
sudo apt-get remove scanvas
```

---

#### 2. Fedora/RHEL パッケージ

```
ファイル: scanvas-0.1.0-1.aarch64.rpm
場所: Scanvas/src-tauri/target/release/bundle/rpm/
用途: Fedora、RHEL、CentOS、Rocky Linux等
```

**インストール方法:**

```bash
sudo rpm -i scanvas-0.1.0-1.aarch64.rpm
# または
sudo dnf install scanvas-0.1.0-1.aarch64.rpm
```

**アンインストール:**

```bash
sudo rpm -e scanvas
# または
sudo dnf remove scanvas
```

---

#### 3. 汎用 Linux AppImage

```
ファイル: scanvas_0.1.0_aarch64.AppImage
場所: Scanvas/src-tauri/target/release/bundle/appimage/
用途: あらゆるLinuxディストリビューション
```

**実行方法:**

```bash
# 実行権限を付与
chmod +x scanvas_0.1.0_aarch64.AppImage

# 実行
./scanvas_0.1.0_aarch64.AppImage
```

**特徴:**

- ✅ インストール不要
- ✅ 依存関係を全て含む
- ✅ ポータブル（USB メモリ等で持ち運び可能）
- ✅ システムを汚さない

---

## 🚀 推奨される配布方法

### オプション 1: GitHub Releases

1. GitHub リポジトリの Releases ページでタグを作成
2. 生成された 3 つのパッケージをアップロード
3. リリースノートを記述

### オプション 2: 直接配布

各パッケージを適切なプラットフォームのユーザーに配布

---

## 📋 システム要件

### 最小要件

- **プロセッサ**: ARM64 (aarch64)
- **メモリ**: 512MB 以上
- **ディスク**: 50MB 以上の空き容量
- **OS**: Linux (Kernel 3.10 以降)

### 推奨環境

- **メモリ**: 1GB 以上
- **ディスク**: 100MB 以上の空き容量

### 依存関係

- Python 3.x（バックエンドスキャン機能用）
- GTK 3.x（GUI レンダリング用、通常は標準インストール済み）

---

## 🔧 トラブルシューティング

### AppImage が起動しない

```bash
# FUSEがインストールされていることを確認
sudo apt-get install fuse libfuse2

# または、FUSE不要モードで実行
./scanvas_0.1.0_aarch64.AppImage --appimage-extract-and-run
```

### 権限エラー（USB デバイスアクセス）

```bash
# ユーザーをplugdevグループに追加
sudo usermod -aG plugdev $USER

# ログアウト/ログインして変更を反映
```

---

## 📝 注意事項

1. **アーキテクチャの確認**

   - これらのパッケージは ARM64 プロセッサ用です
   - Intel/AMD(x86_64)システムでは動作しません
   - システムアーキテクチャを確認: `uname -m`

2. **Python 依存関係**

   - アプリの完全な機能には Python 3 が必要です
   - 未インストールの場合: `sudo apt-get install python3`

3. **セキュリティ**
   - 信頼できないソースからのパッケージに注意
   - 可能な限りチェックサムを確認

---

## 🌐 他のプラットフォーム

### macOS (未実装)

macOS 用パッケージ(.dmg, .app)をビルドするには:

```bash
# macOS上で実行
npm run tauri build
```

### Windows (未実装)

Windows 用パッケージ(.msi, .exe)をビルドするには:

```bash
# Windows上で実行
npm run tauri build
```

### x86_64 Linux

Intel/AMD 64bit 用パッケージをビルドするには:

```bash
# x86_64 Linux環境で実行
npm run tauri build
```

---

## 📞 サポート

問題が発生した場合は、GitHub の Issues ページで報告してください。

---

**ビルド日**: 2025 年 10 月 1 日  
**バージョン**: 0.1.0  
**アーキテクチャ**: ARM64 (aarch64)
