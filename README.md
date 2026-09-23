<div align="center">
  <img src="brand/logo.svg" width="72" height="72" alt="">
  <h1>Plainly</h1>
  <p><strong>Copy and paste without the mess.</strong><br>
  Plain text, clean HTML or Markdown — from a keyboard shortcut.</p>
</div>

---

Plainly gets text out of one app and into another without dragging its styling
along. Four actions, from a keyboard shortcut, the right-click menu, or the
toolbar popup:

| Action | What lands on the clipboard |
| --- | --- |
| **Copy without formatting** | Plain text, with line breaks collapsed by default |
| **Copy with clean formatting** | Semantic HTML only — bold, italic, headings, lists, links, tables, code |
| **Copy as Markdown** | The selection converted to Markdown |
| **Paste without formatting** | The clipboard inserted as plain text at the caret |

Plus, on every one of them: **tracking parameters are stripped from links.**
`?utm_source=newsletter&gclid=…` never makes it into your document.

## Why it works where others do not

Google Docs and Word Online express bold and italic through CSS rather than
real HTML tags, so tools that only read the markup lose your emphasis. Plainly
reads the formatting the way the browser renders it, which is why *clean
formatting* and *Markdown* keep working on editors that defeat simpler
extensions.

It also handles the awkward cases: text selected inside form fields, content in
iframes, custom elements built on shadow DOM, and React or Vue editors that
ignore programmatic text insertion.

## Install

**Chrome, Edge, Brave, Arc** — [Chrome Web Store](https://chrome.google.com/webstore/) *(pending first submission)*
**Firefox** — [Firefox Add-ons](https://addons.mozilla.org/) *(pending first submission)*

### From source

```bash
pnpm install
pnpm run build:chrome     # -> dist/
pnpm run build:firefox    # -> dist-firefox/
```

- **Chrome / Edge / Brave** — `chrome://extensions`, enable Developer mode, *Load unpacked*, select `dist/`.
- **Firefox** — `about:debugging#/runtime/this-firefox`, *Load Temporary Add-on*, select any file inside `dist-firefox/`.

### Packaged

```bash
pnpm run package:all      # -> releases/plainly-{chrome,firefox}-v<version>.zip
```

## Default shortcuts

| Action | macOS | Windows / Linux |
| --- | --- | --- |
| Copy without formatting | `⌘⇧Y` | `Ctrl+Shift+Y` |
| Paste without formatting | `⌘⇧V` | `Ctrl+Shift+V` |
| Copy with clean formatting | unassigned | unassigned |
| Copy as Markdown | unassigned | unassigned |

Browsers cap how many shortcuts an extension may suggest, so the last two are
left for you to assign. The popup and the options page both link straight to
the browser's shortcut editor.

## Settings

Everything is in the options page, and saves as you change it.

- **Plain text** — collapse line breaks, collapse spaces, trim, rejoin
  hard-wrapped lines (PDFs, plain-text email), straighten typographic
  characters. A live before/after preview shows the combined effect.
- **Links** — remove tracking parameters. On by default.
- **Clean formatting** — choose what survives: emphasis, headings, lists,
  links, tables, code, images.
- **Markdown style** — bullet marker, heading style, code fences, emphasis.
- **Context menu** — which of the four entries appear on right-click.
- **Feedback** — toolbar badge, and whether on-page messages appear always, on
  errors only, or never.

## Privacy

No accounts, no analytics, no telemetry, no network requests of any kind. Your
selection and your clipboard are converted on your own machine and never leave
it. The extension requests **no host permissions**: it can read a tab only at
the moment you invoke it, and never any other tab. See [PRIVACY.md](PRIVACY.md).

## Development

Node 20+, pnpm.

```bash
pnpm install
pnpm run dev              # Chrome, with HMR
pnpm run dev:firefox
pnpm test                 # 63 tests
pnpm run brand            # regenerate icons — output is committed
pnpm run verify           # typecheck, lint, test, build both, check injected
```

### The injected-function invariant

`chrome.scripting.executeScript({ func })` serialises a function with
`Function.prototype.toString()`. Anything it closes over — an import, a
module-level constant, a helper next to it — is **not** serialised, so the
injected copy throws in the page while the bundle stays perfectly valid.
Nothing in TypeScript or eslint catches this.

`scripts/check-injected.mjs` parses the built bundles, finds each injected
function after minification, and fails the build if it references a name it
does not declare itself. It runs in `pnpm run verify` and in CI. If you add an
injected function, add its marker string to `INJECTED` in that script.

| File | Responsibility |
| --- | --- |
| [src/lib/actions.ts](src/lib/actions.ts) | Orchestrates each action end to end |
| [src/lib/plain-text.ts](src/lib/plain-text.ts) | Plain-text normalisation, rewrapping, typography |
| [src/lib/urls.ts](src/lib/urls.ts) | Tracking-parameter removal |
| [src/lib/inject/](src/lib/inject/) | The self-contained functions that run in the page |
| [src/lib/dom-context.ts](src/lib/dom-context.ts) | Clipboard and Markdown work, via offscreen document or background page |
| [src/lib/brand.ts](src/lib/brand.ts) | Name, tagline, add-on id — the only place they appear |
| [scripts/brand.mjs](scripts/brand.mjs) | Brand geometry → the committed PNG icons |

## Releasing

Tag it; CI does the rest.

```bash
pnpm version minor
git push --follow-tags
```

`.github/workflows/release.yml` verifies the tag against `package.json`, runs
the full verify gate, packages, publishes to both stores and opens a GitHub
Release. Publishing steps skip themselves when their secrets are absent.
See [store/DEPLOY.md](store/DEPLOY.md) for the credentials and
[store/listing.md](store/listing.md) for the listing copy.

## Licence

MIT — see [LICENSE](LICENSE).
