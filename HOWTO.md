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

Schedule, classes, prices, coaches and seasons live in the Google Sheet. Changing them never needs a
code change or a deploy. See also [SECURITY.md](SECURITY.md) and [LIMITATIONS.md](LIMITATIONS.md).

---

## 1. För redigerare

**Öppna:** använd admin-länken du fått (första gången) eller gå till
**ronnebybk.github.io/ronneby-bk/#/admin**. Tips: lägg till sidan på hemskärmen i mobilen.
Fungerar inte redigeringen i sidan? Tryck på **Öppna i Google Sheets**.

**Flikar:** Schema · Grupper & priser · Tränare · Säsonger.

| Vill du… | Gör så här |
| --- | --- |
| Lägga till ett pass | Fyll i en tom rad i **Schema**: säsong, dag, start, slut, grupp, tränare. Notering är valfri. |
| Ändra en tid | Skriv över tiden. Format `17:30` (kolon, inte komma). |
| Ta bort ett pass | Markera raden → högerklicka → *Ta bort rad*. |
| Byta tränare på ett pass | Välj en annan i rullistan i kolumnen Tränare. |
| Ändra pris | Fliken **Grupper**, kolumnen *Pris (kr)*. Bara siffror. `0` visas som "Gratis". |
| Lägga in sommarschema | 1) **Säsonger**: ny rad med namn, start- och slutdatum (`ÅÅÅÅ-MM-DD`). 2) **Schema**: lägg in passen med den säsongen. Hemsidan byter själv när datumet kommer. |
| Lägga till en tränare | Ny rad i **Tränare**. Bild läggs in av webbansvarig. |

**Viktigt**

- Allt sparas automatiskt. Ändringen syns på hemsidan inom **ca 5 minuter**.
- **Ändra aldrig rubrikerna** på första raden.
- **Byter du namn** på en grupp, tränare eller säsong måste du ändra samma namn i fliken Schema också,
  annars försvinner passen från hemsidan.
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

### Where things are

| Change | Where |
| --- | --- |
| Schedule, classes, prices, coaches, seasons | The Google Sheet (no code) |
| Club address, email, phone | `contact` in `src/config.js` |
| Facebook / Instagram | `social` in `src/config.js` |
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
and put the feed ID in `social.beholdFeedId`. Without it the site only links to the profile.

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

### Back up the sheet

Every month or so, and before big changes: **File → Download → Microsoft Excel (.xlsx)**, stored with
the board. Version history also exists inside Google, but not if the account itself is lost.

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
| Banner "Kunde inte hämta senaste schemat…" | Google couldn't be reached. The visitor sees their last saved copy. Check that the sheet is still published (*File → Share → Publish to web*). |
| Banner "Exempeldata visas…" | `publishedId` in `src/config.js` is empty. |
| Admin page blank | Browser blocks the embedded sheet (common on iPhone/Safari). Use **Öppna i Google Sheets**. |
| Admin says "Ingen åtkomst" | That browser has never opened the admin link. Open the full link once. |
| Deploy failed | See the **Actions** tab. Usually a build error, or an outdated action version. |

---

## 4. Initial setup

Already done. Kept for reference and in case the sheet ever has to be rebuilt.

### 4.1 Create the sheet

Use the club's Google account, not a personal one. The board keeps the login details.

1. Google Drive → **New → File upload** → `sheet-template/ronneby-boxing-team-mall.xlsx`.
2. Open it → **File → Save as Google Sheets**. Use the new Sheet and delete the `.xlsx`.
3. Check the dropdowns in *Schema* (Dag, Säsong, Grupp, Tränare) and *Grupper* (Prisperiod). If one is
   missing: select the column → **Data → Data validation → Dropdown (from a range)**, e.g. `Grupper!A2:A50`.
4. In each validation rule, set **If the data is invalid → Reject the input**.
5. Protect the header rows: **Data → Protect sheets and ranges** → `Schema!1:1` → **Only you**.
   Repeat for `Grupper!1:1`, `Tränare!1:1`, `Säsonger!1:1`.
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
