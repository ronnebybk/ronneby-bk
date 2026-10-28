// Example data in exactly the same shape as the Google Sheet tabs (column header → value).
// Used until the sheet is connected. sheet-template/ has the same columns.

export const columns = {
  seasons: ['Säsong', 'Säsong (EN)', 'Från', 'Till'],
  groups: ['Grupp', 'Grupp (EN)', 'Ålder', 'Beskrivning', 'Beskrivning (EN)', 'Pris (kr)', 'Prisperiod'],
  schedule: ['Säsong', 'Dag', 'Start', 'Slut', 'Grupp', 'Tränare', 'Notering', 'Notering (EN)'],
  coaches: ['Namn', 'Roll', 'Roll (EN)', 'Grupper', 'Telefon', 'E-post', 'Bild'],
  notices: ['Meddelande', 'Meddelande (EN)', 'Visa från', 'Visa till', 'Typ', 'Rubrik', 'Rubrik (EN)'],
  club: ['Fält', 'Värde', 'Värde (EN)'],
  trial: ['Rubrik', 'Rubrik (EN)', 'Text', 'Text (EN)'],
}

export const seasons = [
  { 'Säsong': 'Höst/vinter 26/27', 'Säsong (EN)': 'Autumn/winter 26/27', 'Från': '2026-08-17', 'Till': '2027-06-06' },
  { 'Säsong': 'Sommar 2027', 'Säsong (EN)': 'Summer 2027', 'Från': '2027-06-07', 'Till': '2027-08-15' },
]

export const groups = [
  {
    'Grupp': 'Knattar',
    'Grupp (EN)': 'Kids',
    'Ålder': '8–12',
    'Beskrivning': 'Lek, koordination och grundläggande boxningsteknik. Ingen sparring.',
    'Beskrivning (EN)': 'Play, coordination and basic boxing technique. No sparring.',
    'Pris (kr)': '600',
    'Prisperiod': 'termin',
  },
  {
    'Grupp': 'Nybörjare',
    'Grupp (EN)': 'Beginners',
    'Ålder': '13+',
    'Beskrivning': 'För dig som är ny. Vi går igenom fotarbete, slag och försvar i lugnt tempo.',
    'Beskrivning (EN)': 'For newcomers. Footwork, punches and defence at a calm pace.',
    'Pris (kr)': '900',
    'Prisperiod': 'termin',
  },
  {
    'Grupp': 'Motionsboxning',
    'Grupp (EN)': 'Fitness boxing',
    'Ålder': '16+',
    'Beskrivning': 'Tuff konditionsträning med säck och mittsar. Passar alla nivåer.',
    'Beskrivning (EN)': 'Tough conditioning with bags and pads. Suits all levels.',
    'Pris (kr)': '1100',
    'Prisperiod': 'termin',
  },
  { 'Grupp': 'Motionsboxning', 'Pris (kr)': '2000', 'Prisperiod': 'år' },
  {
    'Grupp': 'Tävling',
    'Grupp (EN)': 'Competition',
    'Ålder': '15+',
    'Beskrivning': 'För dig som vill tävla. Sparring och matchförberedelser, efter överenskommelse med tränare.',
    'Beskrivning (EN)': 'For those who want to compete. Sparring and fight preparation, by agreement with a coach.',
    'Pris (kr)': '1300',
    'Prisperiod': 'termin',
  },
]

export const schedule = [
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Måndag', 'Start': '17:00', 'Slut': '18:00', 'Grupp': 'Knattar', 'Tränare': 'Anna Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Måndag', 'Start': '18:00', 'Slut': '19:30', 'Grupp': 'Nybörjare', 'Tränare': 'Erik Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Tisdag', 'Start': '18:30', 'Slut': '20:00', 'Grupp': 'Tävling', 'Tränare': 'Erik Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Onsdag', 'Start': '17:00', 'Slut': '18:00', 'Grupp': 'Knattar', 'Tränare': 'Anna Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Onsdag', 'Start': '18:00', 'Slut': '19:00', 'Grupp': 'Motionsboxning, Nybörjare', 'Tränare': 'Sara Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Torsdag', 'Start': '18:00', 'Slut': '19:30', 'Grupp': 'Nybörjare', 'Tränare': 'Erik Exempel' },
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Torsdag', 'Start': '19:30', 'Slut': '21:00', 'Grupp': 'Tävling', 'Tränare': 'Erik Exempel' },
  {
    'Säsong': 'Höst/vinter 26/27',
    'Dag': 'Söndag',
    'Start': '10:00',
    'Slut': '11:00',
    'Grupp': 'Motionsboxning',
    'Tränare': 'Sara Exempel',
    'Notering': 'Öppet för alla grupper',
    'Notering (EN)': 'Open to all classes',
  },
  { 'Säsong': 'Sommar 2027', 'Dag': 'Tisdag', 'Start': '18:00', 'Slut': '19:30', 'Grupp': 'Motionsboxning', 'Tränare': 'Sara Exempel', 'Notering': 'Utomhus om vädret tillåter', 'Notering (EN)': 'Outdoors, weather permitting' },
  { 'Säsong': 'Sommar 2027', 'Dag': 'Torsdag', 'Start': '18:00', 'Slut': '19:30', 'Grupp': 'Tävling', 'Tränare': 'Erik Exempel' },
]

export const coaches = [
  { 'Namn': 'Erik Exempel', 'Roll': 'Huvudtränare', 'Roll (EN)': 'Head coach', 'Grupper': 'Nybörjare, Tävling', 'Telefon': '', 'E-post': '', 'Bild': '' },
  { 'Namn': 'Anna Exempel', 'Roll': 'Tränare', 'Roll (EN)': 'Coach', 'Grupper': 'Knattar', 'Telefon': '', 'E-post': '', 'Bild': '' },
  { 'Namn': 'Sara Exempel', 'Roll': 'Tränare', 'Roll (EN)': 'Coach', 'Grupper': 'Motionsboxning', 'Telefon': '', 'E-post': '', 'Bild': '' },
]

// One active with EN and no dates, one active SV-only with a link, plus expired, future and
// unreadable-date rows that the banner must leave out.
export const notices = [
  {
    'Meddelande': 'Välkommen till höstens träningar! Nya deltagare är välkomna att prova på.',
    'Meddelande (EN)': 'Welcome to the autumn sessions! New members are welcome to try a class.',
  },
  {
    'Meddelande': 'Schema och grupper hittar du på https://ronnebybk.github.io/ronneby-bk/#/schema',
  },
  {
    'Meddelande': 'Inställd träning på grund av sjukdom.',
    'Visa till': '2026-10-25',
  },
  {
    'Meddelande': 'Höstlov – ingen träning vecka 45.',
    'Visa från': '2026-11-02',
    'Visa till': '2026-11-08',
  },
  {
    'Meddelande': 'Anslag med ett datum som inte går att läsa.',
    'Visa från': 'nästa vecka',
  },
  // News: two dated (shown newest first), one SV-only without a date or headline, plus expired,
  // future and unknown-type rows that must not show. Dates are far off so the cases don't go stale.
  {
    'Typ': 'Nyhet',
    'Rubrik': 'Ny nybörjargrupp i januari',
    'Rubrik (EN)': 'New beginner group in January',
    'Meddelande': 'Vi startar en extra nybörjargrupp på lördagar. Anmäl intresse till en tränare.',
    'Meddelande (EN)': 'We are starting an extra beginner group on Saturdays. Tell a coach if you are interested.',
    'Visa från': '2026-10-01',
  },
  {
    'Typ': 'Nyhet',
    'Rubrik': 'Tre medaljer på DM',
    'Rubrik (EN)': 'Three medals at the district championship',
    'Meddelande': 'Grattis till våra tävlingsboxare som tog ett guld och två brons!',
    'Meddelande (EN)': 'Congratulations to our competitors on one gold and two bronze medals!',
    'Visa från': '2026-09-14',
  },
  {
    'Typ': 'Nyhet',
    'Meddelande': 'Bilder från sommarlägret finns i Facebookgruppen: https://www.facebook.com/groups/251477413001',
  },
  {
    'Typ': 'Nyhet',
    'Rubrik': 'Gammal nyhet som har gått ut',
    'Visa från': '2000-01-01',
    'Visa till': '2000-01-31',
  },
  {
    'Typ': 'Nyhet',
    'Rubrik': 'Nyhet som inte ska synas än',
    'Visa från': '2099-01-01',
  },
  {
    'Typ': 'Nyheter!',
    'Meddelande': 'Rad med en okänd typ som hoppas över.',
  },
]

// Every setting once, plus rows the parser must ignore: an unknown setting, a duplicate and an
// unsafe link. Instagram is pasted as a link to show that the handle is extracted.
export const club = [
  { 'Fält': 'Lokal', 'Värde': 'Exempelhallen' },
  { 'Fält': 'Gatuadress', 'Värde': 'Exempelgatan 1' },
  { 'Fält': 'Ort', 'Värde': 'Ronneby' },
  { 'Fält': 'E-post', 'Värde': 'info@example.com' },
  { 'Fält': 'Telefon', 'Värde': '070-000 00 00' },
  {
    'Fält': 'Bli medlem',
    'Värde': 'Kom förbi på ett pass och prova på. Anmälan och betalning görs på https://example.com/bli-medlem',
    'Värde (EN)': 'Drop by and try a session. Sign up and pay at https://example.com/bli-medlem',
  },
  { 'Fält': 'Facebook', 'Värde': 'https://www.facebook.com/groups/251477413001' },
  { 'Fält': 'Instagram', 'Värde': 'https://www.instagram.com/example/' },
  { 'Fält': 'Telefon', 'Värde': '070-111 11 11' },
  { 'Fält': 'Fax', 'Värde': 'Okänd inställning som hoppas över.' },
  { 'Fält': 'Behold', 'Värde': 'javascript:alert(1)' },
]

// Sections for the Prova på page, in page order: a bullet list, a link, one SV-only row (English
// falls back to the Swedish sheet text), plus an EN-only row the parser must skip.
export const trial = [
  {
    'Rubrik': 'Vad ska jag ha med mig?',
    'Rubrik (EN)': 'What should I bring?',
    'Text': 'Bekväma kläder och en vattenflaska räcker.\n\n- Träningskläder\n- Vattenflaska\n- Handduk\n\nHar du inga handskar? Fråga en tränare om att låna ett par.',
    'Text (EN)': 'Comfortable clothes and a water bottle are enough.\n\n- Training clothes\n- Water bottle\n- Towel\n\nNo gloves? Ask a coach about borrowing a pair.',
  },
  {
    'Rubrik': 'Första gången',
    'Rubrik (EN)': 'Your first time',
    'Text': 'Kom ungefär 15 minuter innan passet börjar, så hinner vi visa dig runt.\n\nPasset börjar med uppvärmning och vi går igenom grunderna i lugn takt. Du bestämmer själv hur hårt du vill köra.',
    'Text (EN)': 'Arrive about 15 minutes before the session so we have time to show you around.\n\nEvery session starts with a warm-up, and we go through the basics at a calm pace. You decide how hard you want to train.',
  },
  {
    'Rubrik': 'Du behöver inte vara i form',
    'Rubrik (EN)': "You don't need to be fit",
    'Text': 'Alla börjar någonstans. Träningen anpassas efter dig, och du kan ta pauser när du behöver.',
    'Text (EN)': 'Everyone starts somewhere. Training is adapted to you, and you can take breaks whenever you need.',
  },
  {
    'Rubrik': 'Föräldrar och vänner',
    'Text': 'Det går bra att komma med och titta på ett pass. Fråga gärna en tränare på plats om du undrar något.',
  },
  {
    'Rubrik': 'Vad kostar det?',
    'Rubrik (EN)': 'What does it cost?',
    'Text': 'Att prova på är gratis. Vill du fortsätta hittar du medlemskap och priser på gruppsidan: https://ronnebybk.github.io/ronneby-bk/#/grupper',
    'Text (EN)': 'Trying a session is free. If you want to continue, membership and prices are on the groups page: https://ronnebybk.github.io/ronneby-bk/#/grupper',
  },
  {
    'Rubrik': 'Hur tar jag mig dit?',
    'Rubrik (EN)': 'How do I get there?',
    'Text': 'Lokalen och adressen hittar du på kontaktsidan: https://ronnebybk.github.io/ronneby-bk/#/kontakt',
    'Text (EN)': 'The venue and address are on the contact page: https://ronnebybk.github.io/ronneby-bk/#/kontakt',
  },
  {
    'Rubrik (EN)': 'English-only row',
    'Text (EN)': 'This row has no Swedish text and must be skipped.',
  },
]
