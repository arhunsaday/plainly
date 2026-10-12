/**
 * One place for everything that carries the product's name, so a rename is a
 * single edit rather than a hunt through the manifest, the UI and the docs.
 */
export const BRAND = {
  name: "Plainly — copy and paste without formatting",
  tagline: "Copy and paste without the mess.",
  summary:
    "Copy and paste text without formatting, or as clean HTML or Markdown.",
  description:
    "Copy and paste text without formatting, or as clean HTML or Markdown",
  homepage: "https://github.com/Jeusto/copy-paste-without-formatting",
  /** AMO claims this permanently on first submission; it cannot be changed later. */
  geckoId: "cleanly@jeusto.github.io",
} as const;
