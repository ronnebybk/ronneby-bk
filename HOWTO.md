# How to

1. [Editors: changing the schedule (in Swedish)](#1-för-redigerare)
2. [Maintainers: common tasks](#2-maintainers-common-tasks)
3. [Troubleshooting](#3-troubleshooting)
4. [Initial setup (already done; for reference or for rebuilding)](#4-initial-setup)

How it fits together:

```
Visitors → website on GitHub Pages → reads the published Google Sheet (CSV) on every visit
Editors  → /#/admin on the website → the same Google Sheet, embedded
```

Schedule, classes, prices, coaches, seasons, notices, news, contact details and social links live in the
Google Sheet. Changing them never
needs a code change or a deploy. See also [SECURITY.md](SECURITY.md) and [LIMITATIONS.md](LIMITATIONS.md).

---

## 1. För redigerare

**Öppna:** använd admin-länken du fått (första gången) eller gå till
**ronnebybk.github.io/ronneby-bk/#/admin**. Tips: lägg till sidan på hemskärmen i mobilen.
Fungerar inte redigeringen i sidan? Tryck på **Öppna i Google Sheets**.

**Flikar:** Schema · Grupper & priser · Tränare · Säsonger · Anslag · Klubbinfo.

| Vill du… | Gör så här |
| --- | --- |
| Lägga till ett pass | Fyll i en tom rad i **Schema**: säsong, dag, start, slut, grupp, tränare. Notering är valfri. |
| Ändra en tid | Skriv över tiden. Format `17:30` (kolon, inte komma). |
| Ta bort ett pass | Markera raden → högerklicka → *Ta bort rad*. |
| Byta tränare på ett pass | Välj en annan i rullistan i kolumnen Tränare. |
| Ändra pris | Fliken **Grupper**, kolumnen *Pris (kr)*. Bara siffror. `0` visas som "Gratis". |
| Lägga in sommarschema | 1) **Säsonger**: ny rad med namn, start- och slutdatum (`ÅÅÅÅ-MM-DD`). 2) **Schema**: lägg in passen med den säsongen. Hemsidan byter själv när datumet kommer. |
| Lägga till en tränare | Ny rad i **Tränare**. Bild läggs in av webbansvarig. |
| Lägga upp ett anslag | Ny rad i **Anslag**: skriv meddelandet (och gärna en engelsk text), fyll i *Visa från* och *Visa till* som `ÅÅÅÅ-MM-DD` eller lämna dem tomma. Anslaget syns högst upp på startsidan inom ca 5 minuter. Ta bort raden när det inte längre gäller. |
| Lägga upp en nyhet | Ny rad i **Anslag** med *Typ* = **Nyhet**: skriv en *Rubrik* och/eller ett meddelande (och gärna engelska texter). *Visa från* blir nyhetens datum. Fyll i *Visa till* så försvinner nyheten av sig själv. Nyheter syns under "Nyheter" på startsidan, nyaste först. |
| Ändra adress, e-post, telefon eller "Bli medlem" | Fliken **Klubbinfo**: skriv i kolumnen *Värde* på rätt rad (*Lokal*, *Gatuadress*, *Ort*, *E-post*, *Telefon*, *Bli medlem*). *Värde (EN)* är valfri engelsk text, t.ex. för *Bli medlem*. En länk i *Bli medlem* blir klickbar. |
| Ändra Facebook eller Instagram | Fliken **Klubbinfo**: *Facebook* = hela adressen (`https://www.facebook.com/…`), *Instagram* = kontonamnet eller länken till profilen. |

**Viktigt**

- Allt sparas automatiskt. Ändringen syns på hemsidan inom **ca 5 minuter**.
- **Ändra aldrig rubrikerna** på första raden.
- **Byter du namn** på en grupp, tränare eller säsong måste du ändra samma namn i fliken Schema också,
  annars försvinner passen från hemsidan.
- **Ett anslag** syns bara på startsidan, och bara under perioden *Visa från*–*Visa till* (båda dagarna
  räknas med). Ett datum som inte går att läsa, t.ex. `nästa vecka`, gör att raden hoppas över.
- Fyll i **Visa till** för tillfälliga meddelanden (t.ex. inställd träning). Då försvinner anslaget av
  sig självt, och samma text kan användas igen senare.
- **Anslag eller nyhet?** Brådskande saker (inställd träning) är *Anslag* och syns som röd banderoll.
  Mindre brådskande saker (ny grupp, tävlingsresultat) är *Nyhet*. Tom *Typ* räknas som *Anslag*.
  *Rubrik* används bara för nyheter.
- **Klubbinfo:** en rad per uppgift. Lämnar du *Värde* tomt visas "Uppgifter kommer snart" (för *Bli medlem*
  visas en standardtext). En Facebook-adress som inte börjar med `https://www.facebook.com/` eller en e-post
  utan `@` visas inte alls.
- **Ett pass som inte syns** har nästan alltid ett stavfel: fel säsongsnamn, fel dag, eller tid skriven som `17,30`.
- Lägg **aldrig** in privata uppgifter (medlemslistor, personnummer, betalningar). Allt i kalkylarket är offentligt.
- Lägg in nästa säsong **innan** den nuvarande tar slut.
- Blev något fel? Säg till webbansvarig. Alla tidigare versioner finns sparade (*Arkiv → Versionshistorik*).

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
| Interface texts | `src/i18n/sv.js` and `src/i18n/en.js` (keep both in sync) |
| Privacy policy text | `src/views/PrivacyView.vue` |
| Colours, fonts | `src/style.css` (variables at the top) |
| Logo and icons | `src/assets/logo.svg` (site), `public/*.png` (icons). Sources in `design/`: `logo.svg` (with background), `logo-transparent.svg`, `logo-2400.png` (print/sharing) |

### Add a coach photo

1. Get the coach's OK to publish it.
2. Resize to about 800 px wide JPG and put it in `public/coaches/`, e.g. `anna.jpg`. Push.
3. Write `anna.jpg` in the *Bild* column of the coach's row in the sheet.

Without a photo, the card shows the coach's initials.

### Instagram feed

Connect the club's Instagram at [behold.so](https://behold.so) (free plan, needs a Business/Creator account)
and put the feed ID in the *Behold* row of the *Klubbinfo* tab. Without it the site only links to the profile.

### Give someone editor access

Send them the admin link (see [4.4](#44-the-admin-link)) and the editor instructions in section 1.
Never post the admin link in an issue, commit, chat group or anywhere public.

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
| Sheet content | **Automatic, weekly:** the *Back up Google Sheet* workflow saves the four required tabs plus *Anslag* and *Klubbinfo* when they are configured, as CSV every Monday. Each snapshot is kept for 90 days, outside Google. | See below |
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
create the DNS records GitHub shows. No code changes are needed. Afterwards, send editors the new admin link.

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
3. Check the dropdowns in *Schema* (Dag, Säsong, Grupp, Tränare) and *Grupper* (Prisperiod). If one is
   missing: select the column → **Data → Data validation → Dropdown (from a range)**, e.g. `Grupper!A2:A50`.
   Check the date validation in *Anslag* too: select `C2:D1000` → **Data → Data validation → Is valid date**,
   and the *Typ* dropdown: `E2:E1000` → **Dropdown** with the options `Anslag` and `Nyhet`.
   In *Klubbinfo*, check the *Fält* dropdown: `A2:A50` → **Dropdown** with the options `Lokal`, `Gatuadress`,
   `Ort`, `E-post`, `Telefon`, `Bli medlem`, `Facebook`, `Instagram`, `Behold`.
4. In each validation rule, set **If the data is invalid → Reject the input**.
5. Protect the header rows: **Data → Protect sheets and ranges** → `Schema!1:1` → **Only you**.
   Repeat for `Grupper!1:1`, `Tränare!1:1`, `Säsonger!1:1`, `Anslag!1:1`, `Klubbinfo!1:1`.
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
