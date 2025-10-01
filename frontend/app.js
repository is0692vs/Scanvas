// Sample data for demonstration
// In production, this would be loaded from the backend
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
    {
      "group": "nodes",
      "data": {
        "id": "usb_device_1",
        "label": "USB Hub",
        "type": "USB Device"
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "usb_device_2",
        "label": "Keyboard",
        "type": "USB Device"
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "net_device_1",
        "label": "192.168.1.1",
        "type": "Network Device"
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "local_pc",
        "target": "usb_device_1"
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "usb_device_1",
        "target": "usb_device_2"
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "local_pc",
        "target": "net_device_1"
      }
    }
  ]
};

// Initialize Cytoscape
const cy = cytoscape({
  container: document.getElementById('cy'),
  
  elements: sampleData.elements,
  
  style: [
    // ノードの共通スタイル
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
        'font-weight': 'bold',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'border-width': 2,
        'border-color': '#333',
        'background-opacity': 1
      }
    },
    
    // Computer ノードのスタイル
    {
      selector: 'node[type="Computer"]',
      style: {
        'shape': 'rectangle',
        'width': '80px',
        'height': '60px',
        'background-color': '#4A90E2',
        'border-color': '#2E5C8A',
        'color': '#fff',
        'text-outline-width': 2,
        'text-outline-color': '#2E5C8A'
      }
    },
    
    // USB Device ノードのスタイル
    {
      selector: 'node[type="USB Device"]',
      style: {
        'shape': 'ellipse',
        'width': '60px',
        'height': '60px',
        'background-color': '#7ED321',
        'border-color': '#5FA319',
        'color': '#333'
      }
    },
    
    // Network Device ノードのスタイル
    {
      selector: 'node[type="Network Device"]',
      style: {
        'shape': 'diamond',
        'width': '70px',
        'height': '70px',
        'background-color': '#F5A623',
        'border-color': '#C78419',
        'color': '#333'
      }
    },
    
    // エッジの共通スタイル
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
    },
    
    // ホバー時のノードスタイル
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#FF6B6B',
        'overlay-color': '#FF6B6B',
        'overlay-opacity': 0.3,
        'overlay-padding': 8
      }
    },
    
    // ホバー時のエッジスタイル
    {
      selector: 'edge:selected',
      style: {
        'width': 5,
        'line-color': '#FF6B6B',
        'target-arrow-color': '#FF6B6B'
      }
    }
  ],
  
  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: '#local_pc',
    padding: 50,
    spacingFactor: 1.5,
    animate: true,
    animationDuration: 500
  },
  
  // インタラクション設定
  minZoom: 0.5,
  maxZoom: 3,
  wheelSensitivity: 0.2
});

// ノードクリック時の情報表示
cy.on('tap', 'node', function(evt) {
  const node = evt.target;
  const data = node.data();
  console.log('Node clicked:', data);
  
  // 詳細情報パネルを更新
  const detailsPanel = document.getElementById('node-details');
  let detailsHtml = `<h3>${data.label}</h3>`;
  detailsHtml += `<p><span class="detail-label">Type:</span> ${data.type}</p>`;
  detailsHtml += `<p><span class="detail-label">ID:</span> ${data.id}</p>`;
  
  // 詳細情報がある場合は表示
  if (data.details) {
    detailsHtml += '<h4>詳細情報:</h4>';
    for (const [key, value] of Object.entries(data.details)) {
      if (typeof value === 'object') {
        detailsHtml += `<p><span class="detail-label">${key}:</span></p>`;
        for (const [subKey, subValue] of Object.entries(value)) {
          detailsHtml += `<p style="margin-left: 15px;"><span class="detail-label">${subKey}:</span> ${subValue}</p>`;
        }
      } else {
        detailsHtml += `<p><span class="detail-label">${key}:</span> ${value}</p>`;
      }
    }
  }
  
  detailsPanel.innerHTML = detailsHtml;
});

// エッジクリック時の情報表示
cy.on('tap', 'edge', function(evt) {
  const edge = evt.target;
  const data = edge.data();
  console.log('Edge clicked:', data);
});

// レイアウトの再計算を行う関数
function relayout() {
  cy.layout({
    name: 'breadthfirst',
    directed: true,
    roots: '#local_pc',
    padding: 50,
    spacingFactor: 1.5,
    animate: true,
    animationDuration: 500
  }).run();
}

// データをロードする関数（将来的にバックエンドから取得する用）
function loadGraphData(data) {
  cy.elements().remove();
  cy.add(data.elements);
  relayout();
}

// グローバルスコープに公開（デバッグ用）
window.cy = cy;
window.loadGraphData = loadGraphData;
window.relayout = relayout;
