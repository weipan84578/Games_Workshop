---
name: readme-writer
description: Inspect a project's implemented features, source tree, and tests to create or replace its root README.md as a detailed, polished guide. Use when Codex is asked to write, rewrite, update, or document a project's README, especially when it must be multilingual in English, Japanese, then Traditional Chinese, include quick navigation, gameplay and technical explanations, file-organization tables, and friendly icons.
---

# Project README Writer

Create a source-grounded, easy-to-scan README for the repository being documented. Treat the repository root `README.md` as the output file and do not create auxiliary README files inside this skill.

## Workflow

### 1. Inspect the project before writing

- Check `git status --short` and preserve unrelated user changes.
- Use `rg --files` to inventory the project, then inspect the entry point, configuration files, package or run scripts, specifications, source directories, and tests.
- Read an existing root `README.md` if present, but verify its claims against the current implementation. Replace it directly when the request asks for an overwrite.
- Derive startup commands, browser requirements, controls, features, versions, and test commands from files that actually exist. Never invent a command, dependency, feature, asset, URL, badge, or roadmap item.
- Distinguish implemented behavior from design-spec or planned behavior. Describe only implemented behavior as a feature; label confirmed plans as plans when they are worth mentioning.
- Keep file names, identifiers, commands, routes, API names, and code symbols exact even when surrounding prose is translated.

### 2. Design navigation first

- Start with a neutral project title and a short, factual summary.
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

### 4. Format for clarity and charm

- Use Markdown headings, short paragraphs, numbered steps, and compact bullet lists.
- Use tables for controls, supported languages, settings, game objects, scripts, folders, and feature-to-module mappings when a table makes comparison faster.
- Add friendly, purposeful icons such as `☁️`, `🎮`, `✨`, `🕹️`, `🛠️`, `📁`, `💾`, and `🧪` to headings or labels. Keep them consistent and do not let decoration replace meaning or harm screen-reader readability.
- Use fenced code blocks for commands and preserve exact capitalization in paths and code.
- Prefer diagrams made from simple Mermaid or text only when they clarify a real flow and the repository already supports rendering them; otherwise use a short ordered flow.
- Keep tables readable on narrow screens: avoid huge prose cells and split a table when one becomes unwieldy.
- Translate all explanatory prose completely. Use Japanese for the Japanese section and Taiwan Traditional Chinese (`zh-TW`) for the Chinese section; do not leave an accidental fourth language or mixed-language paragraphs.
- Keep terminology consistent across the three sections. Translate the prose, not the code vocabulary.

## Required README shape

Use this outline as a default, adapting labels to the project while retaining the required order:

```markdown
# <project title>

<neutral one-line summary>

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
```

The title, language jump bar, and contents may be neutral framing. Begin the first full explanatory section in English, and ensure no Japanese or Chinese explanatory section appears before it.

## Repository-specific accuracy rules

- Treat `DOODLE_JUMP_GAME_SPEC.md` or a similar specification as a useful requirements map, not proof that every requirement is implemented.
- For this game project, inspect `index.html`, `css/`, `js/`, and `tests/` and explain their actual roles. Group JavaScript by responsibility such as core, game, rendering, input, audio, data, internationalization, and UI when those folders exist.
- Mention the actual supported locales, themes, input methods, storage behavior, and test runner only after confirming them in source or tests.
- Explain browser execution and offline behavior only when the entry point and code support that claim. Do not add package-manager instructions if there is no package manifest or script.
- Prefer representative file tables over listing every file. Include enough examples for a new contributor to find the relevant code quickly.

## Replace and validate

1. Replace the repository-root `README.md` directly if it exists, as requested; do not retain the old document as a second README.
2. Review the diff and confirm that only the intended README was changed. Do not modify source code, tests, or configuration while documenting.
3. Check that English precedes Japanese and Japanese precedes Traditional Chinese, all required topics are present in every language, code paths are real, and internal links point to existing headings or anchors.
4. Run only lightweight documentation checks unless the user asks for broader validation. If a documentation or test command is unavailable, report that plainly.
5. Report the resulting README path and summarize any facts that could not be verified.
