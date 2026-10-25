# Known limitations

These are deliberate trade-offs for a setup with no server, no database and no editor accounts.
Planned improvements are tracked in [GitHub issues](https://github.com/ronnebybk/ronneby-bk/issues).

## Data entry

- **Bad rows are silently skipped.** If a *Schema* row can't be understood, it's left out instead of
  breaking the page, and nobody is told. Common causes:
  - Season name doesn't match *Säsonger* exactly.
  - Unknown day.
  - Time written like `17,30`.
  - Missing group.
- **Names are links between tabs.** Groups, coaches and seasons are matched by exact name. Renaming one
  in its own tab does **not** update *Schema*. Sessions then lose their colour and their place on
  the classes page, or disappear entirely if a season was renamed.
- **Dropdowns may only warn.** Depending on the validation setting, invalid values can still be entered.
  The dropdowns cover the first 300 rows.
- **No automatic season handover.** When no season covers today, the site shows the next upcoming
  season, or failing that, the most recent past one. If nobody adds a new season, an outdated schedule
  keeps showing.
- **No one-off changes.** There's no way to cancel a single session or mark holidays (e.g. "no
  training on 24 Dec") other than editing the weekly schedule or adding a note.

## Updates and availability

- **About 5 minutes' delay.** Google republishes the sheet periodically, so changes don't appear instantly.
- **Depends on Google.** If Google is unreachable or changes *Publish to web*, returning visitors see
  their cached copy, while first-time visitors see an error message instead of the schedule.
- **Requires JavaScript.** Without it, the page is blank.

## Editing

- **Phones:** editing a Google Sheet without signing in is clumsy on phones. On iPhone/Safari, and in
  strict privacy modes, the embedded sheet may not load at all. Fallback: *Öppna i Google Sheets*.
- **No roles or audit trail.** Every editor can change everything, and changes are anonymous.
  See [SECURITY.md](SECURITY.md).
- **Coach photos need a developer.** Images are added to the repo, not uploaded through the sheet.

## Visibility

- **Search engines** mainly index the start page. The schedule is loaded by JavaScript and the pages
  use `#/` addresses, so their content is unlikely to appear in search results.
- **No link previews yet.** Sharing the link on Facebook or Messenger shows no image or description.
- **Facebook and Instagram embeds** are often blocked by ad blockers and tracking protection. The profile
  links still work.

## Hosting and maintenance

- **Public repository** (free GitHub Pages). Nothing secret can live in the code.
- **GitHub Actions versions age.** The deploy workflow will eventually need version bumps, or it stops working.
- **Few people know the system.** Without a second maintainer, the club depends on one person.
  Keep [HOWTO.md](HOWTO.md) current.
