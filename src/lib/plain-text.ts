import type { Settings } from "./settings";
import { cleanUrlsInText } from "./urls";

export type PlainTextOptions = Pick<
  Settings,
  | "collapseNewlines"
  | "collapseSpaces"
  | "trimResult"
  | "straightenQuotes"
  | "rejoinWrappedLines"
  | "stripTracking"
>;

/** Typographic characters that have an unambiguous ASCII equivalent. */
const STRAIGHTEN: [RegExp, string][] = [
  [/[\u2018\u2019\u201a\u201b\u2032]/g, "'"],
  [/[\u201c\u201d\u201e\u201f\u2033]/g, '"'],
  [/\u2026/g, "..."],
  [/[\u2010\u2011]/g, "-"],
  [/\u2044/g, "/"],
  [/\u00b7/g, "-"],
];

// A line that ends mid-sentence and continues in lower case was wrapped by the
// source, not by its author. Anything ending in sentence punctuation, a colon,
// or a bullet is left alone, as is a line followed by a blank one.
const HYPHEN_WRAP = /([\p{Ll}\p{Lu}])-\n(\p{Ll})/gu;
const SOFT_WRAP = /([^\n.!?:;*\-\u2022\u00b7\u2013\u2014])\n(?!\n)([\p{Ll}(])/gu;

/**
 * Rejoins lines broken by a fixed-width source — PDFs, plain-text email,
 * terminal output — while leaving deliberate line breaks intact.
 */
export function rejoinWrapped(input: string): string {
  return input.replace(HYPHEN_WRAP, "$1$2").replace(SOFT_WRAP, "$1 $2");
}

/**
 * Turn a selection (or clipboard payload) into plain text.
 *
 * Rich editors litter text with non-breaking, zero-width and soft-hyphen
 * characters; those are normalised unconditionally because they are invisible
 * artefacts of styling, not content the user chose. Everything that changes
 * visible characters is behind a setting.
 */
export function toPlainText(input: string, options: PlainTextOptions): string {
  let out = input
    .replace(/\r\n?/g, "\n")
    // NBSP and friends -> ordinary space
    .replace(/[\u00a0\u2007\u202f]/g, " ")
    // zero-width space / joiners / word-joiner / soft hyphen / BOM -> gone
    .replace(/[\u200b-\u200d\u2060\u00ad\ufeff]/g, "");

  if (options.straightenQuotes) {
    for (const [pattern, replacement] of STRAIGHTEN) out = out.replace(pattern, replacement);
  }

  // Rejoining only means anything while line structure still exists.
  if (options.rejoinWrappedLines && !options.collapseNewlines) out = rejoinWrapped(out);

  if (options.collapseNewlines) {
    out = out.replace(/\n+/g, " ");
  } else {
    // Keep paragraph breaks, drop the runs of blank lines editors add.
    out = out.replace(/\n{3,}/g, "\n\n");
  }

  if (options.collapseSpaces) {
    // `[^\S\n]` is "whitespace except newline", so line structure survives when
    // collapseNewlines is off.
    out = out.replace(/[^\S\n]+/g, " ");
  }

  if (!options.collapseNewlines) {
    out = out
      .split("\n")
      .map((line) => line.replace(/[^\S\n]+$/, ""))
      .join("\n");
  }

  if (options.stripTracking) out = cleanUrlsInText(out);

  return options.trimResult ? out.trim() : out;
}
