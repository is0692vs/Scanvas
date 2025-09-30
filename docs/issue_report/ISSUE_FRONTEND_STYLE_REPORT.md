# フロントエンド グラフスタイル実装レポート

## 実施日
2024年9月30日

## Issue概要
`style(frontend): グラフの基本的な見た目 (ノードの形や色、線) を定義する`

フロントエンドでCytoscape.jsを使用し、PC、USBデバイス、ネットワークデバイスを視覚化するためのグラフスタイルを定義しました。

## 作業内容

### 1. ファイル作成
以下のファイルを`frontend/`ディレクトリに新規作成しました：
- `index.html` - メインHTMLファイル
- `app.js` - Cytoscape.js初期化とグラフスタイル定義
- `styles.css` - ページ全体のスタイル定義
- `package.json` - npm依存関係定義
- `style-demo.html` - スタイル仕様を視覚的に示すデモページ
- `README.md` - フロントエンド実装の詳細ドキュメント

### 2. グラフスタイル定義

#### ノードタイプ別スタイル

**Computer（PC本体）**
- 形状: 長方形 (rectangle)
- サイズ: 80px × 60px
- 背景色: #4A90E2（青）
- 枠線色: #2E5C8A（濃い青）
- 枠線太さ: 2px

```javascript
{
  selector: 'node[type="Computer"]',
  style: {
    'shape': 'rectangle',
    'width': '80px',
    'height': '60px',
    'background-color': '#4A90E2',
    'border-color': '#2E5C8A'
  }
}
```

**USB Device（USBデバイス）**
- 形状: 楕円 (ellipse)
- サイズ: 60px × 60px
- 背景色: #7ED321（緑）
- 枠線色: #5FA319（濃い緑）
- 枠線太さ: 2px

```javascript
{
  selector: 'node[type="USB Device"]',
  style: {
    'shape': 'ellipse',
    'width': '60px',
    'height': '60px',
    'background-color': '#7ED321',
    'border-color': '#5FA319'
  }
}
```

**Network Device（ネットワークデバイス）**
- 形状: ダイヤモンド (diamond)
- サイズ: 70px × 70px
- 背景色: #F5A623（オレンジ）
- 枠線色: #C78419（濃いオレンジ）
- 枠線太さ: 2px

```javascript
{
  selector: 'node[type="Network Device"]',
  style: {
    'shape': 'diamond',
    'width': '70px',
    'height': '70px',
    'background-color': '#F5A623',
    'border-color': '#C78419'
  }
}
```

#### エッジスタイル

接続線の基本スタイル：
- 線の太さ: 3px
- 色: #999（グレー）
- 矢印形状: 三角形 (triangle)
- 矢印スケール: 1.5
- カーブスタイル: ベジェ曲線 (bezier)

```javascript
{
  selector: 'edge',
  style: {
    'width': 3,
    'line-color': '#999',
    'target-arrow-color': '#999',
    'target-arrow-shape': 'triangle',
    'curve-style': 'bezier',
    'arrow-scale': 1.5
  }
}
```

#### インタラクションスタイル

**選択時のノードスタイル:**
- 枠線色: #FF6B6B（赤）
- 枠線太さ: 4px
- オーバーレイ効果あり

**選択時のエッジスタイル:**
- 線の太さ: 5px
- 色: #FF6B6B（赤）

### 3. レイアウト設定

グラフレイアウトアルゴリズム：
- 名前: breadthfirst（幅優先探索）
- 方向性: 有向グラフ
- ルートノード: PC本体 (#local_pc)
- パディング: 50px
- 間隔係数: 1.5
- アニメーション時間: 500ms

### 4. ユーザーインタラクション機能

実装した機能：
- **ノードクリック**: 右側のパネルに詳細情報を表示
- **ズーム**: マウスホイールで0.5倍〜3倍の範囲で調整可能
- **パン**: ドラッグでグラフ全体を移動
- **選択**: ノードとエッジのクリック選択（視覚的フィードバックあり）

### 5. サンプルデータ

`app.js`にはデモ用のサンプルデータを含めました：
```javascript
const sampleData = {
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "local_pc",
        "label": "My Computer",
        "type": "Computer"
      }
    },
    // ... USB Device, Network Device
  ]
};
```

## テスト方法

### 1. スタイルデモの確認

```bash
cd frontend
python3 -m http.server 8080
```

ブラウザで http://localhost:8080/style-demo.html を開き、以下を確認：
- ✅ Computer、USB Device、Network Deviceの各ノードスタイル
- ✅ カラーパレット
- ✅ エッジスタイル
- ✅ 詳細仕様表

### 2. グラフビジュアライゼーションのテスト

**注意**: Cytoscape.jsライブラリが必要です。

#### オプションA: CDNから読み込む
`index.html`を以下のように変更：
```html
<script src="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js"></script>
```

#### オプションB: ローカルにダウンロード
```bash
cd frontend
curl -L -o cytoscape.min.js https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js
```

#### オプションC: npmを使用
```bash
cd frontend
npm install
# node_modulesからcytoscape.jsをコピーまたはバンドラーを使用
```

その後、http://localhost:8080/index.html を開いて以下を確認：
- ✅ サンプルグラフが表示される
- ✅ PC本体ノードが青い長方形で表示される
- ✅ USBデバイスが緑の楕円で表示される
- ✅ ネットワークデバイスがオレンジのダイヤモンドで表示される
- ✅ エッジが矢印付きで接続している
- ✅ ノードをクリックすると右パネルに詳細が表示される

## 成果物

### カラースキーム
| 要素 | メインカラー | 枠線カラー | 用途 |
|------|------------|----------|------|
| Computer | #4A90E2 | #2E5C8A | PC本体ノード |
| USB Device | #7ED321 | #5FA319 | USBデバイスノード |
| Network Device | #F5A623 | #C78419 | ネットワークデバイスノード |
| Edge | #999 | - | 接続線 |
| Selected | #FF6B6B | #FF6B6B | 選択状態 |

### ドキュメント
- `frontend/README.md`: セットアップ方法、使用方法、カスタマイズ方法を記載
- `frontend/style-demo.html`: スタイル仕様を視覚的に示すページ

## バックエンドとの統合

作成したフロントエンドは、`backend/data_formatter.py`が出力するCytoscape.js形式のJSONと互換性があります。

データ読み込み例：
```javascript
// バックエンドからデータを取得
fetch('/api/graph-data')
  .then(response => response.json())
  .then(data => {
    loadGraphData(data);
  });
```

`data`は以下の形式を期待します：
```json
{
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "local_pc",
        "label": "hostname",
        "type": "Computer",
        "details": {...}
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "parent_id",
        "target": "child_id"
      }
    }
  ]
}
```

## 今後の拡張予定

### 短期的な改善
- [ ] バックエンドAPIとの統合
- [ ] リアルタイムデータ更新機能
- [ ] ノードのツールチップ表示
- [ ] フィルタリング機能（ノードタイプ別）

### 中期的な改善
- [ ] 検索機能（ノードのラベルやIDで検索）
- [ ] グラフのエクスポート機能（PNG、SVG、JSON）
- [ ] レイアウトアルゴリズムの選択UI
- [ ] レスポンシブデザイン対応（モバイル）

### 長期的な改善
- [ ] ノードの編集機能
- [ ] カスタムスタイルテーマ
- [ ] 複数グラフの比較表示
- [ ] パフォーマンス最適化（大規模グラフ対応）

## 技術スタック

- **Cytoscape.js**: 3.26.0 - グラフ可視化ライブラリ
- **HTML5/CSS3**: レイアウトとスタイリング
- **Vanilla JavaScript**: インタラクション処理

## 参考資料

- [Cytoscape.js 公式ドキュメント](https://js.cytoscape.org/)
- [Cytoscape.js スタイル仕様](https://js.cytoscape.org/#style)
- [Cytoscape.js レイアウト](https://js.cytoscape.org/#layouts)

## 備考

- 現在のブランチ: `copilot/fix-3125c24a-ca35-40ff-8e31-9b39f97ae5f0`
- スタイル定義は、Cytoscape.jsの公式ドキュメントに準拠
- 配色は視認性とアクセシビリティを考慮
- サンプルデータは実際のバックエンド出力形式に準拠
