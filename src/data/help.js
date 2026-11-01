// Pure parsing/search/rendering for docs/editor-help.md. No Vue, no imports from app code,
// so it runs in plain node for evidence scripts (same pattern as warnings.js).

// D6: lowercase, fold Swedish letters (NFD + strip combining marks, so å/ä → a, ö → o),
// collapse whitespace. Used for all search matching.
export function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Ascii slug used when an entry has no explicit id comment: same idea as GitHub's anchors
// but folded, so warning links (D4) stay stable when a title is reworded in Swedish letters.
export function slugOf(title) {
  return normalize(title).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Parse the metadata comment under a ### heading: <!-- id: x · flikar: A, B · sök: a, b · fäst -->
function parseMeta(comment) {
  const meta = { id: null, tabs: [], synonyms: [], pinned: false }
  for (const part of comment.split('·')) {
    if (part.trim() === 'fäst') { meta.pinned = true; continue }
    const m = part.match(/^\s*([^\s:]+)\s*:\s*(.*)$/)
    if (!m) continue
    const [, key, value] = m
    if (key === 'id') meta.id = value.trim()
    else if (key === 'flikar') meta.tabs = value.split(',').map((t) => t.trim()).filter(Boolean)
    else if (key === 'sök') meta.synonyms = value.split(',').map((t) => t.trim()).filter(Boolean)
  }
  return meta
}

// Strip markdown to plain text (for the search index).
function plainText(md) {
  return md
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`|]/g, ' ')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-•]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
}

// docs/editor-help.md → [{ id, title, group, tabs, synonyms, pinned, text, enTitle, textEn,
//   searchText, searchTextEn }], file order. A `#### <English title>` section inside an entry is
// its English variant (D11); without one, English falls back to the Swedish text.
export function parseHelp(md) {
  const entries = []
  let group = ''
  let current = null
  let en = false
  for (const line of md.split('\n')) {
    const h2 = line.match(/^##\s+(.*)$/)
    const h3 = line.match(/^###\s+(.*)$/)
    const h4 = line.match(/^####\s+(.*)$/)
    if (h2) {
      group = h2[1].trim()
      current = null
      continue
    }
    if (h3) {
      current = { id: null, title: h3[1].trim(), group, tabs: [], synonyms: [], pinned: false, text: '', enTitle: '', textEn: '' }
      entries.push(current)
      en = false
      continue
    }
    if (h4 && current) {
      current.enTitle = h4[1].trim()
      en = true
      continue
    }
    if (!current) continue
    const meta = line.match(/^\s*<!--\s*(.*?)\s*-->/)
    if (meta && !en && !current.id && entries[entries.length - 1] === current && current.text === '') {
      Object.assign(current, parseMeta(meta[1]))
      if (!current.id) current.id = slugOf(current.title)
      continue
    }
    if (en) current.textEn += line + '\n'
    else current.text += line + '\n'
  }
  for (const e of entries) {
    if (!e.id) e.id = slugOf(e.title)
    e.text = e.text.trim()
    e.textEn = e.textEn.trim()
    e.searchText = normalize(`${e.title} ${plainText(e.text)} ${e.synonyms.join(' ')}`)
    e.searchTextEn = normalize(`${e.enTitle || e.title} ${plainText(e.textEn || e.text)} ${e.synonyms.join(' ')}`)
  }
  return entries
}

// D6/AC4–AC7: every query word must appear in the entry's normalized search text, any order.
// `tab` filters to entries for that sheet tab (or `alla`); null/'' shows all.
// `lang` picks the search text: 'en' searches the English variant (D11), otherwise Swedish.
export function searchHelp(entries, query, tab, lang) {
  let result = entries
  if (tab) result = result.filter((e) => e.tabs.includes(tab) || e.tabs.includes('alla'))
  const words = normalize(query ?? '').split(' ').filter(Boolean)
  if (words.length > 0) {
    result = result.filter((e) => words.every((w) => (lang === 'en' ? e.searchTextEn : e.searchText).includes(w)))
  }
  return result
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Inline markdown after HTML escaping: links, bold, italic, code.
function renderInline(s) {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, href) => {
      // In-dialog entry links (#slug) jump to the entry; repo files open on GitHub in a new tab.
      if (href.startsWith('#')) return `<a href="${href}" class="help-entry-link" data-slug="${href.slice(1)}">${text}</a>`
      const isRepoFile = /^[^/]+\.(md|txt)$/.test(href) || href.startsWith('../')
      if (isRepoFile) {
        const path = href.replace(/^\.\.\//, '')
        return `<a href="https://github.com/ronnebybk/ronneby-bk/blob/main/${path}" target="_blank" rel="noopener">${text}</a>`
      }
      return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

// B1: the small markdown subset the help file uses — paragraphs, bullet/numbered lists, tables,
// and inline markup. HTML is escaped first, so help text can never inject markup.
export function renderMarkdown(md) {
  const lines = escapeHtml(md).split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { i++; continue }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const rows = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
        if (!cells.every((c) => /^:?-{3,}:?$/.test(c))) rows.push(cells)
        i++
      }
      const [head, ...body] = rows
      blocks.push(
        '<table><thead><tr>' + head.map((c) => `<th>${renderInline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        body.map((r) => '<tr>' + r.map((c) => `<td>${renderInline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>'
      )
      continue
    }
    if (/^\s*[-•]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*[-•]\s+/.test(lines[i])) {
        items.push('<li>' + renderInline(lines[i].replace(/^\s*[-•]\s+/, '')) + '</li>')
        i++
      }
      blocks.push('<ul>' + items.join('') + '</ul>')
      continue
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push('<li>' + renderInline(lines[i].replace(/^\s*\d+[.)]\s+/, '')) + '</li>')
        i++
      }
      blocks.push('<ol>' + items.join('') + '</ol>')
      continue
    }
    // Always take the first line: the stop regex also matches lines no block above handles
    // (e.g. a table row without a trailing pipe, or a heading), which would otherwise loop forever.
    const para = []
    do {
      para.push(lines[i].trim())
      i++
    } while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|\s*\||\s*[-•]\s|\s*\d+[.)]\s)/.test(lines[i]))
    blocks.push('<p>' + renderInline(para.join(' ')) + '</p>')
  }
  return blocks.join('\n')
}
