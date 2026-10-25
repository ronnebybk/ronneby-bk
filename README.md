# Ronneby Boxing Team

Website for Ronneby Boxing Team: schedule, classes and prices, coaches, contact, and Facebook/Instagram.

- **Live:** https://ronnebybk.github.io/ronneby-bk/
- **Stack:** Vue 3 + Vite, hosted on GitHub Pages, deployed by GitHub Actions on every push to `main`
- **Content:** a Google Sheet (schedule, classes, prices, coaches, seasons), read by the site on every visit.
  Editors change it through the hidden admin page, with no account needed.
- **Languages:** Swedish (default) and English, switched with the flags in the header.

| Document | Contents |
| --- | --- |
| **[HOWTO.md](HOWTO.md)** | Editor instructions (Swedish), maintainer tasks, troubleshooting, initial setup |
| **[SECURITY.md](SECURITY.md)** | What's public and what's secret, sheet rules, incidents, GDPR overview |
| **[LIMITATIONS.md](LIMITATIONS.md)** | Known shortcomings and trade-offs |
| [Issues](https://github.com/ronnebybk/ronneby-bk/issues) | Backlog |

```sh
npm install
npm run dev
```

| Path | What |
| --- | --- |
| `src/config.js` | Club details, social links, Google Sheet IDs |
| `src/data/` | Loading and parsing the sheet; example data |
| `src/i18n/` | Swedish and English texts |
| `src/views/` | Pages |
| `sheet-template/` | Google Sheet template to import |
| `public/coaches/` | Coach photos |
| `design/` | Original logo |
