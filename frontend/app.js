// サンプルデータ: backend/data_formatter.pyの出力形式に基づく
const sampleData = {
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "local_pc",
        "label": "dcc256ba0329",
        "type": "Computer",
        "details": {
          "os": {
            "system": "Linux",
            "release": "6.11.0-1018-azure",
            "version": "#18~24.04.1-Ubuntu SMP",
            "machine": "x86_64"
          },
          "cpu": {
            "physical_cores": 2,
            "total_cores": 4,
            "cpu_usage_percent": 0.5
          },
          "memory": {
            "total_gb": 15.62,
            "available_gb": 14.14,
            "used_gb": 1.48,
            "percentage": 9.5
          }
        }
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "VIA_Labs_USB_Hub",
        "label": "VIA Labs, Inc. USB Hub",
        "type": "USB Device",
        "details": {
          "vendor_id": "0x1234"
        }
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "HHKB_Hybrid",
        "label": "HHKB-Hybrid",
        "type": "USB Device",
        "details": {
          "vendor_id": "0x5678"
        }
      }
    },
    {
      "group": "nodes",
      "data": {
        "id": "net_192_168_1_1",
        "label": "192.168.1.1",
        "type": "Network Device",
        "details": {
          "ip_address": "192.168.1.1",
          "mac_address": "aa:bb:cc:dd:ee:ff"
        }
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "local_pc",
        "target": "VIA_Labs_USB_Hub"
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "VIA_Labs_USB_Hub",
        "target": "HHKB_Hybrid"
      }
    },
    {
      "group": "edges",
      "data": {
        "source": "local_pc",
        "target": "net_192_168_1_1"
      }
    }
  ]
};

// Cytoscape.jsの初期化
const cy = cytoscape({
  container: document.getElementById('cy'),
  
  elements: sampleData.elements,
  
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#3498db',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#333',
        'font-size': '12px',
        'width': '60px',
        'height': '60px',
        'text-wrap': 'wrap',
        'text-max-width': '80px'
      }
    },
    {
      selector: 'node[type="Computer"]',
      style: {
        'background-color': '#e74c3c',
        'width': '80px',
        'height': '80px',
        'font-size': '14px',
        'font-weight': 'bold'
      }
    },
    {
      selector: 'node[type="USB Device"]',
      style: {
        'background-color': '#9b59b6',
        'shape': 'roundrectangle'
      }
    },
    {
      selector: 'node[type="Network Device"]',
      style: {
        'background-color': '#2ecc71',
        'shape': 'diamond'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#95a5a6',
        'target-arrow-color': '#95a5a6',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    },
    {
      selector: ':selected',
      style: {
        'background-color': '#f39c12',
        'line-color': '#f39c12',
        'target-arrow-color': '#f39c12',
        'border-width': 3,
        'border-color': '#f39c12'
      }
    }
  ],
  
  layout: {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    nodeRepulsion: 4000,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    nestingFactor: 1.2,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  }
});

// ノードクリック時のイベントハンドラ
cy.on('tap', 'node', function(evt) {
  const node = evt.target;
  const data = node.data();
  
  console.log('Node clicked:', data);
  
  // ノード情報を表示
  let infoHTML = `
    <h3>${data.label}</h3>
    <p><strong>タイプ:</strong> ${data.type}</p>
  `;
  
  if (data.details) {
    infoHTML += '<p><strong>詳細情報:</strong></p>';
    
    if (data.type === 'Computer' && data.details.os) {
      infoHTML += `
        <p>OS: ${data.details.os.system} ${data.details.os.release}</p>
        <p>CPU: ${data.details.cpu.total_cores} cores (${data.details.cpu.cpu_usage_percent}% usage)</p>
        <p>Memory: ${data.details.memory.used_gb.toFixed(2)}GB / ${data.details.memory.total_gb.toFixed(2)}GB</p>
      `;
    } else if (data.type === 'USB Device' && data.details.vendor_id) {
      infoHTML += `<p>Vendor ID: ${data.details.vendor_id}</p>`;
    } else if (data.type === 'Network Device') {
      if (data.details.ip_address) {
        infoHTML += `<p>IP: ${data.details.ip_address}</p>`;
      }
      if (data.details.mac_address) {
        infoHTML += `<p>MAC: ${data.details.mac_address}</p>`;
      }
    }
  }
  
  // 既存の情報パネルを更新
  const existingPanel = document.querySelector('.info-panel');
  if (existingPanel) {
    existingPanel.innerHTML = infoHTML;
  }
});

// エッジクリック時のイベントハンドラ
cy.on('tap', 'edge', function(evt) {
  const edge = evt.target;
  const data = edge.data();
  
  console.log('Edge clicked:', data);
  
  const sourceNode = cy.getElementById(data.source).data();
  const targetNode = cy.getElementById(data.target).data();
  
  const infoHTML = `
    <h3>接続情報</h3>
    <p><strong>接続元:</strong> ${sourceNode.label}</p>
    <p><strong>接続先:</strong> ${targetNode.label}</p>
  `;
  
  const existingPanel = document.querySelector('.info-panel');
  if (existingPanel) {
    existingPanel.innerHTML = infoHTML;
  }
});

// グラフの背景をクリックした時に情報パネルをリセット
cy.on('tap', function(evt) {
  if (evt.target === cy) {
    const existingPanel = document.querySelector('.info-panel');
    if (existingPanel) {
      existingPanel.innerHTML = `
        <h3>操作方法</h3>
        <p>🖱️ ドラッグ: グラフを移動</p>
        <p>🔍 スクロール: ズーム</p>
        <p>👆 クリック: ノード情報を表示</p>
      `;
    }
  }
});

console.log('Cytoscape.js initialized with sample data');
console.log('Total nodes:', cy.nodes().length);
console.log('Total edges:', cy.edges().length);
