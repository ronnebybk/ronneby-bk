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

Schedule, classes, prices, coaches, seasons, notices, news, contact details, social links, the FAQ and
the text of the *Prova på* page live in the Google Sheet. Changing them never
needs a code change or a deploy. See also [SECURITY.md](SECURITY.md) and [LIMITATIONS.md](LIMITATIONS.md).

---

## 1. För redigerare

**Öppna:** använd admin-länken du fått (första gången) eller gå till
**ronnebybk.github.io/ronneby-bk/#/admin**. Tips: lägg till sidan på hemskärmen i mobilen.
Fungerar inte redigeringen i sidan? Tryck på **Öppna i Google Sheets**.

**Flikar:** Schema · Grupper & priser · Tränare · Säsonger · Anslag · Klubbinfo · Prova på · Frågor · Dokument.

| Vill du… | Gör så här |
| --- | --- |
| Lägga till ett pass | Fyll i en tom rad i **Schema**: säsong, dag, start, slut, grupp, tränare. Notering är valfri. Tränar flera grupper samtidigt? Skriv grupperna med komma emellan, t.ex. `Motionsboxning, Nybörjare`. |
| Ändra en tid | Skriv över tiden. Format `17:30` (kolon, inte komma). |
| Ta bort ett pass | Markera raden → högerklicka → *Ta bort rad*. |
| Byta tränare på ett pass | Välj en annan i rullistan i kolumnen Tränare. |
| Ändra pris | Fliken **Grupper**, kolumnen *Pris (kr)*. Bara siffror. `0` visas som "Gratis". Flera sätt att betala (t.ex. per termin och per år)? Lägg en ny rad med exakt samma gruppnamn, bara pris och prisperiod ifyllda. Beskrivning och ålder räcker på en av raderna. |
| Lägga in sommarschema | 1) **Säsonger**: ny rad med namn, start- och slutdatum (`ÅÅÅÅ-MM-DD`). 2) **Schema**: lägg in passen med den säsongen. Hemsidan byter själv när datumet kommer. |
| Lägga till en tränare | Ny rad i **Tränare**. Bild läggs in av webbansvarig. |
| Lägga upp ett anslag | Ny rad i **Anslag**: skriv meddelandet (och gärna en engelsk text), fyll i *Visa från* och *Visa till* som `ÅÅÅÅ-MM-DD` eller lämna dem tomma. Anslaget syns högst upp på startsidan inom ca 5 minuter. Ta bort raden när det inte längre gäller. |
| Lägga upp en nyhet | Ny rad i **Anslag** med *Typ* = **Nyhet**: skriv en *Rubrik* och/eller ett meddelande (och gärna engelska texter). *Visa från* blir nyhetens datum. Fyll i *Visa till* så försvinner nyheten av sig själv. Nyheter syns under "Nyheter" på startsidan, nyaste först. |
| Ändra adress, e-post, telefon eller "Bli medlem" | Fliken **Klubbinfo**: skriv i kolumnen *Värde* på rätt rad (*Lokal*, *Gatuadress*, *Ort*, *E-post*, *Telefon*, *Bli medlem*). *Värde (EN)* är valfri engelsk text, t.ex. för *Bli medlem*. En länk i *Bli medlem* blir klickbar. |
| Ändra märket och "Prova på"-rutan på affischerna | Fliken **Klubbinfo**: *Affisch märke* = texten i den röda runda etiketten (kort, t.ex. "Första passet gratis!"), *Affisch prova på* = texten i rutan *Prova på!*. *Värde (EN)* används när affischen skrivs ut på engelska. Är en av raderna tom skrivs den delen inte ut. |
| Ändra Facebook eller Instagram | Fliken **Klubbinfo**: *Facebook* = hela adressen (`https://www.facebook.com/…`), *Instagram* = kontonamnet eller länken till profilen. |
| Ändra texten på Prova på-sidan | Fliken **Prova på**: en rad per avsnitt, med *Rubrik* och *Text* (och gärna *Rubrik (EN)* / *Text (EN)*). Raderna visas i samma ordning som i arket. Finns minst en ifylld rad ersätter fliken standardtexten helt. |
| Lägga till en fråga | Ny rad i **Frågor**: skriv frågan i *Fråga* och svaret i *Svar*. *Fråga (EN)* och *Svar (EN)* är valfria – saknas de visas den svenska texten även på engelska. Radordningen i arket är ordningen på sidan, så flytta en rad för att ändra ordningen. |
| Lägga upp ett dokument | 1) Ladda upp PDF:en till klubbens Drive-mapp (**Dokument**) → högerklicka → *Dela* → *Alla med länken kan visa* → kopiera länken. 2) Ny rad i **Dokument**: *Kategori* (t.ex. Regler, Föreningen), *Titel*, valfri *Beskrivning*, *Datum* (`ÅÅÅÅ-MM-DD`) och *Länk*. *Kategori (EN)*, *Titel (EN)* och *Beskrivning (EN)* är valfria. Dokumentet syns på sidan Dokument inom ca 5 minuter. |

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
  utan `@` visas inte alls. Kolumnen *Fält* är låst, så bara *Värde* och *Värde (EN)* går att ändra.
- **Prova på:** fliken med samma namn styr texten på sidan *Prova på* och ersätter de inbyggda texterna helt
  så snart den har minst en rad med svensk *Rubrik* eller *Text*. En rad med bara engelsk text hoppas över.
  Enter i en cell (Alt+Enter) börjar ett nytt stycke, rader som börjar med `-` blir en punktlista, och en länk
  blir klickbar. Skriv `#/grupper`, `#/schema`, `#/tranare`, `#/prova-pa` eller `#/kontakt` för att länka till en
  sida på hemsidan; länken visas med sidans namn. Grupplistan med åldrar längst ner skapas automatiskt från
  **Grupper**, och knapparna *Se schemat* och *Bli medlem* går inte att ändra i arket.
- **Ett pass som inte syns** har nästan alltid ett stavfel: fel säsongsnamn, fel dag, eller tid skriven som `17,30`.
- **Frågor:** en rad per fråga. En rad utan fråga eller svar visas inte.
- **Dokument:** en rad per dokument. Rader utan titel eller utan en `https://`-länk visas inte. Tom *Kategori* hamnar sist under ”Övrigt”. Ett datum som inte går att läsa gör att bara datumet hoppas över.
- **Dokument – metadata:** innan du laddar upp en PDF, kontrollera att den inte innehåller personliga uppgifter i metadata eller innehåll: författarnamn, signaturer, personnummer, adresser, privata telefonnummer. Ta bort eller anonymisera sådant (t.ex. i Word: *Arkiv → Info → Kontrollera om det finns problem → Ta bort personlig information*). Årsmötesprotokoll: ta bort eventuella personuppgifter om medlemmar innan du publicerar.
- **Formatering i celler:** i *Svar* (Frågor) och *Bli medlem* (Klubbinfo) ger en radbrytning
  (Alt+Enter i Excel, Ctrl+Enter eller Cmd+Enter i Google Sheets) ett nytt stycke, och rader som
  börjar med `-`, `–` eller `•` blir en punktlista. Länkar blir klickbara.
- Lägg **aldrig** in privata uppgifter (medlemslistor, personnummer, betalningar). Allt i kalkylarket är offentligt.
- Lägg in nästa säsong **innan** den nuvarande tar slut.
- Blev något fel? Säg till webbansvarig. Alla tidigare versioner finns sparade (*Arkiv → Versionshistorik*).

### Skriv ut en affisch

Hemsidan kan göra två affischer i A4 av det som står i kalkylarket, till anslagstavlan: **Schema** (liggande)
och **Grupper & priser** (stående). Inget behöver skrivas om för hand.

1. Gå till **#/admin** och tryck på *Skriv ut affisch: Schema* eller *Skriv ut affisch: Grupper & priser*
   (länkarna finns också längst ner på sidorna Schema och Grupper & priser).
2. Överst (syns inte på pappret) kan du byta språk (svenska/engelska) och, på schemat, välja **säsong**,
   **grupp** (alla eller en) och om **tränare** ska visas.
3. Tryck på **Skriv ut**. Vill du ha en PDF väljer du *Spara som PDF* som skrivare i utskriftsrutan.

**Bra att veta**

- Affischen visar det som finns i kalkylarket just nu. Ser du en gul varning överst, t.ex. att exempeldata
  eller en sparad kopia visas, vänta och ladda om sidan innan du skriver ut.
- QR-koden leder till motsvarande sida på hemsidan, där inställda pass och senaste ändringar syns.
  På en affisch för en enda grupp leder den till schemat filtrerat på den gruppen, och på en affisch för
  en kommande säsong till den säsongen.
- Märket ("Första passet gratis!") och rutan **Prova på!** hämtas från raderna *Affisch märke* och
  *Affisch prova på* i fliken **Klubbinfo**. Är en rad tom skrivs den delen inte ut.
- Använd utskriftens standardinställningar: A4, skala 100 %, standardmarginaler. Affischen har egna
  marginaler, så webbläsarens rubriker och sidfötter (adress, datum) kommer inte med. I Firefox kan de
  behöva stängas av i utskriftsrutan.
- Gruppernas färger skrivs ut, men gruppens namn står alltid bredvid, så affischen fungerar även i svartvitt.
- Affischen ska rymmas på **en sida**. Är en dag väldigt full (fler än fem pass med tränare och noteringar),
  eller är beskrivningarna mycket långa, kan det bli en andra sida. Då hjälper det att dölja tränarna, välja
  en grupp eller korta ner texten i kalkylarket.

### Visa Facebook och Instagram på hemsidan

Kortet för Facebook och Instagram finns på startsidan och på sidan Kontakt. Allt ställs in i fliken
**Klubbinfo**. Ett flöde laddas först när besökaren klickar på *Visa* (för integritetens skull).

**Facebook**

| Klubben har… | Skriv i *Facebook* | Hemsidan visar |
| --- | --- | --- |
| En **grupp** | Gruppens adress, t.ex. `https://www.facebook.com/groups/251477413001` | En knapp "Gå med i Facebookgruppen". Facebook låter inte grupper visas som flöde. |
| En **sida** (Page) | Sidans adress, t.ex. `https://www.facebook.com/klubbensida` | Sidans senaste inlägg som ett flöde |

För ett flöde behöver klubben alltså en Facebook-*sida*, och någon som lägger upp inlägg där. Sidan får inte ha
ålders- eller landsbegränsningar, annars blir flödet tomt. Se även [LIMITATIONS.md](LIMITATIONS.md).

**Instagram**

Skriv klubbens **kontonamn** i *Instagram*, t.ex. `ronnebyboxing`, `@ronnebyboxing` eller länken till profilen.
Då visas en länk "Öppna på Instagram". En länk till en **plats** (`…/explore/locations/…`), ett inlägg eller en
reel fungerar inte. Det måste vara ett konto.

För att också visa **bilderna** som ett flöde behövs ett gratis konto hos Behold:

1. Gör klubbens Instagram till ett **professionellt konto** (företag eller kreatör). I Instagram-appen:
   *Inställningar → Kontotyp och verktyg → Byt till professionellt konto* (namnen kan skilja sig lite
   mellan versioner). Det är gratis.
2. Skapa ett konto på [behold.so](https://behold.so) (gratisnivån räcker) och koppla klubbens Instagram.
3. Skapa ett flöde (*feed*). Välj en **kvadratisk** layout, t.ex. 2×2 eller 3×3, så att den passar bredvid
   Facebook-kortet. Ett högre flöde går att scrolla i.
4. Öppna flödet → **Embed code** i sidomenyn. Där står t.ex. `feed-id="L7mnQCHvZeMZLbNXmJll"`.
   Kopiera bara delen inom citattecknen.
5. Skriv den i *Behold* i Klubbinfo. *Instagram* måste också vara ifyllt, annars visas "Kommer snart".

**Kontrollera:** vänta ca 5 minuter, öppna sidan Kontakt och klicka på *Visa*. Syns inget i en webbläsare med
annonsblockerare (t.ex. Firefox eller Brave med skydd påslaget) är det blockeraren, inte hemsidan. Prova en
annan webbläsare. Länkarna under flödet fungerar alltid.

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
| Interface texts | `src/i18n/sv.js` and `src/i18n/en.js` (keep both in sync) |
| Privacy policy text | `src/views/PrivacyView.vue` |
| Colours, fonts | `src/style.css` (variables at the top) |
| Logo and icons | `src/assets/logo.svg` (site), `public/*.png` (icons). Sources in `design/`: `logo.svg` (with background), `logo-transparent.svg`, `logo-2400.png` (print/sharing) |

### Add a coach photo

1. Get the coach's OK to publish it.
2. Resize to about 800 px wide JPG and put it in `public/coaches/`, e.g. `anna.jpg`. Push.
3. Write `anna.jpg` in the *Bild* column of the coach's row in the sheet.

Without a photo, the card shows the coach's initials.

### Instagram feed and Facebook Page

Editors can set these up themselves; see
[Visa Facebook och Instagram på hemsidan](#visa-facebook-och-instagram-på-hemsidan) (Swedish). In short: a
Facebook *Page* shows a feed, a group only a join button; Instagram needs the account name, plus a
[Behold](https://behold.so) feed ID (free, needs a Business/Creator account) for the picture feed. Both feeds
sit in the same square window, so pick a square Behold layout.

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
| Sheet content | **Automatic, weekly:** the *Back up Google Sheet* workflow saves the four required tabs plus *Anslag*, *Klubbinfo*, *Prova på*, *Frågor* and *Dokument* when they are configured, as CSV every Monday. Each snapshot is kept for 90 days, outside Google. | See below |
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
| The *Prova på* page shows the built-in text | The *Prova på* tab has no row with a Swedish *Rubrik* or *Text* (an English-only row is skipped), or `gids.trial` in `src/config.js` is empty. |
| A question doesn't show | *Fråga* or *Svar* is empty in that row, or `gids.faq` in `src/config.js` is empty. |
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
   In *Klubbinfo*, check the *Fält* dropdown: `A2:A50` → **Dropdown** with the options `Lokal`, `Gatuadress`,
   `Ort`, `E-post`, `Telefon`, `Bli medlem`, `Facebook`, `Instagram`, `Behold`, `Affisch märke`,
   `Affisch prova på`. Every one of those eleven
   needs its own row, since editors can't add rows once column A is protected (step 5).
   In *Dokument*, check the date validation on *Datum*: select `G2:G1000` → **Data → Data validation → Is valid date**. Also set *Dokument* columns A:F and H to **Format → Number → Plain text**, so a text like `8–12` stays as typed.
   Also check that *Klubbinfo* columns B:C are **Format → Number → Plain text**. Otherwise Sheets turns a phone
   number like `+46 70…` into a number and drops the `+` and leading zeros. Do the same for *Prova på*
   columns A:D, so a text like `8–12` stays as typed.
4. In each validation rule, set **If the data is invalid → Reject the input**.
5. Protect the header rows: **Data → Protect sheets and ranges** → `Schema!1:1` → **Only you**.
   Repeat for `Grupper!1:1`, `Tränare!1:1`, `Säsonger!1:1`, `Anslag!1:1`, `Klubbinfo!1:1`, `Prova på!1:1`, `Frågor!1:1`, `Dokument!1:1`.
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
