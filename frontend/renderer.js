// frontend/renderer.js

const cytoscape = require("cytoscape");

window.addEventListener("DOMContentLoaded", () => {
  // サンプルデータ: backend/data_formatter.pyの出力形式に基づく
  const sampleData = {
    elements: [
      {
        group: "nodes",
        data: {
          id: "local_pc",
          label: "My PC",
          type: "Computer",
          details: { os: { system: "Linux" } },
        },
      },
      {
        group: "nodes",
        data: {
          id: "VIA_Labs_USB_Hub",
          label: "VIA Labs, Inc. USB Hub",
          type: "USB Device",
          details: { vendor_id: "0x1234" },
        },
      },
      {
        group: "nodes",
        data: {
          id: "HHKB_Hybrid",
          label: "HHKB-Hybrid",
          type: "USB Device",
          details: { vendor_id: "0x5678" },
        },
      },
      {
        group: "nodes",
        data: {
          id: "net_192_168_1_1",
          label: "192.168.1.1",
          type: "Network Device",
          details: { ip_address: "192.168.1.1" },
        },
      },
      {
        group: "edges",
        data: { source: "local_pc", target: "VIA_Labs_USB_Hub" },
      },
      {
        group: "edges",
        data: { source: "VIA_Labs_USB_Hub", target: "HHKB_Hybrid" },
      },
      {
        group: "edges",
        data: { source: "local_pc", target: "net_192_168_1_1" },
      },
    ],
  };

  // Cytoscape.jsの初期化
  const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: sampleData.elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#3498db",
          label: "data(label)",
          "text-valign": "center",
          color: "#fff",
          "text-outline-width": 2,
          "text-outline-color": "#3498db",
        },
      },
      {
        selector: 'node[type="Computer"]',
        style: { "background-color": "#3498db", shape: "rectangle" },
      },
      {
        selector: 'node[type="USB Device"]',
        style: { "background-color": "#2ecc71", shape: "ellipse" },
      },
      {
        selector: 'node[type="Network Device"]',
        style: { "background-color": "#e67e22", shape: "diamond" },
      },
      {
        selector: "edge",
        style: {
          width: 2,
          "line-color": "#95a5a6",
          "target-arrow-color": "#95a5a6",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
        },
      },
      {
        selector: ":selected",
        style: { "border-width": 3, "border-color": "#e74c3c" },
      },
    ],
    layout: { name: "breadthfirst", animate: true, animationDuration: 500 },
  });

  // ノードクリック時のイベントハンドラ
  cy.on("tap", "node", function (evt) {
    const node = evt.target;
    document.getElementById("info-panel").innerHTML = `<h3>${node.data(
      "label"
    )}</h3><p>Type: ${node.data("type")}</p><p>ID: ${node.data("id")}</p>`;
  });

  // エッジクリック時のイベントハンドラ
  cy.on("tap", "edge", function (evt) {
    const edge = evt.target;
    const source = cy.getElementById(edge.data("source"));
    const target = cy.getElementById(edge.data("target"));
    document.getElementById(
      "info-panel"
    ).innerHTML = `<h3>接続情報</h3><p>接続元: ${source.data(
      "label"
    )}</p><p>接続先: ${target.data("label")}</p>`;
  });

  // 背景クリック時のイベントハンドラ
  cy.on("tap", function (evt) {
    if (evt.target === cy) {
      document.getElementById(
        "info-panel"
      ).innerHTML = `<h3>操作方法</h3><p>🖱️ ドラッグ: グラフを移動</p><p>🔍 スクロール: ズーム</p><p>👆 クリック: ノード情報を表示</p>`;
    }
  });
});
