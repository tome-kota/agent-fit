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

HTTP 経由で確認したい場合は、任意の静的HTTPサーバーをリポジトリ直下で起動する。

例:

```sh
python -m http.server 8000
```

その後 `http://localhost:8000/` を開く。

## デプロイ方式

GitHub Pages 公式 Actions を利用する。

- `actions/checkout@v6`
- `actions/configure-pages@v5`
- `actions/upload-pages-artifact@v4`
- `actions/deploy-pages@v4`

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
