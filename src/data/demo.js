// Example data in exactly the same shape as the Google Sheet tabs (column header → value).
// Used until the sheet is connected, and to generate the sheet template (npm run sheet-template).

export const columns = {
  seasons: ['Säsong', 'Säsong (EN)', 'Från', 'Till'],
  groups: ['Grupp', 'Grupp (EN)', 'Ålder', 'Beskrivning', 'Beskrivning (EN)', 'Pris (kr)', 'Prisperiod'],
  schedule: ['Säsong', 'Dag', 'Start', 'Slut', 'Grupp', 'Tränare', 'Notering', 'Notering (EN)'],
  coaches: ['Namn', 'Roll', 'Roll (EN)', 'Grupper', 'Telefon', 'E-post', 'Bild'],
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
  { 'Säsong': 'Höst/vinter 26/27', 'Dag': 'Onsdag', 'Start': '18:00', 'Slut': '19:00', 'Grupp': 'Motionsboxning', 'Tränare': 'Sara Exempel' },
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
