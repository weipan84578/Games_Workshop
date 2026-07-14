---
name: multilingual-commit
description: Create detailed, energetic Git commit messages in English, Japanese, and Chinese, always in that order, with appropriate emojis. Use when preparing, reviewing, or writing commit messages for this project.
---

# Multilingual Commit

Create project commit messages that clearly communicate the change across three languages while keeping the format consistent and lively.

## Required order

Always write the languages in this exact order:

1. English
2. 日本語
3. 中文（繁體）

Do not reorder, omit, or merge the languages. Preserve technical names, file paths, API names, and code identifiers when translating.

## Message requirements

- Analyze the staged diff and relevant project context before writing the message; never invent changes.
- Explain what changed, why it changed, and important implementation details or impact.
- Use a concise subject line plus a detailed body when the change is substantial.
- Keep the tone energetic and positive, adding relevant emojis such as 🚀, ✨, 🐛, 🧪, 🔧, or 📝 without making the message noisy.
- Make each language section semantically equivalent, natural, and useful to a reviewer.
- Follow any project-specific commit convention, issue number, or scope supplied by the user while retaining the three-language order.

## Recommended format

```text
<type>(<scope>): <English summary> <emoji>

English:
- What changed
- Why it changed
- Key implementation details / impact

日本語:
- 変更内容
- 変更理由
- 主な実装詳細 / 影響

中文:
- 變更內容
- 變更原因
- 主要實作細節 / 影響
```

Before committing, verify that all three sections are present, in order, and contain matching details.
