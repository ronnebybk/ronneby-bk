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
- **No per-session cancellation in the schedule.** You can announce a cancellation or holiday in
  *Anslag*, but the session still appears in the weekly schedule. Marking a specific session as
  cancelled is tracked in issue #20.
- **No news archive.** A news item disappears after its *Visa till* date or when its row is deleted.
  Older news can't be browsed on the site.

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
- **Coach photos load from Google Drive.** Editors paste a Drive share link into the *Bild* column. The
  thumbnail endpoint is unofficial and may change; if it does, the image falls back to initials and only
  `imageUrl` in `src/data/parse.js` needs updating. Uploading needs a Google account. Files in the repo
  (`public/coaches/`) still work as a fallback.

## Visibility

- **Search engines** mainly index the start page. The schedule is loaded by JavaScript and the pages
  use `#/` addresses, so their content is unlikely to appear in search results.
- **No link previews yet.** Sharing the link on Facebook or Messenger shows no image or description.
- **Facebook groups can't be embedded.** Facebook only offers a feed embed for **Pages**. The club
  currently has a group, so the site shows a "Gå med i Facebookgruppen" button instead of a feed.
  This was tested: the embed renders an empty frame for a group, even a public one.

  > **Question for the board:** do you want a live Facebook feed on the website?
  > If yes, the club needs a **Facebook Page** in addition to the group, **and someone has to post on it
  > regularly**. The feed only shows the Page's own posts, never the group's. An empty or outdated
  > feed looks worse than the current button.
  >
  > What it takes:
  > 1. A board member creates the Page from their own Facebook account (*Menu → Pages → Create new Page*),
  >    named *Ronneby Boxing Team*, with the logo from `design/` as profile picture.
  > 2. No age or country restrictions on the Page, or the embed stays empty.
  > 3. At least two admins (*Settings → Page access*), so it doesn't depend on one person.
  > 4. Optionally, link the group to the Page (*group Settings → Linked Pages*).
  > 5. Post public news there: results, cancellations, events. Member chat can stay in the group.
  > 6. Put the Page's address in the *Facebook* row of the *Klubbinfo* tab (see HOWTO.md, section 1).
  >    The group can still be linked from the Page or mentioned in a news item.
  >
  > Tracked in issue #7.
- **Facebook and Instagram embeds** are often blocked by ad blockers and tracking protection. The profile
  links still work.

## Hosting and maintenance

- **Public repository** (free GitHub Pages). Nothing secret can live in the code.
- **GitHub Actions versions age.** Dependabot proposes updates monthly, but someone has to merge them,
  or the workflows eventually stop working. npm packages are not updated automatically; GitHub's
  vulnerability alerts flag known security problems.
- **Few people know the system.** Without a second maintainer, the club depends on one person.
  Keep [HOWTO.md](HOWTO.md) current.
