# Store listing copy — Plainly

Source of truth for both store listings. Keep in step with `README.md`,
`PRIVACY.md` and `src/lib/brand.ts`.

---

## Name

**Plainly** (7 characters)

Previously "Better Copy Paste", which was close enough to several existing
listings that the Chrome Web Store could reasonably have flagged it.

## Summary (Chrome: 132 characters max)

> Copy and paste without formatting, or as clean HTML or Markdown. Strips tracking parameters from links.

*(103 characters.)*

## Category

- Chrome Web Store: **Workflow & Planning**
- Firefox Add-ons: **Productivity**, tags `clipboard`, `markdown`, `plain text`, `privacy`

## Full description

Paste text that looks like the document you are pasting into, not the page you
took it from.

Plainly gives you four actions, each available from a keyboard shortcut, the
right-click menu, or the toolbar button:

• **Copy without formatting** — the selection as plain text. Line breaks
  collapse into spaces by default, so a multi-line selection drops cleanly into
  a search box or an address bar. Turn that off if you would rather keep
  paragraphs.

• **Copy with clean formatting** — keeps what carries meaning (bold, italic,
  headings, lists, links, tables, code) and discards everything else: fonts,
  colours, sizes, backgrounds, spacing and stray markup.

• **Copy as Markdown** — converts the selection to Markdown, ready for a
  README, an issue, a wiki or your notes.

• **Paste without formatting** — inserts the clipboard as plain text wherever
  your caret is.

LINKS ARRIVE CLEAN

Copy a link out of a newsletter, a search result or a share sheet and it drags
a tail of campaign identifiers with it. Plainly removes them — utm_source,
gclid, fbclid, mc_eid, mkt_tok and the rest, plus the share identifiers
YouTube, Spotify, X, Instagram, Amazon, LinkedIn and Reddit append. Ordinary
query parameters are kept, so the link still works. This applies to all four
actions, including Markdown.

WHY IT WORKS WHERE OTHERS DO NOT

Sites like Google Docs and Word Online express bold and italic through CSS
rather than through real HTML tags, so tools that only look at the markup lose
your emphasis. Plainly reads the formatting the way the browser renders it,
which is why "clean formatting" and "Markdown" keep working on editors that
defeat simpler extensions.

It also handles the awkward cases: text selected inside form fields, content in
iframes, custom elements built on shadow DOM, and editors built with React or
Vue that ignore programmatic text insertion.

TEXT FROM AWKWARD SOURCES

• Rejoin hard-wrapped lines — repairs text wrapped by a PDF, a terminal or a
  plain-text email, including words split across a hyphen.
• Straighten typographic characters — curly quotes, ellipses and figure dashes
  become their ASCII equivalents. Em and en dashes are left alone: they carry
  meaning.
• Invisible junk — non-breaking spaces, zero-width joiners, soft hyphens and
  byte-order marks — is always removed.

MADE TO STAY OUT OF THE WAY

• Choose exactly which formatting survives, and which right-click entries appear.
• Pick your Markdown flavour: bullet marker, heading style, code fences, emphasis.
• A live before-and-after preview shows what your settings actually do.
• Confirmation is a small tick on the toolbar icon; errors explain themselves.
• Light and dark themes, following your browser.

PRIVACY

No accounts, no analytics, no telemetry, no network requests of any kind. Your
selection and your clipboard are converted on your own machine and never leave
it. Nothing you copy is stored — there is no clipboard history. The extension
requests no access to your websites: it can only read a tab at the moment you
invoke it, and never any other tab.

---

## Permission justifications

The Chrome Web Store requires a justification per permission.

| Permission | Justification |
| --- | --- |
| `activeTab` | Required to read the user's current text selection, and to insert text at the caret, in the tab where the user invoked the extension. Access is granted only by that user gesture and only for that tab. |
| `scripting` | Required to execute the selection-reading and text-insertion routines in the page the user invoked the extension on. No persistent content scripts are registered. |
| `contextMenus` | Required to add the extension's four copy/paste entries to the right-click menu. |
| `clipboardRead` | Required by the "Paste without formatting" feature, which reads the clipboard so it can strip formatting before inserting the text. |
| `clipboardWrite` | Required by the three copy features, which place the converted plain text, cleaned HTML, or Markdown on the clipboard. |
| `storage` | Required to persist the user's own settings. No browsing data or page content is stored. |
| `offscreen` | Required because a Manifest V3 service worker has no document and clipboard access needs one. Creates a hidden, empty extension document used only for clipboard access and HTML-to-Markdown conversion. It loads no remote content. |

**Host permissions:** none requested.

**Remote code:** none. All code is bundled in the package; nothing is fetched
or evaluated at runtime.

**Single purpose:** converting copied or pasted text to a cleaner form.

## Data-use disclosures

Answer **no** to every "Do you collect…" category. The extension collects no
personally identifiable information, health, financial, authentication,
personal communication, location, browsing-history or user-activity data, and
no website content leaves the device.

Certify all three:
- Not being sold to third parties, outside of approved use cases.
- Not being used or transferred for purposes unrelated to the item's core functionality.
- Not being used or transferred to determine creditworthiness or for lending purposes.

Privacy policy URL:
`https://github.com/Jeusto/copy-paste-without-formatting/blob/main/PRIVACY.md`

## Firefox data collection

`browser_specific_settings.gecko.data_collection_permissions.required` is
`["none"]`, which is what AMO now requires an add-on to declare.
Add-on ID: `plainly@jeusto.github.io` — AMO claims this permanently on first
submission, so it must be right before the first upload.

## Assets

| Asset | Size | Where it comes from |
| --- | --- | --- |
| Store icon | 128 × 128 PNG | `public/icon-128.png` — `pnpm run brand` ✅ committed |
| Small promo tile | 440 × 280 PNG | `pnpm run store-assets` |
| Marquee promo tile | 1400 × 560 PNG | Same script. **Optional**: Chrome only uses it for featured placement |
| Screenshots | 1280 × 800 PNG, at least one, up to five | **Capture by hand** |

Suggested screenshots, in order:

1. The toolbar popup, with its four actions and shortcut hints.
2. The options page, plain-text section, with the before/after preview visible.
3. A right-click menu on a selection in Google Docs.
4. A before/after of a paste into a plain-text field.
5. The options page in dark mode.

## Pre-publish checklist

- [ ] `pnpm run verify` clean.
- [ ] Bump `version` in `package.json` — the manifest reads it. Stores reject a
      re-upload at an existing version.
- [ ] Publish the repository so the privacy-policy URL resolves.
- [ ] Load `dist/` and `dist-firefox/` unpacked and run `store/smoke-test.md`.
- [ ] Confirm the Firefox add-on ID one last time — it cannot be changed after
      the first submission.
