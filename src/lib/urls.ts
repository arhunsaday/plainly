/**
 * Tracking-parameter removal.
 *
 * Copying a link out of a newsletter, a search result or a share sheet drags a
 * tail of campaign identifiers with it. They are noise in a document, and in a
 * shared link they tell the recipient's analytics where the reader came from.
 * Stripping them is a copy-hygiene job, which is what this extension is for.
 */

/** Removed on every host. Each is an identifier, never addressing. */
const GLOBAL = new Set([
  // Google Analytics / Urchin
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "utm_id", "utm_name", "utm_reader", "utm_social", "utm_social-type", "utm_brand",
  // Ad click identifiers
  "gclid", "gclsrc", "dclid", "gbraid", "wbraid", "msclkid", "yclid",
  "fbclid", "twclid", "ttclid", "li_fat_id", "epik", "rdt_cid",
  // Email platforms
  "mc_cid", "mc_eid", "_hsenc", "_hsmi", "hsctatracking", "vero_id", "vero_conv",
  "oly_anon_id", "oly_enc_id", "ck_subscriber_id", "mkt_tok",
  // Misc analytics
  "icid", "ncid", "cmpid", "camp", "wickedid", "rb_clickid", "_openstat"
]);

/** Removed only where the parameter is known to be a share identifier. */
const PER_HOST: { hosts: RegExp; params: string[] }[] = [
  { hosts: /(^|\.)(youtube\.com|youtu\.be)$/i, params: ["si", "pp", "feature"] },
  { hosts: /(^|\.)(spotify\.com)$/i, params: ["si", "nd", "_branch_match_id"] },
  { hosts: /(^|\.)(twitter\.com|x\.com)$/i, params: ["s", "t", "ref_src", "ref_url"] },
  { hosts: /(^|\.)(instagram\.com)$/i, params: ["igshid", "igsh", "img_index"] },
  { hosts: /(^|\.)(amazon\.[a-z.]+)$/i, params: ["ref", "ref_", "pd_rd_r", "pd_rd_w", "pd_rd_wg", "pf_rd_p", "pf_rd_r", "th", "psc"] },
  { hosts: /(^|\.)(aliexpress\.[a-z.]+|taobao\.com)$/i, params: ["spm", "scm", "aff_platform", "aff_trace_key"] },
  { hosts: /(^|\.)(linkedin\.com)$/i, params: ["trk", "trackingId", "originalSubdomain"] },
  { hosts: /(^|\.)(reddit\.com)$/i, params: ["share_id", "rdt", "correlation_id", "ref_campaign"] }
];

/**
 * Strips tracking parameters from one URL string. Anything that is not an
 * http(s) URL is returned untouched — this must never mangle text that merely
 * looks URL-ish.
 */
export function stripTracking(input: string): string {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return input;

  const host = url.hostname;
  const extra = PER_HOST.filter((rule) => rule.hosts.test(host)).flatMap((rule) => rule.params);
  const doomed = [...url.searchParams.keys()].filter(
    (key) => GLOBAL.has(key.toLowerCase()) || extra.includes(key),
  );
  if (!doomed.length) return input;

  for (const key of doomed) url.searchParams.delete(key);

  let out = url.toString();
  // URL#toString re-adds a "?" for an emptied query; the original had content
  // there, so dropping it is a restoration, not a change of meaning.
  if (!url.searchParams.size) out = out.replace(/\?(?=#|$)/, "");
  return out;
}

// Deliberately conservative: a bare scheme-led run of non-space characters,
// with trailing sentence punctuation handed back to the surrounding prose.
const URL_IN_TEXT = /https?:\/\/[^\s<>"'`]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

/** Rewrites every http(s) URL found in a run of plain text. */
export function cleanUrlsInText(text: string): string {
  return text.replace(URL_IN_TEXT, (match) => {
    const tail = match.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const bare = tail ? match.slice(0, -tail.length) : match;
    return stripTracking(bare) + tail;
  });
}

const HREF = /(\shref\s*=\s*)("([^"]*)"|'([^']*)')/gi;

/** Rewrites href attributes in a serialised HTML fragment. */
export function cleanUrlsInHtml(html: string): string {
  return html.replace(HREF, (whole, prefix: string, _quoted: string, double?: string, single?: string) => {
    const raw = double ?? single ?? "";
    const cleaned = stripTracking(decodeEntities(raw));
    if (cleaned === decodeEntities(raw)) return whole;
    return `${prefix}"${escapeAttribute(cleaned)}"`;
  });
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
