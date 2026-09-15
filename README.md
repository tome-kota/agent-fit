# AgentFit

質問に答えることで、自分に合ったAIとの協働ルールを生成する静的Webアプリである。

## 構成

```text
.
├── index.html
├── styles.css
├── app.js
├── .nojekyll
├── .gitignore
└── .github/
    └── workflows/
        └── pages.yml
```

ビルドツール、パッケージマネージャー、外部JavaScriptライブラリは使用しない。
`index.html` を直接ブラウザで開いても利用できる。

## GitHub Pages へデプロイ

1. GitHub に `agent-fit` リポジトリを作成する。
2. このディレクトリの内容をリポジトリ直下へ配置し、`main` ブランチへ push する。
3. GitHub の **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択する。
4. `Deploy GitHub Pages` workflow を実行する。
   - `main` への push で自動実行される。
   - **Actions → Deploy GitHub Pages → Run workflow** から手動実行もできる。
5. workflow の `Deploy to GitHub Pages` が完了すると、deployment の URL から利用できる。

## ローカル確認

単純な静的ファイルなので `index.html` を直接開ける。

HTTP 経由で確認したい場合は、リポジトリ直下で `http-server` を起動する。

例:

```sh
npx http-server .
```

表示されたURL（通常は `http://127.0.0.1:8080/`）を開く。

## 生成結果の配置先

生成される協働ルールは、特定リポジトリの設定ではなく、ユーザー個人に適用するグローバルルールとして使う想定である。
リポジトリ内の設定ファイルとは異なり、複数のワークスペースに適用される。
ダウンロードしたファイルは、利用するツールに応じて次の場所へ配置する。

| ツール | ユーザー共通の配置先 | 配置方法 |
| --- | --- | --- |
| GitHub Copilot（VS Code / Agent Host） | `%USERPROFILE%\.copilot\instructions\agentfit.instructions.md` | GitHub Copilot向けのダウンロードファイルをそのまま配置。`applyTo: "**"` の front matter は自動付与 |
| Codex | `%USERPROFILE%\.codex\AGENTS.md` | Kiro / Codex向けのダウンロードファイルをそのまま配置 |
| Kiro | `%USERPROFILE%\.kiro\steering\AGENTS.md` | Kiro / Codex向けのダウンロードファイルをそのまま配置 |

この案内は、2026年9月時点の公式ドキュメントに基づく。GitHub Copilotのリポジトリ固有設定である `.github/copilot-instructions.md` は、今回のグローバルルール用途には使わない。

- [VS Code: Use custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Codex: Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Kiro: Steering](https://kiro.dev/docs/steering/)

## デプロイ方式

GitHub Pages 公式 Actions を利用する。

- `actions/checkout@v7`
- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`

公開対象は workflow 内で `_site/` にコピーした以下の4ファイルだけである。

```text
index.html
styles.css
app.js
.nojekyll
```

README や workflow 定義そのものは Pages へ公開しない。

## 開発方針

- HTML / CSS / JavaScript は分離する。
- 外部依存を持たない。
- 質問への回答を SSoT とする。
- 回答 → state → Rule → Markdown の決定論的生成を維持する。
- 同じ回答からは常に同じ生成結果を得る。
