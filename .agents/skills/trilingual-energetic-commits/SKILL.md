---
name: trilingual-energetic-commits
description: Create and apply Git commit messages for this repository in a fixed English → Japanese → Traditional Chinese order, with detailed, high-energy wording and many purposeful emojis. Use whenever Codex is asked to draft, create, amend, or revise a commit message or make a commit in this project.
---

# Trilingual Energetic Commits

Apply this skill to every commit in this repository.

## Required language order

Write the complete commit message in this exact order:

1. English
2. 日本語
3. 正體中文（Traditional Chinese）

Keep the English summary and English details first, the Japanese section second, and the Traditional Chinese section last. Do not interleave the languages or place Traditional Chinese before Japanese. Use Taiwan Traditional Chinese characters; do not use Simplified Chinese.

## Message style

- Make every message detailed and informative. Explain what changed, why it changed, the user or project impact, and relevant validation when available.
- Make the tone energetic, optimistic, and action-oriented. Prefer vivid verbs such as `add`, `polish`, `boost`, `refine`, and `unleash` when they accurately describe the change.
- Add many relevant emojis to build atmosphere: use at least four, normally four to eight across the subject and body. Keep them purposeful and readable rather than random.
- Keep all statements truthful. Mention tests, checks, or validation only when they were actually performed.
- Preserve the repository's conventional commit type and scope when they are already in use, while keeping the English subject concise.

## Preferred format

Use this structure unless the user asks for another format:

```text
<type>(<scope>): 🚀 <short English summary> 🎮

English: <detailed change, reason, impact, and validation> ✨
日本語：<変更内容、理由、影響、確認内容> 🔥
正體中文：<變更內容、原因、影響、驗證結果> 🎉
```

Use clear labels so the three sections are easy to scan. Keep the English section first even when the request is made in Chinese or Japanese.

## Commit workflow

1. Inspect `git status` and the diff before composing the message.
2. Draft the message in English, then Japanese, then Traditional Chinese; make each section describe the same change consistently.
3. Stage only the files that belong to the requested change.
4. Create or amend the commit only when the user has requested that Git operation. If the user asks only for a message, provide the message without changing repository state.
5. Verify the resulting commit with `git log -1 --format=%B` and confirm that the language order, detail, emoji atmosphere, and factual claims are correct.
