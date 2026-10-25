# Instructions for AI agents

Rules for any AI coding agent working in this repo. The repository is **public** and **pushing to
`main` deploys the live website** (GitHub Actions → GitHub Pages). See README.md for the overview and
HOWTO.md, SECURITY.md and LIMITATIONS.md for details.

## Before every commit

1. Run `git status` and `git diff --cached`, and read what is actually staged.
2. Stage files **by name**. Avoid `git add -A` / `git add .` unless the status output has been checked
   and every file belongs in the commit.
3. Every staged file must belong to the task. Unstage anything else.

## Never commit

| What | Why |
| --- | --- |
| The Google Sheet **edit ID** or admin link (`docs.google.com/spreadsheets/d/<ID>/edit`, `#/admin?k=…`) | Gives anyone edit access to all site content. Only the published `2PACX-…` ID belongs in the code. |
| Passwords, tokens, API keys, `.env*` files, recovery codes | Public repo. Anything committed stays in Git history. |
| Personal data: member lists, private phone numbers or emails, ID numbers | GDPR. Coach contact details only go in the sheet, with consent. |
| `node_modules/`, `dist/` | Generated. Already in `.gitignore`. |
| Source files received from the club (PDFs, Word files, original photos) | May contain personal metadata (e.g. the logo PDF has the author's name). Commit only exported, metadata-free versions (SVG/PNG/JPG). |
| Screenshots, scratch scripts, temporary or test files | Not part of the site. |
| Local test changes in `src/config.js` (e.g. `publishedId: ''` to use example data) | Would disconnect the live site from the sheet. |

## `package-lock.json`

- It **must stay in the repo**: the deploy runs `npm ci`, which requires it.
- Commit changes to it **only together with an intended change in `package.json`** (adding, removing or
  updating a dependency).
- If it changed only because `npm install` ran on another OS (Windows ↔ Debian), discard it:
  `git restore package-lock.json`.

## Other files to check carefully

- **`src/config.js`:** must keep the real `publishedId` and `gids`. Read its diff line by line.
- **Line endings:** do not commit files whose only change is CRLF ↔ LF. Check with
  `git diff --cached --ignore-all-space --stat`; if a file shows no real change, unstage it.
- **`public/coaches/`:** image files only, lowercase names (GitHub Pages is case-sensitive), and only for
  coaches who have consented.

## Pushing and deploying

- **Do not push to `main` without the maintainer's explicit OK.** A push deploys immediately.
- Work on a branch (e.g. `issue-15-admin-warnings`). Test with `npm run build && npm run preview` before
  asking to merge. Pushing a feature branch is safe: only `main` deploys.
- Never force-push `main` or rewrite its history.
- After a push to `main`, check that the deploy succeeded (`gh run list`, or the Actions tab).

## GitHub issues and comments

The same rules apply: no edit ID, admin link, credentials or personal data in issues, comments or PR
descriptions. They are public, and edit history keeps old versions.
