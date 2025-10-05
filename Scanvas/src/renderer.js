// scanvas/src/renderer.js

import cola from 'cytoscape-cola';

// DOMの準備が完了してから全ての処理を開始します
window.addEventListener("DOMContentLoaded", () => {
  console.log("[Frontend] DOMContentLoaded - Initializing Scanvas");

  // Tauri v2 APIをチェック
  console.log(
    "[Frontend] window.__TAURI__ available:",
    typeof window.__TAURI__ !== "undefined"
  );
  if (window.__TAURI__) {
    console.log("[Frontend] __TAURI__ keys:", Object.keys(window.__TAURI__));
  }

  // Tauri v2ではinvokeはcoreモジュール内にある
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  const cytoscape = window.cytoscape;
  cytoscape.use(cola);

  console.log(
    "[Frontend] Tauri invoke available:",
    typeof invoke === "function"
  );
  console.log(
    "[Frontend] Cytoscape available:",
    typeof cytoscape === "function"
  );

  if (typeof invoke !== "function") {
    console.error("[Frontend Error] Tauri invoke function not found!");
    console.error(
      "[Frontend Error] Please ensure Tauri API is loaded correctly"
    );
    return;
  }

  let cy = null;
  const scanButton = document.getElementById("scan-button");
  const layoutSwitch = document.getElementById("layout-switch");
  const infoTitle = document.getElementById("info-title");
  const infoContent = document.getElementById("info-content");

  // レイアウト設定
  const staticLayout = {
    name: 'cose',
    animate: true,
    nodeRepulsion: 80000,
    idealEdgeLength: 180,
    padding: 50
  };

  const dynamicLayout = {
    name: 'cola',
    animate: true,
    maxSimulationTime: 3000, // 計算時間
    fit: true,
    padding: 50,
    nodeSpacing: 10,
    edgeLength: 180,
    infinite: true // ライブアップデートを有効化
  };

  // スタイルの定義
  const cyStyle = [
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
      style: { "background-color": "#e74c3c", shape: "rectangle" },
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
  ];

  // Cytoscapeインスタンスを生成・管理するヘルパー関数
  function setupCytoscape(elements) {
    if (cy) {
      cy.destroy();
    }
    cy = cytoscape({
      container: document.getElementById("cy"),
      elements: elements,
      style: cyStyle,
      layout: staticLayout,
    });
    attachEventListeners();
    cy.resize();
    cy.fit();
  }

  // レイアウトスイッチのイベントリスナー
  layoutSwitch.addEventListener("change", () => {
    if (cy) {
      const layout = layoutSwitch.checked ? dynamicLayout : staticLayout;
      cy.layout(layout).run();
    }
  });

  // イベントハンドラを登録する関数
  function attachEventListeners() {
    // ノードクリック時の処理
    cy.on("tap", "node", (evt) => {
      const data = evt.target.data();
      infoTitle.innerText = data.label || "N/A";
      let contentHTML = `<p><strong>Type:</strong> ${data.type || "-"}</p>`;
      if (data.details) {
        if (data.type === "Computer" && data.details.os) {
          contentHTML += `<p><strong>OS:</strong> ${data.details.os.system}</p>`;
        } else if (data.type === "USB Device" && data.details.vendor_id) {
          contentHTML += `<p><strong>Vendor ID:</strong> ${data.details.vendor_id}</p>`;
        } else if (data.type === "Network Device" && data.details.ip_address) {
          contentHTML += `<p><strong>IP:</strong> ${data.details.ip_address}</p>`;
        }
      }
      infoContent.innerHTML = contentHTML;
    });

    // エッジ（接続線）クリック時の処理
    cy.on("tap", "edge", (evt) => {
      const edge = evt.target;
      const source = cy.getElementById(edge.data("source"));
      const target = cy.getElementById(edge.data("target"));
      infoTitle.innerText = "接続情報";
      infoContent.innerHTML = `<p><strong>接続元:</strong> ${source.data(
        "label"
      )}</p><p><strong>接続先:</strong> ${target.data("label")}</p>`;
    });

    // 背景クリック時の処理
    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        infoTitle.innerText = "操作方法";
        infoContent.innerHTML = `<p>🖱️ ドラッグ: グラフを移動</p><p>🔍 スクロール: ズーム</p><p>👆 クリック: ノード情報を表示</p>`;
      }
    });

    // ノードドラッグ終了時の処理（動的レイアウトの場合）
    cy.on("dragfree", "node", (evt) => {
      if (layoutSwitch.checked) {
        cy.layout(dynamicLayout).run();
      }
    });
  }

  // スキャン実行関数
  async function performScan() {
    console.log("[Frontend] Starting scan...");
    try {
      infoTitle.innerText = "スキャン中...";
      infoContent.innerHTML = "<p>バックエンド処理を実行しています...</p>";
      scanButton.disabled = true;

      console.log('[Frontend] Calling invoke("run_scan")...');
      const jsonString = await invoke("run_scan");
      console.log("[Frontend] Received response, length:", jsonString.length);
      const graphData = JSON.parse(jsonString);

      console.log("[Frontend] Parsed JSON successfully");
      console.log("[Frontend] Graph data:", graphData);
      console.log(
        "[Frontend] Number of elements:",
        graphData.elements ? graphData.elements.length : "undefined"
      );

      setupCytoscape(graphData.elements);

      infoTitle.innerText = "スキャン完了";
      const nodeList = cy
        .nodes()
        .map((node) => node.data("label"))
        .join("<br>");
      infoContent.innerHTML = `<p>${cy.nodes().length}個のデバイスと${
        cy.edges().length
      }個の接続が見つかりました。</p><p><strong>検出されたデバイス:</strong></p><p>${nodeList}</p>`;
    } catch (error) {
      console.error("[Frontend Error] Scan failed:", error);
      console.error("[Frontend Error] Error type:", typeof error);
      console.error(
        "[Frontend Error] Error message:",
        error.message || error.toString()
      );
      infoTitle.innerText = "エラー";
      infoContent.innerHTML = `<p>スキャンに失敗しました: ${
        error.message || error
      }</p>`;
    } finally {
      scanButton.disabled = false;
    }
  }

  // ボタンクリック時
  scanButton.addEventListener("click", () => {
    console.log("[Frontend] Scan button clicked");
    performScan();
  });

  // 自動スキャンイベントのリスナー
  if (window.__TAURI__?.event?.listen) {
    window.__TAURI__.event.listen("auto-scan", () => {
      console.log("[Frontend] Auto-scan event received");
      performScan();
    });
  }

  // 初期表示
  setupCytoscape([]);
  console.log("[Frontend] Initialization complete - Ready to scan");

  // 起動後すぐに自動スキャンを実行
  console.log("[Frontend] Triggering initial auto-scan in 1 second...");
  setTimeout(() => {
    console.log("[Frontend] Executing initial auto-scan");
    performScan();
  }, 1000);
});
