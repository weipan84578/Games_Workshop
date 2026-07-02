# Lessons

## 2026-07-02 commit_message_encoding

- Failure mode: A multilingual commit message written through PowerShell stdin to `git commit -F -` corrupted Japanese and Traditional Chinese text into question marks.
- Detection signal: `git show -s --format=%B HEAD` showed the English section correctly, but the Japanese and Traditional Chinese sections appeared as `???`.
- Prevention rule: For multilingual commit messages, write the message to a UTF-8 file first and commit with `git commit -F <file>`, then verify the stored message with `git show -s --format=%B HEAD`.
- Tripwire: Before considering a multilingual commit done, grep or visually inspect the latest commit body for the required section headers: `English:`, `日本語:`, and `繁體中文:`.
