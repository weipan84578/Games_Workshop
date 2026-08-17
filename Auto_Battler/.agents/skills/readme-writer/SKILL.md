---
name: readme-writer
description: Inspect a project's implemented features, source tree, and tests to create or replace its root README.md as a detailed, polished, visually rich guide. Use when Codex is asked to write, rewrite, update, or document a project's README, especially when it must include complete English, Japanese, then Traditional Chinese coverage, separate opening and closing language paragraphs, quick navigation, many purposeful emojis, diagrams or other visual structure, gameplay and technical explanations, file-organization tables, and a final back-to-top link.
---

# Project README Writer

Create a source-grounded, easy-to-scan README for the repository being documented. Treat the repository root `README.md` as the output file and do not create auxiliary README files inside this skill.

## Workflow

### 1. Inspect the project before writing

- Check `git status --short` and preserve unrelated user changes.
- Use `rg --files` to inventory the project, then inspect the entry point, configuration files, package or run scripts, specifications, source directories, and tests.
- Read an existing root `README.md` if present, but verify its claims against the current implementation. Replace it directly when the request asks for an overwrite.
- Derive startup commands, browser requirements, controls, features, versions, and test commands from files that actually exist. Never invent a command, dependency, feature, asset, URL, badge, metric, or roadmap item.
- Distinguish implemented behavior from design-spec or planned behavior. Describe only implemented behavior as a feature; label confirmed plans as plans when they are worth mentioning.
- Keep file names, identifiers, commands, routes, API names, and code symbols exact even when surrounding prose is translated.

### 2. Design navigation first

- Add a stable top anchor such as `<a id="top"></a>` near the very beginning of the README.
- Start with a neutral project title, a short factual summary, and a clearly separated opening block containing one English paragraph, one Japanese paragraph, and one Taiwan Traditional Chinese paragraph in that order. Keep a blank line between every language block; never squeeze the three languages into one line, one table cell, or a slash-separated sentence.
- Add a language jump bar and a table of contents before the detailed sections. Make it possible to jump directly to each language and each important topic.
- Use unique, stable anchors for the three language sections. Add explicit HTML anchors when repeated translated headings could produce ambiguous Markdown links.
- Keep the complete English section first, the complete Japanese section second, and the complete Traditional Chinese section third. Do not interleave paragraph-by-paragraph translations.
- Make the table of contents mirror the final heading hierarchy and test every internal link by checking its target heading or explicit anchor.

### 3. Build the same information architecture in all languages

Include the following topics in each language section, in the same order unless the project clearly needs a better sequence:

1. Game or product introduction: identity, premise, intended experience, and a concise feature overview.
2. Gameplay or usage guide: objective, core loop, win or loss conditions, controls, interactions, progression, scoring, difficulty, pause or resume behavior, saving, and other user-facing rules that are implemented.
3. Quick start: prerequisites and exact launch steps, including a local server only when the project requires or supports one.
4. Program introduction: architecture, runtime model, major technologies, entry points, and important data flow.
5. Code classification: a clean table mapping real folders and representative files to their responsibilities. Cover the meaningful categories rather than dumping an unhelpful file list.
6. Supporting systems: localization, persistence, audio, accessibility, responsive behavior, performance, or security when they exist in the codebase.
7. Testing: actual test locations and verified commands or browser procedures. State what was inspected or run; do not claim tests passed unless they were run.
8. Project status, limitations, or contribution notes only when supported by repository evidence.

For a game, make the gameplay section especially concrete. Explain the playable character, automatic or manual movement, physics or collision behavior, platform or level types, collectible items, hazards or enemies, camera or scrolling, score and combo rules, difficulty progression, and the game-over flow when those details are implemented.

### 4. Format for clarity, visual polish, and charm

- Use Markdown headings, short paragraphs, numbered steps, and compact bullet lists. Leave blank lines between major blocks so the document never becomes a dense wall of text.
- Use tables for controls, supported languages, settings, game objects, scripts, folders, and feature-to-module mappings when a table makes comparison faster.
- Use a generous, consistent set of purposeful emoji and icons throughout the README. Put relevant icons in major headings, language labels, tables, callouts, and navigation; for a normal project README, aim for roughly 10–20 meaningful emoji or icons, adding more when the document is long. Keep them readable rather than random.
- Add visual structure wherever it improves comprehension: Mermaid flowcharts for gameplay or data flow, Mermaid or text trees for architecture and file organization, comparison tables, callout blocks, `<details>` sections for advanced material, and real screenshots or repository assets when they exist.
- Use diagrams and tables to explain real relationships, not as decoration. Do not fabricate screenshots, diagrams, badges, metrics, or visual claims. Use relative links for real images and verify that every referenced asset exists.
- Use fenced code blocks for commands and preserve exact capitalization in paths and code.
- Keep tables readable on narrow screens: avoid huge prose cells, split a table when one becomes unwieldy, and do not hide required language content in a table cell.
- Translate all explanatory prose completely. Use Japanese for the Japanese section and Taiwan Traditional Chinese (`zh-TW`) for the Chinese section; do not leave an accidental fourth language or mixed-language paragraphs.
- Keep terminology consistent across the three sections. Translate the prose, not the code vocabulary.

### 5. Enforce language completeness and a polished ending

- Give the README three separate language blocks at the end as well as at the beginning: one English closing paragraph, one Japanese closing paragraph, and one Taiwan Traditional Chinese closing paragraph, in that order, with blank lines between them.
- Make the final non-whitespace line exactly a clear back-to-top link such as `[⬆️ Back to top](#top)`. Do not put a heading, note, badge, separator, or another language after that link.
- Perform a language-parity pass before finishing. For every English heading, table, feature, gameplay rule, code category, test note, limitation, opening paragraph, and closing paragraph, confirm that a Japanese and a Traditional Chinese counterpart exists and contains the same facts.
- Never use `same as above`, `同上`, empty translation placeholders, or a translated heading with missing body content. If a topic truly does not apply, state that explicitly in all three languages rather than omitting one language.
- Keep each language paragraph visually separate. Do not combine English, Japanese, and Chinese in the same paragraph, table row, code block, or bullet unless the item is an exact code identifier or command.

## Required README shape

Use this outline as a default, adapting labels to the project while retaining the required order and visual separation:

```markdown
<a id="top"></a>

# <project title>

<neutral one-line summary>

## 👋 Opening Summary

### 🇬🇧 English
<one standalone English opening paragraph>

### 🇯🇵 日本語
<one standalone Japanese opening paragraph>

### 🇹🇼 繁體中文
<one standalone Taiwan Traditional Chinese opening paragraph>

[English](#english) · [日本語](#japanese) · [繁體中文](#traditional-chinese)

## 📚 Contents
<links to language sections and their key subsections>

<explicit anchor for English>
## 🇬🇧 English
### 🎮 Game Introduction
### ✨ Features
### 🕹️ Gameplay / Usage
### 🚀 Quick Start
### 🛠️ Program Overview
### 📁 Code Organization
### 💾 Supporting Systems
### 🧪 Testing
### 📌 Status / Limitations

<explicit anchor for Japanese>
## 🇯🇵 日本語
<the same complete topics in Japanese>

<explicit anchor for Traditional Chinese>
## 🇹🇼 繁體中文
<the same complete topics in Traditional Chinese>

## 🌟 Closing Summary

### 🇬🇧 English
<one standalone English closing paragraph>

### 🇯🇵 日本語
<one standalone Japanese closing paragraph>

### 🇹🇼 繁體中文
<one standalone Taiwan Traditional Chinese closing paragraph>

[⬆️ Back to top](#top)
```

The title, language jump bar, and contents may be neutral framing. The first complete explanatory section must be English, followed by the complete Japanese section and then the complete Traditional Chinese section. The opening and closing summary blocks must each contain three visibly separated language paragraphs. Replace every placeholder in the outline with real, verified content before saving the README.

## Repository-specific accuracy rules

- Treat `DOODLE_JUMP_GAME_SPEC.md` or a similar specification as a useful requirements map, not proof that every requirement is implemented.
- For this game project, inspect `index.html`, `css/`, `js/`, and `tests/` and explain their actual roles. Group JavaScript by responsibility such as core, game, rendering, input, audio, data, internationalization, and UI when those folders exist.
- Mention the actual supported locales, themes, input methods, storage behavior, and test runner only after confirming them in source or tests.
- Explain browser execution and offline behavior only when the entry point and code support that claim. Do not add package-manager instructions if there is no package manifest or script.
- Prefer representative file tables over listing every file. Include enough examples for a new contributor to find the relevant code quickly.

## Replace and validate

1. Replace the repository-root `README.md` directly if it exists, as requested; do not retain the old document as a second README.
2. Review the diff and confirm that only the intended README was changed. Do not modify source code, tests, or configuration while documenting.
3. Check that the opening block has three separate language paragraphs, English precedes Japanese and Japanese precedes Traditional Chinese in every block, all required topics are present in every language, code paths are real, visual elements are source-grounded, and internal links point to existing headings or anchors.
4. Confirm that the closing block has three separate language paragraphs and that `[⬆️ Back to top](#top)` is the final non-whitespace line.
5. Run only lightweight documentation checks unless the user asks for broader validation. If a documentation or test command is unavailable, report that plainly.
6. Report the resulting README path and summarize any facts that could not be verified.
