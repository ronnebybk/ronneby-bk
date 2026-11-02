// Vite plugin for #21: every absolute address comes from config.siteUrl, so the site can move
// to another domain by editing one setting (AC8). Replaces %SITE_URL% in index.html in dev and
// build and emits robots.txt + sitemap.xml on build. No network access, so the build also works
// offline (AC2).
import config from '../src/config.js'

export default function seo() {
  // Trailing slash optional: every emitted address assumes exactly one.
  const siteUrl = config.siteUrl.replace(/\/*$/, '/')
  return {
    name: 'seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url><loc>${siteUrl}</loc></url>\n` +
          `</urlset>\n`,
      })
    },
  }
}
