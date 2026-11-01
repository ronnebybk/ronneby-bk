# Hjälp för redigerare

## Komma igång

### Öppna admin-sidan
<!-- id: oppna · flikar: alla -->

**Öppna:** använd admin-länken du fått (första gången) eller gå till
**ronnebybk.github.io/ronneby-bk/#/admin**. Tips: lägg till sidan på hemskärmen i mobilen.
Fungerar inte redigeringen i sidan? Tryck på **Öppna i Google Sheets**.

#### Open the admin page

**Open:** use the admin link you were given (the first time) or go to
**ronnebybk.github.io/ronneby-bk/#/admin**. Tip: add the page to the home screen on your phone.
If editing doesn't work on the page? Press **Open in Google Sheets**.

### Varningar
<!-- id: varningar · flikar: alla -->

**Varningar:** över kalkylarket finns en varningsruta som listar rader webbplatsen hoppar över
eller värden den inte använder, med flik och radnummer (t.ex. *Schema rad 7: …*). Klicka på
flikenamnet i en varning så växlar kalkylarket till den fliken. Ett korrekt ifyllt kalkylark ger inga
varningar.

#### Warnings

**Warnings:** above the sheet there is a warning box listing rows the website skips or values it
doesn't use, with tab and row number (e.g. *Schema row 7: …*). Click the tab name in a warning to
switch the sheet to that tab. A correctly filled-in sheet gives no warnings.

### Flikarna
<!-- id: flikar · flikar: alla -->

**Flikar:** Schema · Grupper & priser · Tränare · Säsonger · Anslag · Klubbinfo · Prova på · Frågor · Dokument · Evenemang · Resultat · Sponsorer.

#### The tabs

**Tabs:** the sheet's tabs: Schema · Grupper & priser · Tränare · Säsonger · Anslag · Klubbinfo · Prova på · Frågor · Dokument · Evenemang · Resultat · Sponsorer (the tab names stay Swedish in the sheet itself).

## Vill du…

### Lägga till ett pass
<!-- id: lagga-till-ett-pass · flikar: Schema · sök: träning, träningspass, lektion, ny tid -->

Fyll i en tom rad i **Schema**: säsong, dag, start, slut, grupp, tränare. Notering är valfri. Tränar flera grupper samtidigt? Skriv grupperna med komma emellan, t.ex. `Motionsboxning, Nybörjare`.

#### Add a session

Fill in an empty row in **Schema**: season, day, start, end, group, coach. Note is optional. Do several groups train at the same time? Write the groups separated by commas, e.g. `Motionsboxning, Nybörjare`.

### Ändra en tid
<!-- id: andra-en-tid · flikar: Schema · sök: klockslag, flytta, komma, 17,30 -->

Skriv över tiden. Format `17:30` (kolon, inte komma).

#### Change a time

Overwrite the time. Format `17:30` (colon, not comma).

### Ta bort ett pass
<!-- id: ta-bort-ett-pass · flikar: Schema · sök: radera, stryka -->

Markera raden → högerklicka → *Ta bort rad*.

#### Delete a session

Select the row → right-click → *Delete row*.

### Byta tränare på ett pass
<!-- id: byta-tranare · flikar: Schema · sök: ledare, instruktör, vikarie -->

Välj en annan i rullistan i kolumnen Tränare.

#### Change the coach of a session

Choose another one in the dropdown in the Tränare column.

### Ändra pris
<!-- id: andra-pris · flikar: Grupper · sök: avgift, kostnad, terminsavgift, årsavgift, medlemsavgift, gratis -->

Fliken **Grupper**, kolumnen *Pris (kr)*. Bara siffror. `0` visas som "Gratis". Flera sätt att betala (t.ex. per termin och per år)? Lägg en ny rad med exakt samma gruppnamn, bara pris och prisperiod ifyllda. Beskrivning och ålder räcker på en av raderna.

#### Change the price

The **Grupper** tab, column *Pris (kr)*. Numbers only. `0` is shown as "Gratis" (free). Several ways to pay (e.g. per term and per year)? Add a new row with exactly the same group name, only price and price period filled in. Description and age only need to be on one of the rows.

### Lägga in sommarschema
<!-- id: sommarschema · flikar: Säsonger, Schema · sök: sommar, termin, hösttermin, vårtermin, nytt schema -->

1) **Säsonger**: ny rad med namn, start- och slutdatum (`ÅÅÅÅ-MM-DD`). 2) **Schema**: lägg in passen med den säsongen. Hemsidan byter själv när datumet kommer.

#### Add a summer schedule

1) **Säsonger**: new row with name, start and end date (`YYYY-MM-DD`). 2) **Schema**: add the sessions with that season. The website switches by itself when the date comes.

### Lägga till en tränare
<!-- id: lagga-till-tranare · flikar: Tränare · sök: ledare, instruktör, coach -->

Ny rad i **Tränare**. Bild: se [Bilder](#bilder) nedan.

#### Add a coach

New row in **Tränare**. Image: see [Images](#bilder) below.

### Lägga till eller byta en tränarbild
<!-- id: tranarbild · flikar: Tränare · sök: foto, porträtt, profilbild -->

Se [Bilder](#bilder) nedan – ladda upp på klubbens Drive och klistra in delningslänken i kolumnen *Bild*.

#### Add or change a coach photo

See [Images](#bilder) below – upload to the club's Drive and paste the share link in the *Bild* column.

### Lägga upp ett anslag
<!-- id: anslag · flikar: Anslag · sök: inställd, inställt, lov, stängt, ledigt, meddelande, banderoll, cancelled, canceled, closed -->

Ny rad i **Anslag**: skriv meddelandet (och gärna en engelsk text), fyll i *Visa från* och *Visa till* som `ÅÅÅÅ-MM-DD` eller lämna dem tomma. Anslaget syns högst upp på startsidan inom ca 5 minuter. Ta bort raden när det inte längre gäller.

#### Post a notice

New row in **Anslag**: write the message (and preferably an English text), fill in *Visa från* and *Visa till* as `YYYY-MM-DD` or leave them empty. The notice appears at the top of the home page within about 5 minutes. Delete the row when it no longer applies.

### Lägga upp en nyhet
<!-- id: nyhet · flikar: Anslag · sök: nyheter, inlägg, aktuellt -->

Ny rad i **Anslag** med *Typ* = **Nyhet**: skriv en *Rubrik* och/eller ett meddelande (och gärna engelska texter). *Visa från* blir nyhetens datum. Fyll i *Visa till* så försvinner nyheten av sig själv. Nyheter syns under "Nyheter" på startsidan, nyaste först.

#### Post a news item

New row in **Anslag** with *Typ* = **Nyhet**: write a *Rubrik* and/or a message (and preferably English texts). *Visa från* becomes the news item's date. Fill in *Visa till* and the news item disappears by itself. News items appear under "News" on the home page, newest first.

### Ändra adress, e-post, telefon eller "Bli medlem"
<!-- id: adress-epost-telefon · flikar: Klubbinfo · sök: kontakt, lokal, mejl, mail, medlemskap, gå med -->

Fliken **Klubbinfo**: skriv i kolumnen *Värde* på rätt rad (*Lokal*, *Gatuadress*, *Ort*, *E-post*, *Telefon*, *Bli medlem*). *Värde (EN)* är valfri engelsk text, t.ex. för *Bli medlem*. En länk i *Bli medlem* blir klickbar.

#### Change address, email, phone or "Join"

The **Klubbinfo** tab: write in the *Värde* column on the right row (*Lokal*, *Gatuadress*, *Ort*, *E-post*, *Telefon*, *Bli medlem*). *Värde (EN)* is optional English text, e.g. for *Bli medlem*. A link in *Bli medlem* becomes clickable.

### Ändra märket och "Prova på"-rutan på affischerna
<!-- id: affischmarke · flikar: Klubbinfo · sök: poster, etikett -->

Fliken **Klubbinfo**: *Affisch märke* = texten i den röda runda etiketten (kort, t.ex. "Första passet gratis!"), *Affisch prova på* = texten i rutan *Prova på!*. *Värde (EN)* används när affischen skrivs ut på engelska. Är en av raderna tom skrivs den delen inte ut.

#### Change the badge and the "Try it" box on posters

The **Klubbinfo** tab: *Affisch märke* = the text in the red round badge (short, e.g. "First session free!"), *Affisch prova på* = the text in the *Prova på!* box. *Värde (EN)* is used when the poster is printed in English. If one of the rows is empty, that part is not printed.

### Ändra Facebook eller Instagram
<!-- id: facebook-instagram · flikar: Klubbinfo · sök: sociala medier, fb, insta -->

Fliken **Klubbinfo**: *Facebook* = hela adressen (`https://www.facebook.com/…`), *Instagram* = kontonamnet eller länken till profilen.

#### Change Facebook or Instagram

The **Klubbinfo** tab: *Facebook* = the full address (`https://www.facebook.com/…`), *Instagram* = the account name or the link to the profile.

### Ändra texten på Prova på-sidan
<!-- id: prova-pa-text · flikar: Prova på · sök: provträning, testa, första passet -->

Fliken **Prova på**: en rad per avsnitt, med *Rubrik* och *Text* (och gärna *Rubrik (EN)* / *Text (EN)*). Raderna visas i samma ordning som i arket. Finns minst en ifylld rad ersätter fliken standardtexten helt.

#### Change the text of the Try boxing page

The **Prova på** tab: one row per section, with *Rubrik* and *Text* (and preferably *Rubrik (EN)* / *Text (EN)*). The rows are shown in the same order as in the sheet. If there is at least one filled-in row, the tab completely replaces the default text.

### Lägga till en fråga
<!-- id: fraga · flikar: Frågor · sök: FAQ, vanliga frågor -->

Ny rad i **Frågor**: skriv frågan i *Fråga* och svaret i *Svar*. *Fråga (EN)* och *Svar (EN)* är valfria – saknas de visas den svenska texten även på engelska. Radordningen i arket är ordningen på sidan, så flytta en rad för att ändra ordningen.

#### Add a question

New row in **Frågor**: write the question in *Fråga* and the answer in *Svar*. *Fråga (EN)* and *Svar (EN)* are optional – if they are missing, the Swedish text is shown in English too. The row order in the sheet is the order on the page, so move a row to change the order.

### Lägga upp ett dokument
<!-- id: dokument · flikar: Dokument · sök: PDF, stadgar, protokoll, regler, fil, årsmöte -->

1) Ladda upp PDF:en till klubbens Drive-mapp (**Dokument** – mappen ägs av klubbens Google-konto, [se 4.1](../HOWTO.md#41-create-the-sheet); ladda inte upp i din egen Drive, då försvinner filen när du lämnar klubben) → högerklicka → *Dela* → *Alla med länken kan visa* → kopiera länken. 2) Ny rad i **Dokument**: *Kategori* (t.ex. Regler, Föreningen), *Titel*, valfri *Beskrivning*, *Datum* (`ÅÅÅÅ-MM-DD`) och *Länk*. *Kategori (EN)*, *Titel (EN)* och *Beskrivning (EN)* är valfria. Dokumentet syns på sidan Dokument inom ca 5 minuter.

#### Add a document

1) Upload the PDF to the club's Drive folder (**Dokument** – the folder is owned by the club's Google account, [see 4.1](../HOWTO.md#41-create-the-sheet); don't upload to your own Drive, or the file disappears when you leave the club) → right-click → *Share* → *Anyone with the link can view* → copy the link. 2) New row in **Dokument**: *Kategori* (e.g. Regler, Föreningen), *Titel*, optional *Beskrivning*, *Datum* (`YYYY-MM-DD`) and *Länk*. *Kategori (EN)*, *Titel (EN)* and *Beskrivning (EN)* are optional. The document appears on the Documents page within about 5 minutes.

### Lägga till ett evenemang (tävling, läger, gala)
<!-- id: evenemang · flikar: Evenemang · sök: tävling, läger, gala, match, cup, event -->

Ny rad i **Evenemang**: välj *Typ* i rullistan (Tävling/Läger/Gala/Övrigt), skriv en *Rubrik* (obligatorisk – resultat kopplas till tävlingen via detta namn), fyll i *Datum* (`ÅÅÅÅ-MM-DD`, valfritt) och *Slutdatum* för flerdagarsevenemang, samt valfritt *Tid*, *Plats*, *Beskrivning*, *Bild* och *Länk*. *Bild*: en delningslänk från klubbens Drive per rad, max ca 6 bilder (större bildspel? länka ett fotoalbum i *Länk* istället). *Länk* måste börja med `https://` och visas som en knapp ("Anmälan & info" före/evenemanget, "Bilder & info" efteråt). Engelska texter skrivs i kolumnerna med *(EN)*. Evenemanget syns på sidan **Evenemang** inom ca 5 minuter – under *Kommande* om datumet är idag eller senare, annars under *Tidigare*.

#### Add an event (competition, camp, gala)

New row in **Evenemang**: choose *Typ* in the dropdown (Tävling/Läger/Gala/Övrigt), write a *Rubrik* (mandatory – results are linked to the competition via this name), fill in *Datum* (`YYYY-MM-DD`, optional) and *Slutdatum* for multi-day events, plus optional *Tid*, *Plats*, *Beskrivning*, *Bild* and *Länk*. *Bild*: one share link from the club's Drive per row, max about 6 images (bigger slideshow? link a photo album in *Länk* instead). *Länk* must start with `https://` and is shown as a button ("Anmälan & info" before the event, "Bilder & info" afterwards). English texts go in the *(EN)* columns. The event appears on the **Evenemang** page within about 5 minutes – under *Kommande* if the date is today or later, otherwise under *Tidigare*.

### Koppla resultat till en tävling
<!-- id: koppla-resultat · flikar: Resultat, Evenemang · sök: tävlingsnamn, matcha -->

I **Resultat**, skriv tävlingens *Rubrik* från **Evenemang** exakt i kolumnen *Tävling*. Resultatet visas då inuti tävlingens kort på sidan Evenemang.

#### Link a result to a competition

In **Resultat**, write the event's *Rubrik* from **Evenemang** exactly in the *Tävling* column. The result then appears inside the event's card on the Evenemang page.

### Lägga till ett resultat
<!-- id: lagga-till-resultat · flikar: Resultat · sök: medalj, guld, placering, vinst -->

Ny rad i **Resultat**: *Datum* (`ÅÅÅÅ-MM-DD`), *Tävling*, *Ort*, *Namn*, *Junior/Senior* (rullista), *Klass* och *Placering* (rullista: `Guld`, `Silver` och `Brons` ger medalj; annan text, t.ex. `Kvartsfinal`, visas som den skrivs). *Tävling (EN)*, *Klass (EN)*, *Placering (EN)* och *Länk* är valfria. **Samtycke först:** lägg bara upp resultat för någon som gett sitt samtycke (för juniorer: en vårdnadshavare). Resultatet syns på sidan Evenemang inom ca 5 minuter, inuti tävlingens kort (eller på ett eget tävlingskort om ingen tävling med det namnet finns).

#### Add a result

New row in **Resultat**: *Datum* (`YYYY-MM-DD`), *Tävling*, *Ort*, *Namn*, *Junior/Senior* (dropdown), *Klass* and *Placering* (dropdown: `Guld`, `Silver` and `Brons` give a medal; other text, e.g. `Kvartsfinal`, is shown as written). *Tävling (EN)*, *Klass (EN)*, *Placering (EN)* and *Länk* are optional. **Consent first:** only post results for someone who has given consent (for juniors: a guardian). The result appears on the Evenemang page within about 5 minutes, inside the competition's card (or on its own competition card if no event has that name).

### Ta bort ett resultat
<!-- id: ta-bort-resultat · flikar: Resultat · sök: radera, samtycke, GDPR -->

Markera raden → högerklicka → *Ta bort rad*. Inom ca 5 minuter är resultatet borta från sidan (men kan finnas kvar i veckans säkerhetskopia i upp till 90 dagar). Den som redan har sidan öppen eller sparad i webbläsaren ser ändringen nästa gång sidan laddas.

#### Delete a result

Select the row → right-click → *Delete row*. Within about 5 minutes the result is gone from the page (but may remain in the weekly backup for up to 90 days). Anyone who already has the page open or saved in the browser sees the change the next time the page loads.

### Lägga till en sponsor
<!-- id: sponsor · flikar: Sponsorer · sök: partner, logga, företag -->

Ny rad i **Sponsorer**: *Namn* (visas som text om ingen logga finns), valfri *Logga* (se [Bilder](#bilder)), valfri *Länk* till sponsorens webbplats (måste börja med `https://`), valfri *Beskrivning* (t.ex. "Huvudsponsor") och *Beskrivning (EN)*. Sponsorn syns på sidan *Sponsorer* inom ca 5 minuter, i samma ordning som raderna i arket. De 4 första raderna visas också längst ner på startsidan; flytta upp en rad för att visa den sponsorn där.

#### Add a sponsor

New row in **Sponsorer**: *Namn* (shown as text if there is no logo), optional *Logga* (see [Images](#bilder)), optional *Länk* to the sponsor's website (must start with `https://`), optional *Beskrivning* (e.g. "Huvudsponsor") and *Beskrivning (EN)*. The sponsor appears on the *Sponsorer* page within about 5 minutes, in the same order as the rows in the sheet. The first 4 rows are also shown at the bottom of the home page; move a row up to show that sponsor there.

### Ta bort en sponsor
<!-- id: ta-bort-sponsor · flikar: Sponsorer -->

Markera raden → högerklicka → *Ta bort rad*. Inom ca 5 minuter är sponsorn borta från sidan.

#### Delete a sponsor

Select the row → right-click → *Delete row*. Within about 5 minutes the sponsor is gone from the page.

## Viktigt

### Allt sparas automatiskt
<!-- id: sparas-automatiskt · flikar: alla · sök: spara, syns inte, väntar, fördröjning -->

- Allt sparas automatiskt. Ändringen syns på hemsidan inom **ca 5 minuter**.

#### Everything is saved automatically

- Everything is saved automatically. The change appears on the website within **about 5 minutes**.

### Ändra aldrig rubrikerna
<!-- id: andra-aldrig-rubrikerna · flikar: alla · fäst -->

- **Ändra aldrig rubrikerna** på första raden.

#### Never change the headers

- **Never change the headers** in the first row.

### Byter du namn
<!-- id: byta-namn · flikar: Grupper, Tränare, Säsonger · sök: döpa om, stavning -->

- **Byter du namn** på en grupp, tränare eller säsong måste du ändra samma namn i fliken Schema också,
  annars försvinner passen från hemsidan.

#### If you rename

- **If you rename** a group, coach or season, you must change the same name in the Schema tab too,
  or the sessions disappear from the website.

### Ett anslag syns bara under sin period
<!-- id: anslag-period · flikar: Anslag -->

- **Ett anslag** syns bara på startsidan, och bara under perioden *Visa från*–*Visa till* (båda dagarna
  räknas med). Ett datum som inte går att läsa, t.ex. `nästa vecka`, gör att raden hoppas över.

#### A notice only shows during its period

- **A notice** only appears on the home page, and only during the period *Visa från*–*Visa till* (both days
  count). A date that can't be read, e.g. `nästa vecka` ("next week"), makes the row get skipped.

### Fyll i Visa till för tillfälliga meddelanden
<!-- id: anslag-visa-till · flikar: Anslag -->

- Fyll i **Visa till** för tillfälliga meddelanden (t.ex. inställd träning). Då försvinner anslaget av
  sig självt, och samma text kan användas igen senare.

#### Fill in Visa till for temporary messages

- Fill in **Visa till** for temporary messages (e.g. cancelled training). The notice then disappears
  by itself, and the same text can be used again later.

### Anslag eller nyhet?
<!-- id: anslag-eller-nyhet · flikar: Anslag -->

- **Anslag eller nyhet?** Brådskande saker (inställd träning) är *Anslag* och syns som röd banderoll.
  Mindre brådskande saker (ny grupp, tävlingsresultat) är *Nyhet*. Tom *Typ* räknas som *Anslag*.
  *Rubrik* används bara för nyheter.

#### Notice or news?

- **Notice or news?** Urgent things (cancelled training) are *Anslag* and show as a red banner.
  Less urgent things (new group, competition results) are *Nyhet*. An empty *Typ* counts as *Anslag*.
  *Rubrik* is only used for news items.

### Klubbinfo
<!-- id: klubbinfo · flikar: Klubbinfo -->

- **Klubbinfo:** en rad per uppgift. Lämnar du *Värde* tomt visas "Uppgifter kommer snart" (för *Bli medlem*
  visas en standardtext). En Facebook-adress som inte börjar med `https://www.facebook.com/` eller en e-post
  utan `@` visas inte alls. Kolumnen *Fält* är låst, så bara *Värde* och *Värde (EN)* går att ändra.

#### Club info

- **Klubbinfo:** one row per item. If you leave *Värde* empty, "Uppgifter kommer snart" is shown (for *Bli medlem*
  a standard text is shown). A Facebook address that doesn't start with `https://www.facebook.com/` or an email
  without `@` is not shown at all. The *Fält* column is locked, so only *Värde* and *Värde (EN)* can be changed.

### Prova på
<!-- id: prova-pa · flikar: Prova på -->

- **Prova på:** fliken med samma namn styr texten på sidan *Prova på* och ersätter de inbyggda texterna helt
  så snart den har minst en rad med svensk *Rubrik* eller *Text*. En rad med bara engelsk text hoppas över.
  Enter i en cell (Alt+Enter) börjar ett nytt stycke, rader som börjar med `-` blir en punktlista, och en länk
  blir klickbar. Skriv `#/grupper`, `#/schema`, `#/tranare`, `#/prova-pa`, `#/fragor`, `#/dokument`, `#/integritet` eller `#/kontakt` för att länka till en
  sida på hemsidan; länken visas med sidans namn. Grupplistan med åldrar längst ner skapas automatiskt från
  **Grupper**, och knapparna *Se schemat* och *Bli medlem* går inte att ändra i arket.

#### Try boxing

- **Prova på:** the tab with the same name controls the text of the *Prova på* page and completely replaces the
  built-in texts as soon as it has at least one row with a Swedish *Rubrik* or *Text*. A row with only English
  text is skipped. Enter in a cell (Alt+Enter) starts a new paragraph, rows starting with `-` become a bullet
  list, and a link becomes clickable. Write `#/grupper`, `#/schema`, `#/tranare`, `#/prova-pa`, `#/fragor`,
  `#/dokument`, `#/integritet` or `#/kontakt` to link to a page on the website; the link is shown with the page's
  name. The group list with ages at the bottom is created automatically from **Grupper**, and the buttons
  *Se schemat* and *Bli medlem* cannot be changed in the sheet.

### Ett pass som inte syns
<!-- id: pass-saknas · flikar: Schema · sök: saknas, borta, försvunnen, felsöka -->

- **Ett pass som inte syns** har nästan alltid ett stavfel: fel säsongsnamn, fel dag, eller tid skriven som `17,30`.

#### A session that doesn't show

- **A session that doesn't show** almost always has a typo: wrong season name, wrong day, or a time written as `17,30`.

### Frågor
<!-- id: fragor · flikar: Frågor -->

- **Frågor:** en rad per fråga. En rad utan fråga eller svar visas inte.

#### FAQ

- **Frågor:** one row per question. A row without a question or answer is not shown.

### Dokument
<!-- id: dokument-hantera · flikar: Dokument · sök: byta pdf, ny version -->

- **Dokument:** en rad per dokument. Rader utan titel eller utan en `https://`-länk visas inte. Tom *Kategori* eller *Övrigt* hamnar sist under ”Övrigt” (på engelska ”Other”. Ett datum som inte går att läsa gör att bara datumet hoppas över. **Ersätta:** i Drive, högerklicka på filen → *Hantera versioner* → ladda upp den nya PDF:en; länken är oförändrad så raden i arket behöver inte ändras (annars klistra in den nya länken i *Länk*). **Ta bort:** ta bort raden i arket och ta även bort filen i Drive eller sluta dela den – bara att ta bort raden lämnar PDF:en offentlig för alla som har länken.

#### Documents

- **Dokument:** one row per document. Rows without a title or without a `https://` link are not shown. An empty *Kategori* or *Övrigt* ends up last under "Övrigt" ("Other" in English). A date that can't be read only skips the date. **Replace:** in Drive, right-click the file → *Manage versions* → upload the new PDF; the link is unchanged so the row in the sheet doesn't need to change (otherwise paste the new link in *Länk*). **Delete:** delete the row in the sheet and also delete the file in Drive or stop sharing it – only deleting the row leaves the PDF public to anyone with the link.

### Dokument – metadata
<!-- id: dokument-metadata · flikar: Dokument · sök: personuppgifter, författare, signatur, GDPR -->

- **Dokument – metadata:** innan du laddar upp en PDF, kontrollera att den inte innehåller personliga uppgifter i metadata eller innehåll: författarnamn, signaturer, personnummer, adresser, privata telefonnummer. Ta bort eller anonymisera sådant (t.ex. i Word: *Arkiv → Info → Kontrollera om det finns problem → Ta bort personlig information*). Årsmötesprotokoll: ta bort eventuella personuppgifter om medlemmar innan du publicerar. Kontrollera också PDF:ens egenskaper innan du laddar upp den (i en PDF-läsare: *Arkiv → Egenskaper* – författare, titel, nyckelord); innehåller de ett namn, exportera om filen eller ”skriv ut till PDF”. Skannade protokoll kan dessutom innehålla handskrivna signaturer som bara syns i bilden.

#### Document metadata

- **Dokument – metadata:** before uploading a PDF, check that it contains no personal data in metadata or content: author names, signatures, personal ID numbers, addresses, private phone numbers. Remove or anonymise such things (e.g. in Word: *File → Info → Inspect Document → Remove personal information*). AGM minutes: remove any personal data about members before publishing. Also check the PDF's properties before uploading (in a PDF reader: *File → Properties* – author, title, keywords); if they contain a name, re-export the file or "print to PDF". Scanned minutes may also contain handwritten signatures that are only visible in the image.

### Evenemang
<!-- id: evenemang-info · flikar: Evenemang -->

- **Evenemang:** en rad utan *Rubrik* visas inte. Ett evenemang utan datum ligger kvar längst ner under *Kommande* med "Datum meddelas senare"; ett datum som inte går att läsa (t.ex. `mitten av mars`) visas som det står. Admin-sidan varnar när datum saknas, inte går att läsa, eller när *Slutdatum* ligger före *Datum*, samt för resultat vars *Tävling* inte matchar något evenemang och för bilder som inte laddas. Flytta rader för att ändra ordningen bland evenemang utan datum.

#### Events

- **Evenemang:** a row without a *Rubrik* is not shown. An event without a date stays at the bottom under *Kommande* with "Datum meddelas senare" ("date to be announced"); a date that can't be read (e.g. `mitten av mars`) is shown as written. The admin page warns when a date is missing, can't be read, or when *Slutdatum* is before *Datum*, as well as for results whose *Tävling* matches no event and for images that don't load. Move rows to change the order of events without dates.

### Resultat
<!-- id: resultat-samtycke · flikar: Resultat · sök: junior, förnamn, vårdnadshavare -->

- **Resultat:** samtycke krävs innan du lägger upp en rad. För juniorer (allt utom *Senior* i *Junior/Senior*) visas bara förnamnet på hemsidan, även om hela namnet skrivits in. En rad utan datum, tävling, namn eller placering visas inte.

#### Results

- **Resultat:** consent is required before you add a row. For juniors (everything except *Senior* in *Junior/Senior*) only the first name is shown on the website, even if the full name was entered. A row without date, competition, name or placement is not shown.

### Formatering i celler
<!-- id: formatering · flikar: Frågor, Klubbinfo, Prova på · sök: radbrytning, ny rad, punktlista -->

- **Formatering i celler:** i *Svar* (Frågor) och *Bli medlem* (Klubbinfo) ger en radbrytning
  (Alt+Enter i Excel, Ctrl+Enter eller Cmd+Enter i Google Sheets) ett nytt stycke, och rader som
  börjar med `-`, `–` eller `•` blir en punktlista. Länkar blir klickbara.

#### Formatting in cells

- **Formatering i celler:** in *Svar* (Frågor) and *Bli medlem* (Klubbinfo), a line break
  (Alt+Enter in Excel, Ctrl+Enter or Cmd+Enter in Google Sheets) starts a new paragraph, and rows
  starting with `-`, `–` or `•` become a bullet list. Links become clickable.

### Lägg aldrig in privata uppgifter
<!-- id: inga-privata-uppgifter · flikar: alla · fäst -->

- Lägg **aldrig** in privata uppgifter (medlemslistor, personnummer, betalningar). Allt i kalkylarket är offentligt.

#### Never enter private data

- **Never** enter private data (member lists, personal ID numbers, payments). Everything in the sheet is public.

### Lägg in nästa säsong i tid
<!-- id: nasta-sasong · flikar: Säsonger · sök: ny termin -->

- Lägg in nästa säsong **innan** den nuvarande tar slut.

#### Add the next season in time

- Add the next season **before** the current one ends.

### Blev något fel?
<!-- id: blev-nagot-fel · flikar: alla · sök: ångra, versionshistorik, återställ, misstag -->

- Blev något fel? Säg till webbansvarig. Alla tidigare versioner finns sparade (*Arkiv → Versionshistorik*).

#### Did something go wrong?

- Did something go wrong? Tell the web admin. All previous versions are saved (*File → Version history*).

## Förhandsgranska

### Förhandsgranska ändringar
<!-- id: forhandsgranska · flikar: alla · sök: förhandsvisning, preview, se direkt -->

Ändringar i arket syns på hemsidan först efter att Google publicerar om arket (inom ca 5 minuter).
Vill du se resultatet direkt trycker du på **Förhandsgranska** på admin-sidan. Då öppnas hemsidan
i samma flik och visar arket som det ser ut **just nu** – utan att vänta på publiceringen.

- En gul **FÖRHANDSVISNING**-banderoll visas högst upp på varje sida, tillsammans med en ram runt
  hela sidan och "Förhandsvisning – " i webbläsarens fliknamn. Så är det tydligt att du inte ser den
  riktiga sidan.
- Banderollen har knapparna **Uppdatera** (hämtar arket igen), **Till admin** (tillbaka till
  admin-sidan) och **Avsluta** (stänger av förhandsvisningen och visar den publicerade sidan).
- Växlar du till en annan flik (t.ex. för att redigera arket) och kommer tillbaka laddas
  förhandsvisningen om automatiskt.
- Förhandsvisningen gäller bara i den här fliken. Stänger du fliken, eller öppnar sidan i en ny flik,
  ser du den publicerade versionen som vanligt. Besökare påverkas inte alls.
- Saknas admin-åtkomst på enheten går det inte att starta förhandsvisningen.

#### Preview changes

Changes in the sheet appear on the website only after Google republishes the sheet (within about 5 minutes).
Want to see the result right away? Press **Preview** on the admin page. The home page then opens
in the same tab and shows the sheet as it looks **right now** – without waiting for publishing.

- A yellow **PREVIEW** banner is shown at the top of every page, together with a frame around
  the whole page and "Preview – " in the browser tab name. So it's clear that you're not seeing the
  real page.
- The banner has the buttons **Uppdatera** (fetches the sheet again), **Till admin** (back to
  the admin page) and **Avsluta** (turns off the preview and shows the published page).
- If you switch to another tab (e.g. to edit the sheet) and come back, the preview reloads
  automatically.
- The preview only applies to this tab. If you close the tab, or open the page in a new tab,
  you see the published version as usual. Visitors are not affected at all.
- Without admin access on the device, the preview can't be started.

## Affischer

### Skriv ut en affisch
<!-- id: skriv-ut-affisch · flikar: Schema, Grupper · sök: poster, utskrift, anslagstavla, QR -->

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

#### Print a poster

The website can make two A4 posters of what's in the sheet, for the notice board: **Schema** (landscape)
and **Grupper & priser** (portrait). Nothing needs to be rewritten by hand.

1. Go to **#/admin** and press *Skriv ut affisch: Schema* or *Skriv ut affisch: Grupper & priser*
   (the links are also at the bottom of the Schema and Grupper & priser pages).
2. At the top (not visible on paper) you can switch language (Swedish/English) and, on the schedule,
   choose **säsong**, **grupp** (all or one) and whether **tränare** should be shown.
3. Press **Skriv ut** ("Print"). For a PDF, choose *Save as PDF* as the printer in the print dialog.

**Good to know**

- The poster shows what's in the sheet right now. If you see a yellow warning at the top, e.g. that example
  data or a saved copy is shown, wait and reload the page before printing.
- The QR code leads to the corresponding page on the website, where cancelled sessions and the latest changes
  are shown. On a poster for a single group it leads to the schedule filtered on that group, and on a poster
  for an upcoming season to that season.
- The badge ("Första passet gratis!") and the **Prova på!** box are taken from the rows *Affisch märke* and
  *Affisch prova på* in the **Klubbinfo** tab. If a row is empty, that part is not printed.
- Use the print dialog's default settings: A4, scale 100 %, standard margins. The poster has its own
  margins, so the browser's headers and footers (address, date) are not included. In Firefox they may
  need to be turned off in the print dialog.
- The groups' colours are printed, but the group's name is always printed next to it, so the poster works
  in black and white too.
- The poster should fit on **one page**. If a day is very full (more than five sessions with coaches and notes),
  or the descriptions are very long, a second page may appear. Then it helps to hide the coaches, choose
  one group or shorten the text in the sheet.

## Facebook och Instagram

### Visa Facebook och Instagram på hemsidan
<!-- id: instagram-flode · flikar: Klubbinfo · sök: behold, flöde, bilder -->

Kortet för Facebook och Instagram finns på startsidan och på sidan Kontakt. Allt ställs in i fliken
**Klubbinfo**. Ett flöde laddas först när besökaren klickar på *Visa* (för integritetens skull).

**Facebook**

| Klubben har… | Skriv i *Facebook* | Hemsidan visar |
| --- | --- | --- |
| En **grupp** | Gruppens adress, t.ex. `https://www.facebook.com/groups/251477413001` | En knapp "Gå med i Facebookgruppen". Facebook låter inte grupper visas som flöde. |
| En **sida** (Page) | Sidans adress, t.ex. `https://www.facebook.com/klubbensida` | Sidans senaste inlägg som ett flöde |

För ett flöde behöver klubben alltså en Facebook-*sida*, och någon som lägger upp inlägg där. Sidan får inte ha
ålders- eller landsbegränsningar, annars blir flödet tomt. Se även [LIMITATIONS.md](../LIMITATIONS.md).

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

#### Show Facebook and Instagram on the website

The Facebook and Instagram card is on the home page and on the Contact page. Everything is set in the
**Klubbinfo** tab. A feed is only loaded when the visitor clicks *Visa* ("Show") (for privacy).

**Facebook**

| The club has… | Write in *Facebook* | The website shows |
| --- | --- | --- |
| A **group** | The group's address, e.g. `https://www.facebook.com/groups/251477413001` | A "Join the Facebook group" button. Facebook doesn't allow groups to be shown as a feed. |
| A **page** | The page's address, e.g. `https://www.facebook.com/klubbensida` | The page's latest posts as a feed |

So for a feed the club needs a Facebook *page*, and someone posting there. The page must not have
age or country restrictions, or the feed will be empty. See also [LIMITATIONS.md](../LIMITATIONS.md).

**Instagram**

Write the club's **account name** in *Instagram*, e.g. `ronnebyboxing`, `@ronnebyboxing` or the link to the profile.
Then a link "Öppna på Instagram" ("Open on Instagram") is shown. A link to a **location** (`…/explore/locations/…`), a post or a reel doesn't work. It must be an account.

To also show the **pictures** as a feed, a free account with Behold is needed:

1. Make the club's Instagram a **professional account** (business or creator). In the Instagram app:
   *Settings → Account type and tools → Switch to professional account* (the names may differ slightly
   between versions). It's free.
2. Create an account at [behold.so](https://behold.so) (the free tier is enough) and connect the club's Instagram.
3. Create a feed. Choose a **square** layout, e.g. 2×2 or 3×3, so it fits next to the
   Facebook card. A taller feed can be scrolled.
4. Open the feed → **Embed code** in the side menu. There you'll see e.g. `feed-id="L7mnQCHvZeMZLbNXmJll"`.
   Copy only the part inside the quotes.
5. Write it in *Behold* in Klubbinfo. *Instagram* must also be filled in, otherwise "Kommer snart" ("Coming soon") is shown.

**Check:** wait about 5 minutes, open the Contact page and click *Visa*. If nothing shows in a browser with
an ad blocker (e.g. Firefox or Brave with protection on), it's the blocker, not the website. Try another
browser. The links under the feed always work.

## Bilder

### Bilder
<!-- id: bilder · flikar: Tränare, Sponsorer, Evenemang · sök: foto, Drive, delningslänk, logga -->

Tränarbilder och sponsorlogotyper ligger i en mapp på klubbens Google Drive, inte i kodförrådet.
Så kan du som redigerare lägga till, byta eller ta bort en bild själv:

1. Ladda upp bilden till klubbens bildmapp på Drive (kräver ett Google-konto; använd klubbens konto så att
   filen ägs av klubben, inte av en privatperson).
2. Högerklicka på filen → **Dela** → ändra till **Alla som har länken → Läsare** (viktigt, annars kan hemsidan
   inte visa bilden).
3. Klicka på **Kopiera länk**.
4. Klistra in länken i kolumnen *Bild* på tränarens rad i fliken **Tränare**, eller i kolumnen *Logga* på
   sponsorens rad i fliken **Sponsorer**. Klistra **aldrig** in länken till klubbens eget kalkylark — bara länkar till bildfiler på Drive.

Bilden syns på hemsidan inom ca 5 minuter. Saknas bilden eller länken är fel visas tränarens initialer
eller sponsorns namn som text istället.

- **Byta bild:** ladda upp en ny fil och klistra in den nya länken, eller använd *Hantera versioner → Ladda upp
  ny version* på samma fil (samma länk, men Google kan visa den gamla bilden en stund på grund av cache).
- **Ta bort bild:** ta bort länken ur *Bild*-kolumnen, eller radera filen på Drive.
- Admin-sidan varnar om någon bild inte laddas.

#### Images

Coach photos and sponsor logos live in a folder on the club's Google Drive, not in the code repository.
So you as an editor can add, change or remove an image yourself:

1. Upload the image to the club's image folder on Drive (requires a Google account; use the club's account so
   the file is owned by the club, not by a private person).
2. Right-click the file → **Share** → change to **Anyone with the link → Viewer** (important, otherwise the
   website can't show the image).
3. Click **Copy link**.
4. Paste the link in the *Bild* column on the coach's row in the **Tränare** tab, or in the *Logga* column on
   the sponsor's row in the **Sponsorer** tab. **Never** paste the link to the club's own sheet — only links to
   image files on Drive.

The image appears on the website within about 5 minutes. If the image is missing or the link is wrong, the
coach's initials or the sponsor's name are shown as text instead.

- **Change image:** upload a new file and paste the new link, or use *Manage versions → Upload new version* on
  the same file (same link, but Google may show the old image for a while because of cache).
- **Remove image:** remove the link from the *Bild* column, or delete the file on Drive.
- The admin page warns if any image doesn't load.
