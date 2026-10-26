// Downloads every tab of the published Google Sheet as CSV into a folder (default: sheet-backup/).
// Used by .github/workflows/backup-sheet.yml; also runnable locally: node scripts/backup-sheet.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import config from '../src/config.js'

const outDir = process.argv[2] ?? 'sheet-backup'
const publishedId = config.sheet.publishedId.match(/2PACX-[\w-]+/)?.[0]
if (!publishedId) {
  console.error('No publishedId in src/config.js – nothing to back up.')
  process.exit(1)
}

// File names match the tab names in the sheet, so restoring is "import file into tab of the same name".
const tabs = { seasons: 'Säsonger', groups: 'Grupper', schedule: 'Schema', coaches: 'Tränare', notices: 'Anslag' }

await mkdir(outDir, { recursive: true })
let failed = false

for (const [key, tabName] of Object.entries(tabs)) {
  const gid = config.sheet.gids[key]
  if (!gid) {
    console.log(`${tabName}: no gid configured, skipped`)
    continue
  }
  const url = `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?gid=${gid}&single=true&output=csv`
  try {
    const response = await fetch(url)
    const text = await response.text()
    // An unpublished sheet answers with an HTML page instead of CSV.
    if (!response.ok || text.trimStart().startsWith('<')) throw new Error(`HTTP ${response.status}, not CSV`)
    await writeFile(join(outDir, `${tabName}.csv`), text)
    console.log(`${tabName}: ${text.length} bytes`)
  } catch (error) {
    console.error(`${tabName}: FAILED (${error.message})`)
    failed = true
  }
}

process.exit(failed ? 1 : 0)
