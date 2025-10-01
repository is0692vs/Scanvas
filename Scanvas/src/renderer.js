// scanvas/src/renderer.js

// DOMの準備が完了してから全ての処理を開始します
window.addEventListener("DOMContentLoaded", () => {
  // DOMの準備が完了した後にAPIと変数を定義します
  const invoke = window.__TAURI__.invoke;
  const cytoscape = window.cytoscape;

  let cy = null;
  const scanButton = document.getElementById("scan-button");
  const infoTitle = document.getElementById("info-title");
  const infoContent = document.getElementById("info-content");

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
      layout: { name: "cose", animate: false, padding: 30 },
    });
    attachEventListeners();
    cy.resize();
    cy.fit();
  }

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
  }

  // メインの処理
  scanButton.addEventListener("click", async () => {
    try {
      infoTitle.innerText = "スキャン中...";
      infoContent.innerHTML = "<p>バックエンド処理を実行しています...</p>";
      scanButton.disabled = true;

      const jsonString = await invoke("run_scan");
      const graphData = JSON.parse(jsonString);

      console.log("バックエンドから受信したデータ:", graphData);

      setupCytoscape(graphData.elements);

      infoTitle.innerText = "スキャン完了";
      infoContent.innerHTML = `<p>${cy.nodes().length}個のデバイスと${
        cy.edges().length
      }個の接続が見つかりました。</p>`;
    } catch (error) {
      console.error("スキャン中にエラーが発生しました:", error);
      infoTitle.innerText = "エラー";
      infoContent.innerHTML = `<p>スキャンに失敗しました。詳細はコンソールを確認してください。</p>`;
    } finally {
      scanButton.disabled = false;
    }
  });

  // 初期表示
  setupCytoscape([]);
});
