<script setup>
import { computed } from 'vue'
import { consent, revokeConsent } from '../data/consent.js'
import { useI18n } from '../i18n/index.js'
import { state } from '../data/store.js'
import config from '../config.js'

// Draft text – to be reviewed by the board before launch.
const { t, locale } = useI18n()
const email = computed(() => state.club.email)
</script>

<template>
  <div class="container page prose">
    <h1>{{ t('privacy.title') }}</h1>

    <template v-if="locale === 'sv'">
      <p>{{ config.clubName }} värnar om din integritet. Här beskriver vi vilka uppgifter hemsidan hanterar.</p>

      <h2>Cookies och lagring</h2>
      <p>
        Hemsidan använder inga egna cookies och ingen besöksstatistik. Din webbläsare sparar några få inställningar
        lokalt: valt språk, en kopia av innehållet från kalkylarket (så att sidan fungerar även om Google inte kan
        nås), vilka anslag du har stängt och om du har valt att visa Facebook/Instagram. Inget av detta skickas
        till oss.
      </p>

      <h2>Facebook och Instagram</h2>
      <p>
        Våra flöden från Facebook och Instagram laddas först när du klickar på “Visa”. Då kan Meta sätta cookies och
        se att du besökt sidan, enligt Metas egen integritetspolicy.
      </p>

      <h2>Schemat</h2>
      <p>Schemat hämtas från ett Google-kalkylark. Google kan då se din IP-adress, enligt Googles integritetspolicy.</p>

      <h2>Dokument</h2>
      <p>
        Länkarna till klubbens dokument (regler, stadgar, protokoll) går oftast till Google Drive. När du klickar på en
        sådan länk kan Google se din IP-adress, enligt Googles integritetspolicy.
      </p>

      <h2>Tränare</h2>
      <p>Tränarbilder kan laddas från Google Drive. Google kan då se din IP-adress, enligt Googles integritetspolicy.</p>
      <p>Namn, bild och kontaktuppgifter till tränare publiceras endast med deras samtycke.</p>

      <h2>Resultat</h2>
      <p>
        Tävlingsresultat publiceras på sidan Resultat endast med samtycke från den tävlande (för juniorer
        från en vårdnadshavare), vilket är den rättsliga grunden. För juniorer visas bara förnamnet, även om
        hela namnet råkat skrivas in i kalkylarket. Vill du att ett resultat ska tas bort? Mejla oss, så tar
        vi bort raden ur kalkylarket. Tänk på att det kan dröja upp till ca 5 minuter innan Google publicerar
        om, och att en borttagen rad kan finnas kvar i veckovisa säkerhetskopior i upp till 90 dagar.
      </p>

      <h2>Kontakt</h2>
      <p v-if="email">
        Frågor om dina uppgifter? Mejla <a :href="`mailto:${email}`">{{ email }}</a>.
      </p>
      <p v-else>Frågor om dina uppgifter? Kontakta styrelsen.</p>
    </template>

    <template v-else>
      <p>{{ config.clubName }} respects your privacy. This page describes what data the website handles.</p>

      <h2>Cookies and storage</h2>
      <p>
        The website sets no cookies of its own and uses no visitor analytics. Your browser stores a few settings
        locally: your chosen language, a copy of the sheet content (so the site works if Google can't be reached),
        which notices you have closed, and whether you chose to show Facebook/Instagram. None of this is sent
        to us.
      </p>

      <h2>Facebook and Instagram</h2>
      <p>
        Our Facebook and Instagram feeds are only loaded when you click “Show”. Meta may then set cookies and see that
        you visited the page, according to Meta's own privacy policy.
      </p>

      <h2>The schedule</h2>
      <p>The schedule is loaded from a Google spreadsheet. Google may see your IP address, according to Google's privacy policy.</p>

      <h2>Documents</h2>
      <p>
        Links to the club's documents (rules, statutes, minutes) usually go to Google Drive. When you click such a link,
        Google may see your IP address, according to Google's privacy policy.
      </p>

      <h2>Coaches</h2>
      <p>Coach photos may be loaded from Google Drive. Google may see your IP address, according to Google's privacy policy.</p>
      <p>Coaches' names, photos and contact details are only published with their consent.</p>

      <h2>Results</h2>
      <p>
        Competition results are published on the Results page only with the consent of the competitor (for
        juniors, of a guardian), which is the legal basis. For juniors only the first name is shown, even if
        the full name was typed into the spreadsheet by mistake. Want a result removed? Email us and we will
        delete the row from the spreadsheet. Note that it can take up to about 5 minutes before Google
        republishes, and that a deleted row may remain in weekly backups for up to 90 days.
      </p>

      <h2>Contact</h2>
      <p v-if="email">
        Questions about your data? Email <a :href="`mailto:${email}`">{{ email }}</a>.
      </p>
      <p v-else>Questions about your data? Contact the board.</p>
    </template>

    <p v-if="consent.facebook || consent.instagram">
      <button type="button" class="btn btn-outline" @click="revokeConsent">
        {{ locale === 'sv' ? 'Dölj Facebook/Instagram igen' : 'Hide Facebook/Instagram again' }}
      </button>
    </p>
  </div>
</template>

<style scoped>
.prose {
  max-width: 760px;
}

.prose h2 {
  font-size: 1.3rem;
  margin-top: 28px;
}
</style>
