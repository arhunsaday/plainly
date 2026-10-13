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

## Chrome Web Store — Privacy practices

Paste each block into the matching field on the Privacy tab. Every field caps at
1,000 characters; each block below is well inside that. Plainly declares no host
permissions and no content scripts, so there is no host-permission field to fill.

### Single purpose description

> Plainly removes formatting from text as you copy or paste it. The user selects
> text and invokes one of four actions — copy as plain text, copy keeping only
> semantic formatting, copy as Markdown, or paste the clipboard as plain text.
> The extension converts the text and either puts the result on the clipboard or
> inserts it at the caret. That is its only function.

### activeTab justification

> The three copy actions read the user's current text selection; the paste
> action inserts text at the caret. Both happen in the tab the user invoked the
> extension on.
>
> activeTab is the narrowest way to do this. It grants access to one tab, only
> in response to the user's own gesture — clicking the toolbar button, choosing
> one of the extension's right-click entries, or pressing its keyboard shortcut
> — and only for that invocation. The extension requests no host permissions and
> registers no content scripts, so it has no access to any page until the user
> asks for one, and never to any other tab.

### contextMenus justification

> Adds the extension's four actions to the right-click menu: Copy without
> formatting, Copy with clean formatting, Copy as Markdown, and Paste without
> formatting. The copy entries appear only on a text selection, and the paste
> entry only in an editable field. Each can be turned off individually in the
> extension's settings. No other menu entries are created.

### clipboardRead justification

> Required by one feature: "Paste without formatting". To strip formatting from
> what the user is pasting, the extension has to read what is on the clipboard
> before inserting it.
>
> The clipboard is read only at the moment the user invokes that one action —
> never in the background, never on page load, and never for any other action.
> The text is converted in memory and inserted at the caret. It is not stored,
> logged, or kept in any history, and it is not transmitted anywhere: the
> extension makes no network requests of any kind.

### clipboardWrite justification

> Required by the three copy actions. Each converts the user's selection — to
> plain text, to semantic HTML only, or to Markdown — and writes the result to
> the clipboard, which is the whole purpose of the action. The clipboard is
> written only when the user invokes one of these actions.

### scripting justification

> activeTab grants permission to access the invoked tab; scripting is the API
> that acts on it. Both are needed.
>
> The extension uses scripting.executeScript to run two short functions in that
> tab: one reads the user's selection — including inside form fields, iframes
> and shadow DOM, which a plain selection read misses — and one inserts text at
> the caret. No content scripts are registered, in the manifest or at runtime,
> so nothing runs on any page until the user invokes an action, and these
> functions run only in the tab activeTab has granted.

### storage justification

> Stores the user's own settings: which formatting survives a clean copy, their
> Markdown style preferences, which right-click entries to show, and how they
> want to be notified. Nothing else is written. No page content, no clipboard
> content, no browsing data and no identifiers are stored — there is no
> clipboard history — and nothing is transmitted anywhere.

### offscreen justification

> A Manifest V3 service worker has no DOM, and both core operations need one:
> clipboard access, and converting HTML to Markdown using DOM APIs.
>
> The extension creates a single hidden, empty extension document for this. It
> ships inside the package, loads no remote content, and does nothing but
> convert text the user has asked to convert. It is created on demand and is the
> standard Chrome mechanism for giving a service worker a document. The Firefox
> build does not request this permission, because MV3 background scripts there
> already run in a document.

### Remote code

Select **No, I am not using Remote code.** If a justification is required:

> All JavaScript executes from files inside the extension package. There are no
> script tags pointing at external files, no modules loaded from a remote
> origin, and no eval() or new Function(). The extension makes no network
> requests of any kind; every conversion happens locally on the user's machine.

### What a reviewer can check quickly

- No `host_permissions`, no `content_scripts`, no `web_accessible_resources` in the manifest.
- No `eval` or `new Function` anywhere in the built bundle.
- The only `https://` strings in the build are XML namespaces, the homepage link, and sample text on the options page — nothing is fetched.
- Storage holds only the keys in `DEFAULT_SETTINGS`.
- Full source: <https://github.com/Jeusto/copy-paste-without-formatting>

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
