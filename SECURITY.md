# Security and privacy

A small club site with no server and no database. Security mostly comes down to **who can edit the
Google Sheet** and **keeping private data out of it**.

## What is public

Assume everything in this list can be read by anyone.

| What | Why it's public |
| --- | --- |
| This repository (code, docs, issues) | GitHub Pages on a free plan requires a public repo. |
| Everything in the Google Sheet, **including any tab added later** | *Publish to web* publishes the whole document as CSV. |
| `publishedId` and `gids` in `src/config.js` | Read-only links to the already-published data. Safe. |
| Coach names, roles, photos, phone numbers and emails entered in the sheet | Shown on the website. |

## What must stay private

| Secret | Gives | Where it may live |
| --- | --- | --- |
| The sheet's **edit ID** / admin link | Anonymous **edit** access to all site content | Editors' devices, sent privately (SMS, email). **Never** in the repo, issues, commits, screenshots or public chats. |
| The club Google account's login, password and recovery codes | Full control over the sheet and its sharing | With the board, e.g. in a password manager. Not in the repo. |
| GitHub accounts with access to the `ronnebybk` org | Changing and deploying the website | Each person's own account, with two-factor authentication on. |

**Never commit:** the edit ID, passwords or tokens, member lists, or personal data that isn't meant
for the website. If something slips in, deleting it in a new commit is not enough, because it stays
in the Git history. Treat it as leaked and rotate it.

## Rules for the sheet

1. **No private data.** No member lists, personal identity numbers, addresses, payments or health information. Ever, in any tab.
2. **Consent before publishing people.** Coaches agree to their name, photo and contact details being shown. Prefer club contact details over personal numbers. No photos of children without the parents' consent.
3. **Header rows protected** (*Data → Protect sheets and ranges*), so editors can't break the columns the site reads.

## How editing access works

- The sheet is shared as *Anyone with the link → Editor*, so editors need no Google account.
- The admin page (`/#/admin`) embeds the sheet. The edit ID comes from the admin link
  (`#/admin?k=…`), is stored in that browser's local storage, and is removed from the address bar.
- **Consequences:**
  - Anyone who has the link can edit or delete anything, anonymously. Edits show up as "Anonymous animal", so you can't see who made a change.
  - Anyone who can open an editor's browser can find the ID in it.
  - Version history (*File → Version history*) can restore any earlier state.

## Incidents

| Situation | Do this |
| --- | --- |
| Content vandalised or deleted | *File → Version history* → restore the last good version. Then consider rotating the link. |
| Admin link leaked, or an editor should lose access | Rotate it: [HOWTO.md → Replace a leaked admin link](HOWTO.md#replace-a-leaked-admin-link). |
| Club Google account compromised | Recover it via Google, change the password, check sharing and publishing settings, rotate the admin link, restore from version history or backup. |
| Private data was entered in the sheet | Delete it. It was public while published, and Google's published copy refreshes within minutes. Also remove it from version history if needed (make a clean copy and rotate). Inform the board, since it may need reporting under GDPR. |
| Secret committed to the repo | Rotate it immediately. Removing it from Git history alone does not make it safe. |

## Privacy (GDPR) overview

- **No cookies or analytics** are set by the site itself.
- **Local storage in the visitor's browser:**
  - `rbt-locale`: chosen language.
  - `rbt-data-v1`: cached copy of the published sheet (schedule, groups, coaches, seasons, notices and news), so the site works if Google can't be reached.
  - `rbt-dismissed-notices`: which notices the visitor has closed (message text and date window), so they stay closed in that browser.
  - `rbt-consent`: whether the visitor chose to show Facebook or Instagram.
  - `rbt-admin-key`: editors only. The edit ID.
- **Third parties:**
  - **Google:** each visit fetches the published sheet, so Google sees the visitor's IP address.
  - **Meta (Facebook, Instagram):** only loaded after the visitor clicks *Visa*.
  - **Behold:** only if the Instagram feed is enabled, and also only after the visitor clicks.
  - **Google Maps:** a plain link, not an embedded map.
- The visitor-facing policy is at `/#/integritet` (`src/views/PrivacyView.vue`). It's a draft until the board approves it.

## Routine checks (a few times a year)

- [ ] Sharing on the sheet is still *Anyone with the link → Editor* and nothing broader.
- [ ] No unexpected tabs or private data in the sheet.
- [ ] Back up the sheet: *File → Download → .xlsx*. Check that the weekly *Back up Google Sheet* runs are green (Actions tab).
- [ ] Review the org's members under *github.com/ronnebybk → People*. At least two owners, all with 2FA.
- [ ] The board still has working login and recovery details for the club Google account.
- [ ] Rotate the admin link if editors have changed.

## Reporting a problem

Found a security or privacy issue on the website? Contact the club board or the web admin directly.
Please don't open a public GitHub issue for it.
