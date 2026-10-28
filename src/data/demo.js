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
  faq: ['Fråga', 'Fråga (EN)', 'Svar', 'Svar (EN)'],
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
    'Meddelande': 'Schema och grupper hittar du på #/schema',
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

// Sections for the Prova på page, in page order. Keep the wording in step with trial.sections in
// src/i18n/sv.js and en.js. One SV-only row (English falls back to the Swedish sheet text) and one
// EN-only row (the parser must skip it) stay on purpose.
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
    'Text': 'Kom gärna några minuter innan passet börjar och säg till en tränare att du är ny.\n\nVi visar dig vad du behöver veta, och du kan ta det i din egen takt.',
    'Text (EN)': 'Arrive a few minutes before the session and tell a coach that you are new.\n\nWe will show you what you need to know, and you can take it at your own pace.',
  },
  {
    'Rubrik': 'Du behöver inte vara i form',
    'Rubrik (EN)': "You don't need to be fit",
    'Text': 'Alla börjar någonstans. Säg till om du behöver ta en paus.',
    'Text (EN)': 'Everyone starts somewhere. Tell us if you need to take a break.',
  },
  {
    'Rubrik': 'Föräldrar och vänner',
    'Text': 'Vill du följa med och titta? Fråga en tränare på plats.',
  },
  {
    'Rubrik': 'Vad kostar det?',
    'Rubrik (EN)': 'What does it cost?',
    'Text': 'Att prova på är gratis. Medlemskap och priser hittar du på #/grupper.',
    'Text (EN)': 'Trying a session is free. Membership and prices are under #/grupper.',
  },
  {
    'Rubrik': 'Hur tar jag mig dit?',
    'Rubrik (EN)': 'How do I get there?',
    'Text': 'Lokalen och adressen hittar du under #/kontakt.',
    'Text (EN)': 'The venue and address are under #/kontakt.',
  },
  {
    'Rubrik (EN)': 'English-only row',
    'Text (EN)': 'This row has no Swedish text and must be skipped.',
  },
]

// The three questions from the issue with placeholder answers, plus rows that exercise the page:
// English missing for the answer only (per-cell fallback), a link, paragraphs and a list, and two
// incomplete rows that must be skipped.
export const faq = [
  {
    'Fråga': 'Behöver jag egna handskar?',
    'Fråga (EN)': 'Do I need my own gloves?',
    'Svar':
      'Du kan låna handskar av klubben de första gångerna. Har du egna är det bra, men köp inget förrän du har provat.',
    'Svar (EN)':
      'You can borrow gloves from the club for your first few sessions. Your own are nice to have, but do not buy anything before you have tried.',
  },
  {
    'Fråga': 'Får föräldrar titta på?',
    'Fråga (EN)': 'Can parents watch?',
    'Svar': 'Ja, föräldrar är välkomna att sitta med och titta på träningen.',
    // No English answer on purpose: the English page falls back to Swedish for this cell only.
    'Svar (EN)': '',
  },
  {
    'Fråga': 'Finns det någon åldersgräns?',
    'Fråga (EN)': 'Is there an age limit?',
    'Svar':
      'Vi har grupper från 8 år och uppåt:\n- Knattar: 8–12 år\n- Nybörjare: från 13 år\n- Tävling: från 15 år\n\nÄr du osäker på vilken grupp som passar? Hör av dig till en tränare.',
    'Svar (EN)':
      'We have groups from age 8 and up:\n- Kids: 8–12\n- Beginners: from 13\n- Competition: from 15\n\nNot sure which group suits you? Talk to a coach.',
  },
  {
    'Fråga': 'Hur anmäler jag mig?',
    'Fråga (EN)': 'How do I sign up?',
    'Svar':
      'Kom förbi på ett pass och prova på. Frågor kan du ställa i vår Facebookgrupp: https://www.facebook.com/groups/251477413001',
    'Svar (EN)':
      'Drop by a session and give it a try. You can ask questions in our Facebook group: https://www.facebook.com/groups/251477413001',
  },
  // Skipped: an answer without a question.
  { 'Fråga': '', 'Fråga (EN)': '', 'Svar': 'Det här svaret har ingen fråga.', 'Svar (EN)': '' },
  // Skipped: a question without an answer.
  { 'Fråga': 'Rad som saknar svar', 'Fråga (EN)': 'Row without an answer', 'Svar': '', 'Svar (EN)': '' },
]
