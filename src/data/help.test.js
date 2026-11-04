import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { parseHelp, searchHelp, renderMarkdown, normalize, slugOf } from './help.js'

const INLINE = `# Hjälp

## Komma igång

### Öppna admin-sidan
<!-- id: oppna-admin · flikar: alla · sök: admin, login -->
Öppna sidan och skriv lösenordet.

#### Open the admin page
Open the page and enter the password.

### Lägga till ett pass
<!-- flikar: schema -->
Skriv dag och tid.

## Schemat

### Ändra en tid
Ändra i cellern.
`

describe('parseHelp', () => {
  it('parses groups, entries, meta comments and English variants', () => {
    const entries = parseHelp(INLINE)
    expect(entries.map((e) => e.group)).toEqual(['Komma igång', 'Komma igång', 'Schemat'])
    const [first] = entries
    expect(first).toMatchObject({
      id: 'oppna-admin',
      title: 'Öppna admin-sidan',
      tabs: ['alla'],
      synonyms: ['admin', 'login'],
      pinned: false,
      enTitle: 'Open the admin page',
    })
    expect(first.text).toContain('lösenordet')
    expect(first.textEn).toContain('password')
    // No explicit id → slug from the folded title.
    expect(entries[1].id).toBe('lagga-till-ett-pass')
    expect(entries[2].group).toBe('Schemat')
  })

  it('builds normalized search text including synonyms', () => {
    const [first] = parseHelp(INLINE)
    expect(first.searchText).toContain('oppna admin-sidan')
    expect(first.searchText).toContain('login')
    expect(first.searchTextEn).toContain('open the admin page')
  })
})

describe('searchHelp', () => {
  const entries = parseHelp(INLINE)

  it('matches every query word in any order', () => {
    expect(searchHelp(entries, 'pass lägga', null, 'sv').map((e) => e.id)).toEqual(['lagga-till-ett-pass'])
    expect(searchHelp(entries, 'admin', null, 'sv')).toHaveLength(1)
  })

  it('filters by tab, with alla matching everything', () => {
    // Entries tagged "alla" match every tab filter.
    expect(searchHelp(entries, '', 'schema', 'sv').map((e) => e.id)).toEqual(['oppna-admin', 'lagga-till-ett-pass'])
    expect(searchHelp(entries, '', 'alla', 'sv').map((e) => e.id)).toEqual(['oppna-admin'])
    // No tab filter → all entries.
    expect(searchHelp(entries, '', null, 'sv')).toHaveLength(3)
  })

  it('searches the English variant in English', () => {
    expect(searchHelp(entries, 'password', null, 'en').map((e) => e.id)).toEqual(['oppna-admin'])
    // "lösenordet" is Swedish-only, so English search finds nothing.
    expect(searchHelp(entries, 'lösenordet', null, 'en')).toEqual([])
  })
})

describe('renderMarkdown', () => {
  it('renders paragraphs, lists and inline markup, escaping HTML first', () => {
    const html = renderMarkdown('Text med <b>farligt</b>.\n\n- **fet** sak\n- andra `kod`\n\n1. första\n2. andra')
    expect(html).toContain('<p>Text med &lt;b&gt;farligt&lt;/b&gt;.</p>')
    expect(html).toContain('<ul><li><strong>fet</strong> sak</li><li>andra <code>kod</code></li></ul>')
    expect(html).toContain('<ol><li>första</li><li>andra</li></ol>')
  })

  it('renders a table and links, with entry links kept in-dialog', () => {
    const html = renderMarkdown('| Kolumn | Värde |\n| --- | --- |\n| a | [länk](#oppna-admin) |\n\nSe [fil](../HOWTO.md).')
    expect(html).toContain('<table>')
    expect(html).toContain('<th>Kolumn</th>')
    expect(html).toContain('<a href="#oppna-admin" class="help-entry-link" data-slug="oppna-admin">länk</a>')
    expect(html).toContain('https://github.com/ronnebybk/ronneby-bk/blob/main/HOWTO.md')
  })
})

describe('normalize + slugOf', () => {
  it('folds Swedish letters and collapses whitespace', () => {
    expect(normalize('  ÅÄÖ  test ')).toBe('aao test')
    expect(slugOf('Lägga till ett pass!')).toBe('lagga-till-ett-pass')
  })
})

describe('the real docs/editor-help.md', () => {
  const entries = parseHelp(readFileSync(new URL('../../docs/editor-help.md', import.meta.url), 'utf8'))

  it('has entries, every one with a non-empty title and id', () => {
    expect(entries.length).toBeGreaterThan(10)
    for (const e of entries) {
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.id.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate ids', () => {
    const ids = entries.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
