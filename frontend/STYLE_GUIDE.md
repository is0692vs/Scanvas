# Scanvas フロントエンド スタイルガイド

## 概要

このドキュメントは、Scanvasのグラフビジュアライゼーションで使用されるスタイル定義の詳細を記載しています。

## ノードスタイル

### Computer（PC本体）

```
┌─────────────────┐
│                 │
│   My Computer   │
│                 │
└─────────────────┘
```

| プロパティ | 値 |
|-----------|---|
| 形状 | rectangle（長方形） |
| サイズ | 80px × 60px |
| 背景色 | #4A90E2（青） |
| 枠線色 | #2E5C8A（濃い青） |
| 枠線太さ | 2px |
| テキスト色 | #fff（白） |

**使用例:**
```javascript
'node[type="Computer"]': {
  'shape': 'rectangle',
  'width': '80px',
  'height': '60px',
  'background-color': '#4A90E2',
  'border-color': '#2E5C8A',
  'color': '#fff'
}
```

### USB Device（USBデバイス）

```
    ╭─────────╮
   │           │
  │   USB Hub  │
   │           │
    ╰─────────╯
```

| プロパティ | 値 |
|-----------|---|
| 形状 | ellipse（楕円） |
| サイズ | 60px × 60px |
| 背景色 | #7ED321（緑） |
| 枠線色 | #5FA319（濃い緑） |
| 枠線太さ | 2px |
| テキスト色 | #333（黒） |

**使用例:**
```javascript
'node[type="USB Device"]': {
  'shape': 'ellipse',
  'width': '60px',
  'height': '60px',
  'background-color': '#7ED321',
  'border-color': '#5FA319',
  'color': '#333'
}
```

### Network Device（ネットワークデバイス）

```
       ╱╲
      ╱  ╲
     ╱NET ╲
    ╱      ╲
   ╱________╲
```

| プロパティ | 値 |
|-----------|---|
| 形状 | diamond（ダイヤモンド） |
| サイズ | 70px × 70px |
| 背景色 | #F5A623（オレンジ） |
| 枠線色 | #C78419（濃いオレンジ） |
| 枠線太さ | 2px |
| テキスト色 | #333（黒） |

**使用例:**
```javascript
'node[type="Network Device"]': {
  'shape': 'diamond',
  'width': '70px',
  'height': '70px',
  'background-color': '#F5A623',
  'border-color': '#C78419',
  'color': '#333'
}
```

## エッジスタイル

```
ノードA ───────────> ノードB
        │││││││││
        └─────────┘
```

| プロパティ | 値 |
|-----------|---|
| 線の太さ | 3px |
| 線の色 | #999（グレー） |
| 矢印形状 | triangle（三角形） |
| 矢印スケール | 1.5 |
| カーブスタイル | bezier（ベジェ曲線） |

**使用例:**
```javascript
'edge': {
  'width': 3,
  'line-color': '#999',
  'target-arrow-shape': 'triangle',
  'target-arrow-color': '#999',
  'curve-style': 'bezier',
  'arrow-scale': 1.5
}
```

## 選択状態スタイル

### 選択されたノード

| プロパティ | 値 |
|-----------|---|
| 枠線色 | #FF6B6B（赤） |
| 枠線太さ | 4px（通常時は2px） |
| オーバーレイ色 | #FF6B6B |
| オーバーレイ透明度 | 0.3 |
| オーバーレイパディング | 8px |

### 選択されたエッジ

| プロパティ | 値 |
|-----------|---|
| 線の太さ | 5px（通常時は3px） |
| 線の色 | #FF6B6B（赤） |
| 矢印色 | #FF6B6B（赤） |

## カラーパレット

### メインカラー

| 色名 | Hex値 | RGB値 | 用途 |
|-----|-------|-------|------|
| Computer Blue | #4A90E2 | rgb(74, 144, 226) | PC本体の背景 |
| Computer Dark Blue | #2E5C8A | rgb(46, 92, 138) | PC本体の枠線 |
| USB Green | #7ED321 | rgb(126, 211, 33) | USBデバイスの背景 |
| USB Dark Green | #5FA319 | rgb(95, 163, 25) | USBデバイスの枠線 |
| Network Orange | #F5A623 | rgb(245, 166, 35) | ネットワークの背景 |
| Network Dark Orange | #C78419 | rgb(199, 132, 25) | ネットワークの枠線 |

### アクセントカラー

| 色名 | Hex値 | RGB値 | 用途 |
|-----|-------|-------|------|
| Edge Gray | #999 | rgb(153, 153, 153) | 接続線 |
| Selection Red | #FF6B6B | rgb(255, 107, 107) | 選択状態 |
| Background | #f5f5f5 | rgb(245, 245, 245) | キャンバス背景 |

## テキストスタイル

### ノードラベル

```javascript
{
  'label': 'data(label)',
  'text-valign': 'center',
  'text-halign': 'center',
  'font-size': '12px',
  'font-weight': 'bold',
  'text-wrap': 'wrap',
  'text-max-width': '80px'
}
```

### Computer ノードのテキスト

```javascript
{
  'color': '#fff',
  'text-outline-width': 2,
  'text-outline-color': '#2E5C8A'
}
```

## レイアウト

### Breadthfirst レイアウト（デフォルト）

```
       [PC本体]
      /   |    \
   [USB] [USB] [NET]
     |
  [USB子]
```

**設定:**
```javascript
{
  name: 'breadthfirst',
  directed: true,
  roots: '#local_pc',
  padding: 50,
  spacingFactor: 1.5,
  animate: true,
  animationDuration: 500
}
```

### その他の利用可能なレイアウト

- **circle**: 円形配置
- **grid**: グリッド配置
- **cose**: 力指向グラフ（Force-directed）
- **concentric**: 同心円状配置

## インタラクション

### ズーム

- **最小**: 0.5倍
- **最大**: 3倍
- **感度**: 0.2（マウスホイール）

### パン

- ドラッグで自由に移動可能
- グラフ全体を表示範囲内で調整

### ノードクリック

1. ノードをクリック
2. 右側のパネルに詳細情報を表示
3. ノードの枠線が赤色にハイライト

## アクセシビリティ

### コントラスト比

すべてのノードタイプは、WCAG 2.1のコントラスト基準を満たすように設計されています：

- Computer（青/白テキスト）: 4.5:1以上
- USB Device（緑/黒テキスト）: 4.5:1以上
- Network Device（オレンジ/黒テキスト）: 4.5:1以上

### キーボードナビゲーション

現在、マウス操作のみをサポートしています。将来的にキーボードナビゲーションを追加予定です。

## ブラウザ互換性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## カスタマイズ

スタイルをカスタマイズする場合は、`app.js`の`style`配列を編集してください：

```javascript
const cy = cytoscape({
  // ...
  style: [
    // ここでスタイルをカスタマイズ
    {
      selector: 'node[type="Computer"]',
      style: {
        'background-color': '#YOUR_COLOR' // 色を変更
      }
    }
  ]
});
```

## パフォーマンス

### 推奨されるノード数

- **最適**: 〜100ノード
- **良好**: 100〜500ノード
- **可能**: 500〜1000ノード

1000ノード以上の場合は、パフォーマンス最適化が必要になる場合があります。

## 参考リンク

- [Cytoscape.js 公式ドキュメント](https://js.cytoscape.org/)
- [カラーデザイン参考](https://flatuicolors.com/)
- [WCAG コントラスト基準](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
