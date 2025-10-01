# Scanvas ビルドサマリー

## ビルド実行日時

2025 年 10 月 1 日

## ビルドコマンド

```bash
npm run tauri build
```

## ビルド結果

### ✅ 成功したパッケージ

#### 1. Debian/Ubuntu パッケージ (.deb)

- **ファイル名**: `scanvas_0.1.0_arm64.deb`
- **パス**: `/workspaces/Scanvas/Scanvas/src-tauri/target/release/bundle/deb/`
- **アーキテクチャ**: ARM64 (aarch64)
- **用途**: Debian、Ubuntu、およびその派生ディストリビューション用
- **インストール方法**:
  ```bash
  sudo dpkg -i scanvas_0.1.0_arm64.deb
  sudo apt-get install -f  # 依存関係を解決する場合
  ```

#### 2. Fedora/RHEL パッケージ (.rpm)

- **ファイル名**: `scanvas-0.1.0-1.aarch64.rpm`
- **パス**: `/workspaces/Scanvas/Scanvas/src-tauri/target/release/bundle/rpm/`
- **アーキテクチャ**: ARM64 (aarch64)
- **用途**: Fedora、RHEL、CentOS、およびその派生ディストリビューション用
- **インストール方法**:
  ```bash
  sudo rpm -i scanvas-0.1.0-1.aarch64.rpm
  # または
  sudo dnf install scanvas-0.1.0-1.aarch64.rpm
  ```

#### 3. 実行可能バイナリ

- **ファイル名**: `scanvas`
- **パス**: `/workspaces/Scanvas/Scanvas/src-tauri/target/release/`
- **用途**: パッケージマネージャーなしで直接実行可能
- **実行方法**:
  ```bash
  ./scanvas
  ```

#### 3. 汎用 Linux パッケージ (.AppImage)

- **ファイル名**: `scanvas_0.1.0_aarch64.AppImage`
- **パス**: `/workspaces/Scanvas/Scanvas/src-tauri/target/release/bundle/appimage/`
- **アーキテクチャ**: ARM64 (aarch64)
- **用途**: あらゆる Linux ディストリビューションで実行可能（パッケージマネージャー不要）
- **実行方法**:
  ```bash
  chmod +x scanvas_0.1.0_aarch64.AppImage
  ./scanvas_0.1.0_aarch64.AppImage
  ```
- **特徴**:
  - 依存関係をすべて含む自己完結型
  - インストール不要で実行可能
  - 最も汎用性が高い

## プラットフォーム別の注意事項

### Linux (現在のビルド環境)

- ✅ `.deb` パッケージ生成成功
- ✅ `.rpm` パッケージ生成成功
- ✅ `.AppImage` パッケージ生成成功

### macOS

- ❌ Linux 環境では `.dmg` や `.app` バンドルは生成できません
- **必要な対応**: macOS 上でビルドを実行する必要があります
  ```bash
  # macOS上で実行
  npm run tauri build
  ```
- **生成される成果物**: `.dmg`, `.app`

### Windows

- ❌ Linux 環境では `.msi` や `.exe` インストーラーは生成できません
- **必要な対応**: Windows 上でビルドを実行する必要があります
  ```bash
  # Windows上で実行
  npm run tauri build
  ```
- **生成される成果物**: `.msi`, `.exe`

## ビルド設定

### tauri.conf.json

```json
{
  "bundle": {
    "active": true,
    "targets": "all"
  }
}
```

現在の設定では、実行環境で利用可能なすべてのターゲット形式でビルドを試みます。

## クロスプラットフォームビルドについて

Tauri は基本的に**ネイティブビルド**を推奨しています：

- **Linux 用パッケージ** → Linux 上でビルド
- **macOS 用パッケージ** → macOS 上でビルド
- **Windows 用パッケージ** → Windows 上でビルド

### GitHub Actions を使用したマルチプラットフォームビルド

複数のプラットフォーム向けに自動ビルドを行うには、GitHub Actions の使用を推奨します。

#### 例: `.github/workflows/build.yml`

```yaml
name: Build Multi-Platform

on:
  push:
    tags:
      - "v*"

jobs:
  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Linux packages
        run: npm run tauri build

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build macOS packages
        run: npm run tauri build

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Windows packages
        run: npm run tauri build
```

## 次のステップ

### 1. AppImage ビルドの修正

```bash
sudo apt-get update
sudo apt-get install -y xdg-utils
npm run tauri build
```

### 2. 各 OS でのテスト

生成されたパッケージを対応する OS 上でインストールし、動作確認を行います。

### 3. リリースの配布

- GitHub Releases にパッケージをアップロード
- 各 OS 向けのインストール手順を提供

## 完了条件のチェック

- [x] `npm run tauri build` が成功
- [x] Linux 用パッケージ（.deb、.rpm）が生成された
- [x] AppImage パッケージが生成された
- [ ] macOS 用パッケージが生成された（要 macOS 環境）
- [ ] Windows 用パッケージが生成された（要 Windows 環境）
- [ ] 各 OS でのインストール・起動確認（実行不要と指示あり）

## 追加情報

### 生成されたパッケージ一覧

Linux 環境でのビルドにより、以下の 3 種類のパッケージが正常に生成されました：

1. **scanvas_0.1.0_arm64.deb** - Debian/Ubuntu 用
2. **scanvas-0.1.0-1.aarch64.rpm** - Fedora/RHEL 用
3. **scanvas_0.1.0_aarch64.AppImage** - 汎用 Linux 用

すべてのパッケージは ARM64 アーキテクチャ向けにビルドされています。

### アーキテクチャについて

現在のビルドは ARM64 (aarch64)プラットフォームで実行されたため、生成されたパッケージも ARM64 用です。x86_64 (AMD64/Intel 64bit)向けのパッケージが必要な場合は、x86_64 環境でビルドを実行する必要があります。
