# Changelog

All notable changes to Plainly. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-09-23

First release under the name **Plainly** (previously "Better Copy Paste"), and
the first build intended for the Chrome Web Store and Firefox Add-ons.

### Added

- **Tracking-parameter removal**, on by default and applied to all four
  actions. Strips `utm_*`, `gclid`, `fbclid`, `mc_eid`, `mkt_tok` and the rest,
  plus the share identifiers YouTube, Spotify, X, Instagram, Amazon, LinkedIn
  and Reddit append. Ordinary query parameters survive, so links still work.
- **Rejoin hard-wrapped lines** — repairs text wrapped by a PDF, a terminal or
  a plain-text email, including words split across a hyphen, while leaving
  sentence ends, paragraph breaks and list items alone.
- **Straighten typographic characters** — curly quotes, ellipses and figure
  dashes become ASCII. Em and en dashes are deliberately left alone.
- Soft hyphens are now stripped alongside the other invisible characters.
- Brand identity: generated icon set at 16/32/48/128 with a vector source and
  store promo tiles, produced by `pnpm run brand` and `pnpm run store-assets`
  with no native image dependency. This replaces a stock clipboard icon of
  unclear provenance.
- A live **before/after preview** on the options page, showing what the
  plain-text settings actually do to a realistically messy sample.
- Tag-driven release pipeline publishing to both stores, plus a brand-asset
  drift check in CI.
- `CHANGELOG.md` and `store/DEPLOY.md`.

### Changed

- **Renamed to Plainly.** "Better Copy Paste" was close enough to several
  existing listings that the Chrome Web Store could reasonably have flagged it.
  The name now lives in one place, `src/lib/brand.ts`.
- Firefox add-on ID is now `plainly@jeusto.github.io`, replacing the
  `better-copy-paste@example.com` placeholder that AMO would have rejected.
- The manifest now declares all four icon sizes, a `homepage_url`, and the
  description mentions link cleaning.
- Popup redesigned: each action has its own glyph, a hover state that reads as
  pressable, inline progress, and a result line with an icon. Settings moved to
  a header button; the version is shown in the footer.
- Options page redesigned: sticky header, cards, and real switches instead of
  checkboxes — these settings apply instantly, which a checkbox does not say.
- The on-page toast now uses the extension's own palette rather than raw
  Tailwind red and green.
- A single neutral-plus-accent colour scale (`tailwind.config.cjs`) replaces
  ad-hoc slate and emerald, so the popup, the options page and the toast cannot
  drift apart.
- Firefox packages are now `.zip` rather than `.xpi`: AMO wants a zip for
  submission and `web-ext` produces the signed `.xpi` itself.
- Release archives are named `plainly-{chrome,firefox}-v<version>.zip`.
