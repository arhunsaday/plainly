import { describe, expect, it } from "vitest";
import { cleanUrlsInHtml, cleanUrlsInText, stripTracking } from "../urls";

describe("stripTracking", () => {
  it("removes campaign parameters and keeps the rest of the query", () => {
    expect(stripTracking("https://example.com/post?utm_source=news&id=42&utm_medium=email")).toBe(
      "https://example.com/post?id=42",
    );
  });

  it("drops the question mark when nothing is left", () => {
    expect(stripTracking("https://example.com/post?utm_source=news")).toBe("https://example.com/post");
  });

  it("keeps the fragment", () => {
    expect(stripTracking("https://example.com/p?fbclid=abc#section")).toBe("https://example.com/p#section");
  });

  it("removes ad click identifiers from any host", () => {
    for (const key of ["gclid", "fbclid", "msclkid", "mc_eid", "mkt_tok"]) {
      expect(stripTracking(`https://shop.test/x?${key}=1`)).toBe("https://shop.test/x");
    }
  });

  it("only removes host-specific share ids on that host", () => {
    expect(stripTracking("https://youtu.be/abc?si=xyz&t=90")).toBe("https://youtu.be/abc?t=90");
    // `si` means something else elsewhere, so it survives.
    expect(stripTracking("https://example.com/x?si=xyz")).toBe("https://example.com/x?si=xyz");
  });

  it("leaves anything that is not an http(s) URL exactly as it was", () => {
    for (const input of ["not a url", "mailto:a@b.test?utm_source=x", "ftp://h/x?gclid=1", ""]) {
      expect(stripTracking(input)).toBe(input);
    }
  });

  it("returns the input unchanged when there is nothing to strip", () => {
    const url = "https://example.com/a/b?page=2#top";
    expect(stripTracking(url)).toBe(url);
  });
});

describe("cleanUrlsInText", () => {
  it("cleans a URL inside surrounding prose", () => {
    expect(cleanUrlsInText("See https://example.com/a?utm_source=x for details.")).toBe(
      "See https://example.com/a for details.",
    );
  });

  it("hands trailing sentence punctuation back to the prose", () => {
    expect(cleanUrlsInText("Read https://example.com/a?gclid=1.")).toBe("Read https://example.com/a.");
    expect(cleanUrlsInText("(https://example.com/a?gclid=1)")).toBe("(https://example.com/a)");
  });

  it("cleans several links in one selection", () => {
    expect(cleanUrlsInText("https://a.test/?utm_id=1 and https://b.test/?fbclid=2")).toBe(
      "https://a.test/ and https://b.test/",
    );
  });
});

describe("cleanUrlsInHtml", () => {
  it("rewrites href attributes", () => {
    expect(cleanUrlsInHtml('<a href="https://example.com/a?utm_source=x">link</a>')).toBe(
      '<a href="https://example.com/a">link</a>',
    );
  });

  it("handles single quotes and entity-encoded ampersands", () => {
    expect(cleanUrlsInHtml("<a href='https://e.test/a?id=1&amp;utm_medium=x'>l</a>")).toBe(
      '<a href="https://e.test/a?id=1">l</a>',
    );
  });

  it("leaves untouched hrefs byte-for-byte alone", () => {
    const html = '<a href="https://example.com/a">l</a><a href="#top">t</a>';
    expect(cleanUrlsInHtml(html)).toBe(html);
  });
});
