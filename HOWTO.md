# How to

1. [Editors: help with the sheet](docs/editor-help.md)
2. [Maintainers: common tasks](#2-maintainers-common-tasks)
3. [Troubleshooting](#3-troubleshooting)
4. [Initial setup (already done; for reference or for rebuilding)](#4-initial-setup)

How it fits together:

```
Visitors → website on GitHub Pages → reads the published Google Sheet (CSV) on every visit
Editors  → /#/admin on the website → the same Google Sheet, embedded
```

Schedule, classes, prices, coaches, seasons, notices, news, contact details, social links, the FAQ,
competition results and the text of the *Prova på* page live in the Google Sheet. Changing them never
needs a code change or a deploy. See also [SECURITY.md](SECURITY.md) and [LIMITATIONS.md](LIMITATIONS.md).

---

## 1. För redigerare

Alla redigeringsanvisningar finns i [docs/editor-help.md](docs/editor-help.md). Samma
texter visas också i hjälpdialogen på admin-sidan (knappen **Hjälp**).

---

## 2. Maintainers: common tasks

### Develop locally

Needs Git and Node.js 22+.

```sh
git clone https://github.com/ronnebybk/ronneby-bk.git
cd ronneby-bk
npm install
npm run dev       # http://localhost:5173, reads the real sheet
npm run build     # production build in dist/
```

### Deploy

Push to `main`. GitHub Actions builds and publishes to https://ronnebybk.github.io/ronneby-bk/ in about a minute.
Follow progress under the repo's **Actions** tab.

### Dependabot pull requests

Once a month, Dependabot may open one pull request that updates the GitHub Actions in
`.github/workflows/` (e.g. *Bump the actions group…*). It never touches the site's code or npm packages.

- **Merging deploys the site**, like any push to `main`. Afterwards, check that the *Deploy to GitHub Pages*
  run is green.
- If the deploy fails, the live site stays on the previous version and the sheet content still updates.
  Revert the merge (**Revert** button on the merged pull request) and ask a developer.
- Ignoring the pull request is safe. Old action versions keep working until GitHub deprecates them,
  which shows up as warnings in the Actions runs months in advance.
- After merging, bring the change into any long-lived branch (e.g. `git merge main` on
  `feature/high-effort-roadmap`).

### Where things are

| Change | Where |
| --- | --- |
| Schedule, classes, prices, coaches, seasons, notices, news | The Google Sheet (no code) |
| Club address, email, phone, "how to join" text, Facebook / Instagram | The *Klubbinfo* tab in the sheet (no code) |
| The text of the *Prova på* page | The *Prova på* tab in the sheet (no code) |
| FAQ questions and answers | The *Frågor* tab in the sheet (no code) |
| Official documents (rules, statutes, minutes) | The *Dokument* tab in the sheet; the PDFs in the club's Drive folder (no code) |
| Competition results | The *Resultat* tab in the sheet (no code) |
| Interface texts | `src/i18n/sv.js` and `src/i18n/en.js` (keep both in sync) |
| Privacy policy text | `src/views/PrivacyView.vue` |
| Colours, fonts | `src/style.css` (variables at the top) |
| Logo and icons | `src/assets/logo.svg` (site), `public/*.png` (icons). Sources in `design/`: `logo.svg` (with background), `logo-transparent.svg`, `logo-2400.png` (print/sharing) |

### Add a coach photo

Editors do this themselves via Google Drive (see [*Bilder*](docs/editor-help.md#bilder) in the editor
help). The steps below are the developer fallback when a file must live in the repo:

1. Get the coach's OK to publish it.
2. Resize to about 800 px wide JPG and put it in `public/coaches/`, e.g. `anna.jpg` (filename without
   spaces). Push.
3. Write `anna.jpg` in the *Bild* column of the coach's row in the sheet.

Without a photo, the card shows the coach's initials.

One-time setup: create the club's image folder on Drive and share the **folder** itself as *Anyone with the
link → Viewer*. New uploads then inherit the sharing, so editors can skip step 2 in the editor guide.

### Instagram feed and Facebook Page

Editors can set these up themselves; see
[Visa Facebook och Instagram på hemsidan](docs/editor-help.md#visa-facebook-och-instagram-på-hemsidan) (Swedish). In short: a
Facebook *Page* shows a feed, a group only a join button; Instagram needs the account name, plus a
[Behold](https://behold.so) feed ID (free, needs a Business/Creator account) for the picture feed. Both feeds
sit in the same square window, so pick a square Behold layout.

### Give someone editor access

Send them the admin link (see [4.4](#44-the-admin-link)) and the editor instructions in
[docs/editor-help.md](docs/editor-help.md).
Never post the admin link in an issue, commit, chat group or anywhere public.

The editor help is also kept as a copy in the club's Drive folder: when `docs/editor-help.md` changes,
update that copy too (editor content only — never the admin link or edit ID).

### Replace a leaked admin link

Do this if the link has leaked, or someone who had it should no longer edit.

1. In the sheet: **Share → General access → Restricted**. The old link stops working immediately.
2. **File → Make a copy**. The copy gets a new edit ID.
3. On the copy, repeat [4.1](#41-create-the-sheet) steps 5–6 and [4.2](#42-publish-it) (protect headers, share, publish).
4. Update `publishedId` and `gids` in `src/config.js`, then push.
5. Send the new admin link to the remaining editors. Delete or archive the old sheet.

### Backups and restore

| What | How it's backed up | Restore |
| --- | --- | --- |
| Sheet content | **Automatic, weekly:** the *Back up Google Sheet* workflow saves the four required tabs plus *Anslag*, *Klubbinfo*, *Prova på*, *Frågor*, *Dokument*, *Evenemang*, *Resultat* and *Sponsorer* when they are configured, as CSV every Monday. Each snapshot is kept for 90 days, outside Google. | See below |
| Sheet content and structure (dropdowns, protection) | **Manual, a few times a year** and before big changes: **File → Download → Microsoft Excel (.xlsx)**, stored with the board | Upload to Drive → *Save as Google Sheets* |
| Recent mistakes or vandalism | Google's **version history** | *File → Version history* → restore |
| The code | Every clone is a full copy. `main` is protected against force-push and deletion. Run `git pull` on your computers regularly. | `git push` from any up-to-date clone |

**Restore from a weekly snapshot:**
1. Repo → **Actions → Back up Google Sheet** → pick a run → download the `sheet-backup-<date>` artifact (zip).
2. In the sheet, open the tab with the same name as the file (e.g. `Schema.csv` → *Schema*),
   then **File → Import → Upload** → choose the file → **Replace current sheet**.
3. Repeat for each tab you need. Dropdowns and header protection are not in the CSV: check them afterwards
   ([4.1](#41-create-the-sheet) steps 3–5).

Run a backup right now: **Actions → Back up Google Sheet → Run workflow**.
Locally: `node scripts/backup-sheet.mjs <folder>`.

> GitHub pauses scheduled workflows in a public repo after **60 days without any commits**, and sends an
> email first. If that happens, re-enable it under **Actions → Back up Google Sheet**.

Snapshots are deliberately **not committed** to the repo: coach contact details must be removable
(GDPR), and Git history is permanent.

### Custom domain (optional)

Register the domain in the club's name, then add it under **Settings → Pages → Custom domain** and
create the DNS records GitHub shows. Then update the two absolute share-preview URLs in `index.html` (`og:url` and `og:image`) to the new domain, and push. Afterwards, send editors the new admin link.

---

## 3. Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| A session doesn't show | The row is skipped because of a typo: season name doesn't match *Säsonger* exactly, unknown day, time like `17,30`, or group missing. |
| A session shows without colour, or isn't listed under its group | Group name in *Schema* doesn't match the name in *Grupper*, usually after a rename. |
| Old season still showing | No season covers today's date. Add the new season in *Säsonger*. |
| Change not visible | Google republishes about every 5 minutes. Wait, then reload. |
| A notice or news item doesn't show | *Visa från* is in the future, *Visa till* has passed, a date is written so it can't be read (use `ÅÅÅÅ-MM-DD`), or *Typ* is something other than empty, *Anslag* or *Nyhet*. |
| A news item shows as a red banner | Its *Typ* is empty or *Anslag*. Set it to *Nyhet*. |
| Contact details or a social link don't show | The *Klubbinfo* row's *Fält* is misspelt, *Värde* is empty, or the value didn't pass the check (Facebook must be a `https://www.facebook.com/…` address, e-mail needs an `@`, phone needs a digit). Or `gids.club` in `src/config.js` is empty. |
| The *Prova på* page shows the built-in text | The *Prova på* tab has no row with a Swedish *Rubrik* or *Text* (an English-only row is skipped), or `gids.trial` in `src/config.js` is empty. |
| A question doesn't show | *Fråga* or *Svar* is empty in that row, or `gids.faq` in `src/config.js` is empty. |
| A result doesn't show | *Datum* can't be read (use `YYYY-MM-DD`), or *Tävling*, *Namn* or *Placering* is empty in that row, or `gids.results` in `src/config.js` is empty. If consent is missing, the row should be deleted. |
| Banner "Kunde inte hämta senaste schemat…" | Google couldn't be reached. The visitor sees their last saved copy. Check that the sheet is still published (*File → Share → Publish to web*). |
| Banner "Exempeldata visas…" | `publishedId` in `src/config.js` is empty. |
| Admin page blank | Browser blocks the embedded sheet (common on iPhone/Safari). Use **Öppna i Google Sheets**. |
| Admin says "Ingen åtkomst" | That browser has never opened the admin link. Open the full link once. |
| Deploy failed | See the **Actions** tab. Usually a build error, or an outdated action version (Dependabot proposes updates, see [Dependabot pull requests](#dependabot-pull-requests)). |

---

## 4. Initial setup

Already done. Kept for reference and in case the sheet ever has to be rebuilt.

### 4.1 Create the sheet

Use the club's Google account, not a personal one. The board keeps the login details.

1. Google Drive → **New → File upload** → `sheet-template/ronneby-boxing-team-mall.xlsx`.
2. Open it → **File → Save as Google Sheets**. Use the new Sheet and delete the `.xlsx`.
3. Check the dropdowns in *Schema* (Dag, Säsong, Tränare) and *Grupper* (Prisperiod). If one is
   missing: select the column → **Data → Data validation → Dropdown (from a range)**, e.g. `Tränare!A2:A50`.
   *Grupp* in *Schema* is plain text on purpose, so a session can list several groups (`Motionsboxning, Nybörjare`).
   Check the date validation in *Anslag* too: select `C2:D1000` → **Data → Data validation → Is valid date**,
   and the *Typ* dropdown: `E2:E1000` → **Dropdown** with the options `Anslag` and `Nyhet`.
   In *Resultat*, check the *Placering* dropdown: `I2:I300` → **Dropdown** with the options `Guld`, `Silver`,
   `Brons`, `Kvartsfinal`, `Deltog`, set to *Show a warning* (not *Reject the input*), so free text still works.
   In *Klubbinfo*, check the *Fält* dropdown: `A2:A50` → **Dropdown** with the options `Lokal`, `Gatuadress`,
   `Ort`, `E-post`, `Telefon`, `Bli medlem`, `Facebook`, `Instagram`, `Behold`, `Affisch märke`,
   `Affisch prova på`. Every one of those eleven
   needs its own row, since editors can't add rows once column A is protected (step 5).
   In *Dokument*, check the date validation on *Datum*: select `G2:G300` → **Data → Data validation → Is valid date**. Also set *Dokument* columns A:F and H to **Format → Number → Plain text**, so a text like `8–12` stays as typed.
   Also check that *Klubbinfo* columns B:C are **Format → Number → Plain text**. Otherwise Sheets turns a phone
   number like `+46 70…` into a number and drops the `+` and leading zeros. Do the same for *Prova på*
   columns A:D, so a text like `8–12` stays as typed.
   In *Resultat*, check the *Junior/Senior* dropdown: `F2:F300` → **Dropdown** with the options `Junior` and
   `Senior`.
   In *Evenemang*, check the *Typ* dropdown: `A2:A300` → **Dropdown** with the options `Tävling`, `Läger`, `Gala`,
   `Övrigt`, set to *Show a warning* (not *Reject the input*), so free text still works. Also check the date
   validation on *Datum*/*Slutdatum*: select `D2:E300` → **Data → Data validation → Is valid date**.
   In *Undantag*, check the date validation on *Datum*: select `A2:A300` → **Data → Data validation → Is valid date**.
4. In each validation rule, set **If the data is invalid → Reject the input**.
5. Protect the header rows: **Data → Protect sheets and ranges** → `Schema!1:1` → **Only you**.
   Repeat for `Grupper!1:1`, `Tränare!1:1`, `Säsonger!1:1`, `Anslag!1:1`, `Undantag!1:1`, `Klubbinfo!1:1`, `Prova på!1:1`, `Frågor!1:1`,
   `Dokument!1:1`, `Evenemang!1:1`, `Resultat!1:1`, `Sponsorer!1:1`.
   Also protect `Klubbinfo!A:A`, so editors can change the values but not rename or delete a setting.
   Use **Restrict who can edit → Only you**, not *Show a warning*. Test it in a private window, since
   the owner's account is never blocked.
6. **Share → General access → Anyone with the link → Editor**.

Do not rename tabs or column headings. Column *order* doesn't matter, names do.

### 4.2 Publish it

1. **File → Share → Publish to web** → *Entire document* → **Publish**. Keep *Automatically republish* checked.
2. The link looks like `https://docs.google.com/spreadsheets/d/e/2PACX-…/pubhtml`. The `2PACX-…` part is the `publishedId`.
3. Each tab's `gid` is the number after `#gid=` in the address bar when that tab is open.

### 4.3 Connect the site

Fill `sheet.publishedId` and `sheet.gids` in `src/config.js` and push. These values only give read
access to already-public data, so they are safe in the public repo.

### 4.4 The admin link

The sheet's **edit ID** is the long part of its normal address, `docs.google.com/spreadsheets/d/<EDIT-ID>/edit`.
It gives **write access**: never commit it or post it anywhere public. Editors get:

```
https://ronnebybk.github.io/ronneby-bk/#/admin?k=<EDIT-ID>
```

The admin page stores the ID on that device and removes it from the address bar.
