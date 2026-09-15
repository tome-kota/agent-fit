# 変更履歴

## v0.10.0 - 2026-09-15

- 生成結果をGitHub Copilot向けとKiro / Codex向けの2種類に分けてダウンロードできるようにした。
- GitHub Copilot向けは `agentfit.instructions.md` として、`applyTo: "**"` の front matterを自動付与する。
- Kiro / Codex向けは従来どおり `AGENTS.md` として出力する。

## v0.9.0 - 2026-09-14

- 問1・問2・問12の選択肢で、AIと回答者の主体を明確に表現。
- 問12の曖昧さ対応ルールで、AIが独断で解釈しないことを明示。
- 回答値、ルールID、Markdownの出力構造は変更なし。