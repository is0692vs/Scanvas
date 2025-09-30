# COPILOT_INSTRUCTIONS.md — Copilot / AI アシスタント向け指示（日本語）

概要

- 本ファイルは GitHub Copilot や類似の AI アシスタントに対する具体的な指示集です。プロジェクトの目的、作業ルール、期待する出力形式、品質基準、問い合わせテンプレートをまとめます。

重要な前提

- プロジェクトはローカルデバイスとローカルネットワークをスキャンして可視化するデスクトップアプリケーション（Scanvas）。
- バックエンドは Python、フロントエンドは Electron + Cytoscape.js を主に使用。

作業スタイル

- 言語: 日本語で簡潔に報告すること（コードコメント・識別子は英語でも可）。
- 出力言語（必須）

  - 明示的な指示がない限り、生成するすべてのテキスト（PR 本文、Issue コメント、エージェントの報告、レビューコメントなど）は日本語で出力してください。
  - コードブロックや変数名・関数名など、技術的識別子は英語での記述を許容します。

- コミット: Conventional Commits を必ず使用する（例: `fix(backend): handle usb disconnect`）。
- ブランチ名: `ISSUE-番号/short-desc`（例: `1/project-foundation`）
- PR: 変更理由、影響範囲、テスト手順を含む短い説明を必ず書く。

コード品質

- Python:

  - PEP8 準拠、型アノテーションを推奨。
  - ドキュメンテーション: docstring（Google or NumPy スタイル）を記載。
  - テスト: pytest を使い、外部環境に依存する処理はモックする。

- JavaScript/TypeScript:

  - ESLint + Prettier に準拠。
  - Electron 側ではメインとレンダラの責務を分離する。

作業の優先順位（Copilot が自動で行って良い順序）

1. 小さな修正やドキュメント作成（README、AGENT.md の更新）
2. テスト追加・修正（単体テスト）
3. 低リスクの機能実装（ユニットで完結する機能）
4. 依存関係の小規模追加（理由を PR に記載）

絶対にしてはいけないこと

- 機密情報をコミットに含めない。
- main ブランチへ直接プッシュしない。
- ユーザーに明示せず大きな設計変更を行わない。

問い合わせテンプレート（Copilot を呼び出すとき）

- 例: 「feat(backend): USB スキャンの初期実装を作成してください。pyusb を使ってデバイス一覧を取得して JSON を出力するモジュールを作り、pytest のモック付き単体テストを追加してください。Issue #3 に紐付けます。」

PR 説明テンプレート（Copilot が自動生成する）

- タイトル: `type(scope): short description (#ISSUE)`
- 本文:
  - 目的
  - 変更点の要約
  - 動作確認手順
  - テスト
  - 関連 Issue

レビューガイドライン（Copilot の自己チェック）

- 変更は最小単位か？
- テストが存在するか？（テストが必要な変更には必ずテストを追加）
- Lint とフォーマットを通しているか？
- ドキュメントや README に追記が必要か？

追加リソース

- リポジトリルートの `AGENT.md` を参照し、ワークフローと制約を尊重すること。

例: タスク指示と期待される出力

- 指示: `feat(backend): implement system info exporter`（Issue #2）

- 出力（期待）:
  1. `backend/system_info.py` を追加（psutil を使って OS/CPU/Memory/Disk を取得、JSON を返す関数を実装）
  2. `tests/test_system_info.py` を追加（モックを使用した pytest）
  3. PR を作成し、上記テンプレートに従った説明を記載

最後に

- 不確かな点があれば必ず Issue を作成して確認を求めること。承認のない設計変更は実行しない。

エージェント作業報告フォーマット（必須）

Copilot や自動化エージェントは、各作業完了時に必ず日本語テキストで以下を出力し、PR 本文または Issue コメントに貼り付けること。

- 作業まとめ: 実施した変更点を箇条書きで記載（追加/変更/削除したファイルと主要な関数名を含める）
- テスト方法: 存在する場合はテストの実行手順と期待される結果を記載する（実行コマンドの例を含める）
- 影響範囲: 変更が影響するモジュールやコンポーネントを簡潔に説明する
- 次のアクション: 人間が行うべきフォローアップがあれば記載する

テンプレート例:

作業まとめ:

- 追加: `backend/system_info.py`
- 追加: `tests/test_system_info.py`

テスト方法:

1. `python -m venv .venv && . .venv/bin/activate`
2. `pip install -r backend/requirements.txt`
3. `pytest backend/tests/test_system_info.py`

期待結果: すべてのテストが成功すること
