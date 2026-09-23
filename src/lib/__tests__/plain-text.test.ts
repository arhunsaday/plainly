import { describe, expect, it } from "vitest";
import { toPlainText } from "../plain-text";
import { DEFAULT_SETTINGS } from "../settings";

const base = {
  collapseNewlines: DEFAULT_SETTINGS.collapseNewlines,
  collapseSpaces: DEFAULT_SETTINGS.collapseSpaces,
  trimResult: DEFAULT_SETTINGS.trimResult,
  straightenQuotes: DEFAULT_SETTINGS.straightenQuotes,
  rejoinWrappedLines: DEFAULT_SETTINGS.rejoinWrappedLines,
  stripTracking: DEFAULT_SETTINGS.stripTracking,
};

describe("toPlainText", () => {
  it("flattens a multi-line selection by default", () => {
    expect(toPlainText("Dear Alice,\n\nFirst point.\nSecond point.", base)).toBe(
      "Dear Alice, First point. Second point.",
    );
  });

  it("keeps paragraph structure when collapsing is off", () => {
    expect(
      toPlainText("Dear Alice,\n\nFirst point.\nSecond point.", {
        ...base,
        collapseNewlines: false,
      }),
    ).toBe("Dear Alice,\n\nFirst point.\nSecond point.");
  });

  it("normalises CRLF so Windows sources do not gain blank lines", () => {
    expect(toPlainText("a\r\nb", { ...base, collapseNewlines: false })).toBe("a\nb");
  });

  it("reduces runs of blank lines rather than preserving editor padding", () => {
    expect(toPlainText("a\n\n\n\n\nb", { ...base, collapseNewlines: false })).toBe("a\n\nb");
  });

  it("replaces non-breaking spaces, which otherwise survive as invisible junk", () => {
    expect(toPlainText("a\u00a0b", base)).toBe("a b");
    expect(toPlainText("a\u202fb", base)).toBe("a b");
  });

  it("strips zero-width characters injected by rich editors", () => {
    expect(toPlainText("in\u200bvisible\ufeff", base)).toBe("invisible");
    expect(toPlainText("a\u2060b", base)).toBe("ab");
  });

  it("leaves trailing whitespace alone when trimming is off", () => {
    expect(toPlainText("  x  ", { ...base, trimResult: false })).toBe(" x ");
  });

  it("strips per-line trailing whitespace while keeping line breaks", () => {
    expect(
      toPlainText("a   \nb\t\n", {
        ...base,
        collapseNewlines: false,
        collapseSpaces: false,
        trimResult: true,
      }),
    ).toBe("a\nb");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(toPlainText("  \n\t \n ", base)).toBe("");
  });
});

describe("straightenQuotes", () => {
  it("is off by default, so typography survives unless asked", () => {
    expect(toPlainText("\u201cQuoted\u201d \u2014 it\u2019s fine\u2026", base)).toBe(
      "\u201cQuoted\u201d \u2014 it\u2019s fine\u2026",
    );
  });

  it("replaces curly quotes, ellipses and figure dashes with ASCII", () => {
    expect(
      toPlainText("\u201cQuoted\u201d it\u2019s fine\u2026 a\u2011b", { ...base, straightenQuotes: true }),
    ).toBe('"Quoted" it\'s fine... a-b');
  });

  it("leaves em and en dashes alone, because they carry meaning", () => {
    expect(toPlainText("a \u2014 b \u2013 c", { ...base, straightenQuotes: true })).toBe("a \u2014 b \u2013 c");
  });
});

describe("rejoinWrappedLines", () => {
  const wrapped = { ...base, collapseNewlines: false, rejoinWrappedLines: true };

  it("joins a line that continues mid-sentence", () => {
    expect(toPlainText("The quarterly results were\nbetter than expected.", wrapped)).toBe(
      "The quarterly results were better than expected.",
    );
  });

  it("repairs a hyphen split across the break", () => {
    expect(toPlainText("unexpec-\nted growth", wrapped)).toBe("unexpected growth");
  });

  it("keeps deliberate breaks: sentence ends, paragraphs and list items", () => {
    expect(toPlainText("Done.\nNext thing.", wrapped)).toBe("Done.\nNext thing.");
    expect(toPlainText("One\n\nTwo", wrapped)).toBe("One\n\nTwo");
    expect(toPlainText("- one\n- two", wrapped)).toBe("- one\n- two");
  });

  it("does nothing when newlines are being collapsed anyway", () => {
    expect(toPlainText("unexpec-\nted", { ...base, rejoinWrappedLines: true })).toBe("unexpec- ted");
  });
});

describe("stripTracking in plain text", () => {
  it("is on by default", () => {
    expect(toPlainText("https://example.com/a?utm_source=news", base)).toBe("https://example.com/a");
  });

  it("can be turned off", () => {
    expect(toPlainText("https://example.com/a?utm_source=news", { ...base, stripTracking: false })).toBe(
      "https://example.com/a?utm_source=news",
    );
  });
});
