# Instructions for AI agents

Rules for any AI coding agent working in this repo. The repository is **public** and **pushing to
`main` deploys the live website** (GitHub Actions → GitHub Pages). See README.md for the overview and
HOWTO.md, SECURITY.md and LIMITATIONS.md for details.

## The project

Website for **Ronneby Boxing Team**, a boxing club in Ronneby, Sweden. Live at
https://ronnebybk.github.io/ronneby-bk/. Repo `ronnebybk/ronneby-bk`, branch `main`.

**Goal: the simplest possible setup.** No server, no database, no accounts for editors or visitors.
Prefer small, readable changes over new services or dependencies.

### Architecture

```
Visitors → Vue app on GitHub Pages → fetches the published Google Sheet (CSV) on every visit
Editors  → hidden /#/admin page    → the same Google Sheet, embedded in an iframe
```

- **Content lives in a Google Sheet**, not in the code. It has 9 tabs: *Schema*, *Grupper*, *Tränare*, *Säsonger*, *Anslag*, *Klubbinfo*, *Prova på*, *Frågor*, *Dokument*.
  - *Klubbinfo* holds contact details, venue, the "how to join" text and social links, one row per setting.
  - *Prova på* holds the text for the trial page (`/#/prova-pa`).
  - *Frågor* holds the FAQ: one question and answer per row, shown in row order.
  - *Dokument* holds the club's official documents (rules, statutes, minutes): one row per document, grouped by category on the documents page.
  - The site reads the tabs' published CSV links. The IDs are in `src/config.js` (`sheet.publishedId`, `sheet.gids`).
  - Google republishes about every 5 minutes. A cached copy in `localStorage` covers outages.
- **Editors have no accounts.** The sheet is shared as *Anyone with the link → Editor*.
  - The admin page gets the sheet's edit ID from `#/admin?k=<id>`, stores it in `localStorage` and removes it from the URL.
  - That ID is a secret and must never be in the repo.
- **Parsing is forgiving.** Rows editors type by hand that can't be parsed are skipped instead of breaking the page (`src/data/parse.js`).
  - Matching between tabs is by exact name: season, group and coach.
  - The current season is chosen by date.
- **No sheet configured** (`publishedId: ''`) means the site runs on the example data in `src/data/demo.js`.
  The sheet template (`sheet-template/`) has the same columns.

### Stack and conventions

- **Vue 3 + Vite**, no UI framework.
  - Routing: `vue-router` with **hash history** (`/#/schema`).
  - Vite uses `base: './'`, so the build works at any path or domain.
- **Languages:** Swedish is the default, English is the alternative. The header toggle uses the Swedish and **British** flags, not the US flag.
  - Texts live in `src/i18n/sv.js` and `en.js`. Always update both.
  - English values from the sheet come from the *(EN)* columns, via `localized()`.
- **Styling:** plain CSS with variables in `src/style.css`. Light and dark mode follow the visitor's system setting.
  - Brand colours come from the logo: red `#ED2D30`, black `#1E1D1C`.
  - Use `--red-strong` for buttons with white text, and `--red-on-ink` for red text on the dark header, so contrast meets WCAG AA.
  - The layout must work at 390 px width.
- **Privacy:**
  - Fonts are self-hosted (`@fontsource`).
  - Facebook, Instagram and Behold load only after the visitor clicks (`src/data/consent.js`).
  - Maps are a plain link, not an embed.
  - A Facebook *group* can't be embedded, so it gets a "join" link card instead.
- **Logo:** `src/assets/logo.svg` (transparent vector). Sources are in `design/`.
- Keep comments sparse and explain *why*, not *what*, matching the existing code.

### Commands

```sh
npm install
npm run dev                       # http://localhost:5173 (reads the live sheet)
npm run build && npm run preview  # production build, http://localhost:4173
```

The maintainer develops on both Windows and Debian 13.

### Backlog

All work is tracked in GitHub issues. **#23 is the roadmap**: it sets the order of work and the
acceptance criteria. Use `gh issue list -R ronnebybk/ronneby-bk`.

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
