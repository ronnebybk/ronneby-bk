# Setup guide

How the pieces fit together:

```
Visitors  → website on GitHub Pages → reads the published Google Sheet (CSV) on every page load
Editors   → /#/admin on the website → the same Google Sheet, embedded
```

The schedule, classes, prices, coaches and seasons live in the Google Sheet. Changing them never
requires a code change or a redeploy. Until the sheet is connected, the site shows example data.

---

## 1. Create the Google Sheet (once, ~15 min)

Use the club account **ronnebybk.hemsida@gmail.com**, so the club, not a person, owns the data.

1. Open [Google Drive](https://drive.google.com) → **New → File upload** → choose
   `sheet-template/ronneby-boxing-team-mall.xlsx` from this repo.
2. Open the uploaded file → **File → Save as Google Sheets**. Use the new Google Sheet from now on
   and delete the uploaded `.xlsx` from Drive.
3. Rename the sheet to e.g. *Ronneby Boxing Team – hemsida*.
4. **Check the dropdowns.** Click a cell under *Dag*, *Säsong*, *Grupp* and *Tränare* in the
   *Schema* tab. Each should show a dropdown. If one is missing: select the column from row 2 down →
   **Data → Data validation → Add rule → Dropdown (from a range)** → e.g. `Grupper!A2:A50`.
5. **Protect the header rows**, so nobody can rename the columns the website reads:
   **Data → Protect sheets and ranges → Add a sheet or range** → range `Schema!1:1` →
   **Set permissions → Only you**. Repeat for `Grupper!1:1`, `Tränare!1:1` and `Säsonger!1:1`.
6. **Let editors in without an account:** **Share → General access → Anyone with the link → Editor**.

> Do not rename the tabs or the column headings. Column *order* doesn't matter, names do.

## 2. Publish the sheet for the website

1. **File → Share → Publish to web** → *Entire document* → **Publish**.
   Keep *Automatically republish when changes are made* checked.
2. The link looks like `https://docs.google.com/spreadsheets/d/e/2PACX-1vXXXX…/pubhtml`.
   Copy the part **between `/d/e/` and `/pubhtml`** – that's the `publishedId`.
3. Find each tab's **gid**: click the tab and look at the address bar, which ends in `#gid=123456`.

## 3. Connect the website

Open [`src/config.js`](src/config.js) and fill in:

```js
sheet: {
  publishedId: '2PACX-1vXXXX…',
  gids: { seasons: '…', groups: '…', schedule: '0', coaches: '…' },
},
```

Commit and push to `main`. GitHub Actions builds and deploys in about a minute. The
"Exempeldata visas" banner disappears once the site reads the sheet.

The published ID and gids are read-only and safe to have in the public repo.

## 4. Give editors the admin link

The admin page needs the sheet's **edit ID**, the long part of the sheet's normal address:
`https://docs.google.com/spreadsheets/d/`**`THIS-PART`**`/edit`.

The edit ID must **never** be committed (the repo is public). Instead send editors this link:

```
https://ronnebybk.github.io/ronneby-bk/#/admin?k=THIS-PART
```

The first time they open it, the page remembers the key on their device and removes it from the
address bar. After that, `…/#/admin` (or a home-screen icon) is enough.

**If the link leaks or someone leaves:** in the sheet, set sharing back to *Restricted*, make a copy
(**File → Make a copy**, which gets a new ID), share and publish the copy as in steps 1–2, update
`publishedId`/`gids` in `config.js`, and send the new admin link to the remaining editors.

## 5. Other content

- **Club details and social links:** `src/config.js` (`contact`, `social`).
- **Coach photos:** put the image in `public/coaches/` (e.g. `anna.jpg`, ideally ~800 px wide), then
  write the file name in the *Bild* column. Only publish photos and phone numbers with the coach's consent.
- **Instagram feed:** connect the club's Instagram at [behold.so](https://behold.so) (free plan), and put
  the feed ID in `social.beholdFeedId`. Without it, the site just links to the Instagram profile.
- **Texts:** `src/i18n/sv.js` and `src/i18n/en.js`.

## Local development

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## Address

The site is published at **https://ronnebybk.github.io/ronneby-bk/**. A custom domain is optional and
can be added later under **Settings → Pages → Custom domain**; nothing in the code needs to change.

---

## Instruktioner för redigerare

1. Öppna admin-länken du fått (första gången) eller gå till **ronnebybk.github.io/ronneby-bk/#/admin**.
   Tips: lägg till sidan på hemskärmen i mobilen.
2. Välj flik: **Schema**, **Grupper & priser**, **Tränare** eller **Säsonger**.
3. Ändra direkt i tabellen. Använd rullistorna där de finns.
   - *Nytt pass:* fyll i en tom rad i Schema (säsong, dag, start, slut, grupp, tränare).
   - *Ta bort ett pass:* markera raden → högerklicka → *Ta bort rad*.
   - *Ny säsong (t.ex. sommar):* lägg till den i fliken Säsonger med start- och slutdatum
     (`ÅÅÅÅ-MM-DD`), och lägg sedan in passen i Schema med den säsongen. Hemsidan byter själv
     till rätt säsong när datumet kommer.
   - Tider skrivs som `17:30`.
4. Allt sparas automatiskt. Hemsidan visar ändringen inom ca 5 minuter.
5. Ändra aldrig rubrikerna på första raden.
6. Blev något fel? Säg till webbansvarig – alla tidigare versioner finns sparade
   (*Arkiv → Versionshistorik*).
