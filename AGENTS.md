# Instructions for AI agents

Website for **Ronneby Boxing Team** (Ronneby, Sweden), live at https://ronnebybk.github.io/ronneby-bk/.
Repo `ronnebybk/ronneby-bk`. **Public repo; pushing to `main` deploys the live site.**
Goal: the simplest possible setup: no server, database or accounts. Prefer small, readable changes
over new services or dependencies. Details: README.md, HOWTO.md, SECURITY.md, LIMITATIONS.md.

## Architecture

- Vue 3 + Vite app on GitHub Pages. Content lives in a **Google Sheet** (one tab per content type),
  fetched as published CSV on every visit; `localStorage` cache covers outages. IDs in `src/config.js`.
  Tab columns: see `sheet-template/` and `src/data/demo.js`.
- Editors have no accounts: the hidden `/#/admin?k=<edit-id>` page embeds the sheet. The edit ID is
  stored in `localStorage`, stripped from the URL, and is a **secret**.
- Parsing is forgiving (`src/data/parse.js`): bad rows are skipped. Tabs are matched by exact name
  (season, group, coach); current season is chosen by date.
- `publishedId: ''` runs the site on example data (`src/data/demo.js`).

## Conventions

- Hash routing (`/#/schema`); `base: './'`.
- Swedish default, English alternative: update both `src/i18n/sv.js` and `en.js`. Sheet English comes
  from *(EN)* columns via `localized()`. Language toggle uses the **British** flag, not the US.
- Plain CSS, variables in `src/style.css`, light/dark by system setting. Use `--red-strong` for buttons
  with white text and `--red-on-ink` for red on the dark header (WCAG AA). Must work at 390 px.
- Privacy: self-hosted fonts; Facebook/Instagram/Behold load only after a click (`src/data/consent.js`);
  maps are links, not embeds.
- Sparse comments that explain *why*.
- Commands: `npm run dev`, `npm test`, `npm run build && npm run preview`. Maintainer uses Windows and Debian.
- Backlog: GitHub issues; **#23 is the roadmap** (order and acceptance criteria).

## Don't read whole

Logo SVGs (`src/assets/logo.svg`, `design/*.svg`), `design/logo-2400.png`, `package-lock.json`,
`sheet-template/*.xlsx`. For `HOWTO.md` and `docs/editor-help.md`, grep for the heading you need.

## Never commit (or post in issues/PRs/comments)

- The sheet **edit ID** or admin link. Only the published `2PACX-…` ID belongs in code.
- Credentials, `.env*`, personal data (GDPR; coach contacts go only in the sheet, with consent).
- Original files from the club (PDF/Word/photos may carry metadata); commit only clean exports.
- Screenshots, scratch/test files, local test edits to `src/config.js`.

## Before committing, check

- Stage files by name and read `git diff --cached`; every staged file must belong to the task.
- `src/config.js`: real `publishedId` and `gids` intact; read its diff line by line.
- `package-lock.json`: commit only with an intended `package.json` change; if it changed from an OS
  switch, `git restore` it (keep the file: deploy uses `npm ci`).
- Line-ending-only changes: `git diff --cached --ignore-all-space --stat`; unstage them.
- `public/coaches/`: lowercase image names, consented coaches only (fallback; normally Drive links).

## Deploying

Work on a branch, test with build + preview. Push to `main` only with the maintainer's explicit OK,
never force-push it, and afterwards check the deploy with `gh run list`.
