/**
 * One place for everything that carries the product's name, so a rename is a
 * single edit rather than a hunt through the manifest, the UI and the docs.
 */
export const BRAND = {
  name: "Plainly",
  tagline: "Copy and paste without the mess.",
  summary: "Copy and paste text without formatting, or as clean HTML or Markdown.",
  description:
    "Copy and paste text without formatting, or as clean HTML or Markdown, from a keyboard shortcut or the context menu. Strips tracking parameters from copied links.",
  homepage: "https://github.com/Jeusto/copy-paste-without-formatting",
  /** AMO claims this permanently on first submission; it cannot be changed later. */
  geckoId: "plainly@jeusto.github.io",
} as const;
