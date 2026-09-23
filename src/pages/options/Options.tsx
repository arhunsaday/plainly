import React, { useEffect, useMemo, useState } from "react";
import { Choice, Preview, Section, Toggle } from "@src/components/controls";
import { currentShortcuts, openShortcutSettings } from "@src/components/shortcuts";
import { BRAND } from "@src/lib/brand";
import { ACTION_LABELS, type ActionId } from "@src/lib/messages";
import { toPlainText } from "@src/lib/plain-text";
import { DEFAULT_SETTINGS, type Settings } from "@src/lib/settings";
import { getSettings, resetSettings, saveSettings } from "@src/lib/settings-store";

// Deliberately messy: curly quotes, an ellipsis, a hard wrap mid-sentence,
// doubled spaces, and a link with a campaign tail. No mid-word hyphen split —
// under the defaults it would survive into the preview and read as a bug.
const SAMPLE =
  "  \u201cQuarterly  results\u201d\n\nRevenue grew 12% year on year, and\nmargins held steady\u2026\nSource: https://example.com/report?utm_source=newsletter&id=42  ";

const SHORTCUT_ORDER: ActionId[] = ["copy_plain", "copy_clean", "copy_markdown", "paste_plain"];

export default function Options(): JSX.Element {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [shortcuts, setShortcuts] = useState<Partial<Record<ActionId, string>>>({});
  const [justReset, setJustReset] = useState(false);

  useEffect(() => {
    void getSettings().then(setSettings);
    void currentShortcuts().then(setShortcuts);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]): void {
    setJustReset(false);
    setSettings((current) => (current ? { ...current, [key]: value } : current));
    void saveSettings({ [key]: value } as Partial<Settings>);
  }

  const preview = useMemo(() => (settings ? toPlainText(SAMPLE, settings) : ""), [settings]);

  if (!settings) {
    return <main className="mx-auto max-w-3xl px-6 py-12 text-sm text-ink-400">Loading…</main>;
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-ink-200/70 bg-white/85 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-3.5">
          <img src="/icon-48.png" alt="" className="h-7 w-7 rounded-lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {BRAND.name}
            </h1>
            <p className="text-[11px] text-ink-400">Changes save as you make them.</p>
          </div>
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-xs text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            onClick={() => {
              void resetSettings();
              setSettings(DEFAULT_SETTINGS);
              setJustReset(true);
            }}
          >
            {justReset ? "Reset ✓" : "Reset to defaults"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-6 py-6">
        <Section
          title="Plain text"
          hint="Applies to “Copy without formatting” and “Paste without formatting”."
        >
          <Toggle
            label="Collapse line breaks into spaces"
            hint="On: the selection becomes a single line — handy for search boxes and address bars. Off: paragraphs survive."
            checked={settings.collapseNewlines}
            onChange={(next) => update("collapseNewlines", next)}
          />
          <Toggle
            label="Collapse runs of spaces and tabs"
            checked={settings.collapseSpaces}
            onChange={(next) => update("collapseSpaces", next)}
          />
          <Toggle
            label="Trim leading and trailing whitespace"
            checked={settings.trimResult}
            onChange={(next) => update("trimResult", next)}
          />
          <Toggle
            label="Rejoin hard-wrapped lines"
            hint="Repairs text wrapped by a PDF, a terminal or a plain-text email, including words split across a hyphen. Needs line breaks, so it does nothing while the setting above is on."
            checked={settings.rejoinWrappedLines}
            onChange={(next) => update("rejoinWrappedLines", next)}
          />
          <Toggle
            label="Straighten typographic characters"
            hint="Curly quotes, ellipses and figure dashes become their ASCII equivalents. Em and en dashes are left alone — they carry meaning."
            checked={settings.straightenQuotes}
            onChange={(next) => update("straightenQuotes", next)}
          />
          <Preview before={SAMPLE} after={preview} />
        </Section>

        <Section
          title="Links"
          hint="Applies to every action, including clean HTML and Markdown."
        >
          <Toggle
            label="Remove tracking parameters from links"
            hint="Strips utm_*, gclid, fbclid, mc_eid, mkt_tok and the like, plus known share identifiers on YouTube, Spotify, X, Instagram, Amazon, LinkedIn and Reddit. Ordinary query parameters are kept."
            checked={settings.stripTracking}
            onChange={(next) => update("stripTracking", next)}
          />
        </Section>

        <Section
          title="Clean formatting"
          hint="What survives “Copy with clean formatting” and “Copy as Markdown”. Everything else — fonts, colours, sizes, backgrounds, classes — is always discarded."
        >
          <Toggle
            label="Bold, italic, underline and strikethrough"
            checked={settings.keepEmphasis}
            onChange={(next) => update("keepEmphasis", next)}
          />
          <Toggle
            label="Headings"
            checked={settings.keepHeadings}
            onChange={(next) => update("keepHeadings", next)}
          />
          <Toggle label="Lists" checked={settings.keepLists} onChange={(next) => update("keepLists", next)} />
          <Toggle
            label="Links"
            hint="Only http, https, mailto and tel addresses are carried over."
            checked={settings.keepLinks}
            onChange={(next) => update("keepLinks", next)}
          />
          <Toggle label="Tables" checked={settings.keepTables} onChange={(next) => update("keepTables", next)} />
          <Toggle
            label="Inline code and code blocks"
            checked={settings.keepCode}
            onChange={(next) => update("keepCode", next)}
          />
          <Toggle
            label="Images"
            hint="Off by default: image references are rarely wanted in pasted prose."
            checked={settings.keepImages}
            onChange={(next) => update("keepImages", next)}
          />
        </Section>

        <Section title="Markdown style">
          <Choice
            label="Bullet marker"
            value={settings.markdownBullet}
            options={[
              { value: "-", label: "- dash" },
              { value: "*", label: "* asterisk" },
              { value: "+", label: "+ plus" },
            ]}
            onChange={(next) => update("markdownBullet", next)}
          />
          <Choice
            label="Headings"
            value={settings.markdownHeadingStyle}
            options={[
              { value: "atx", label: "## ATX" },
              { value: "setext", label: "Underlined" },
            ]}
            onChange={(next) => update("markdownHeadingStyle", next)}
          />
          <Choice
            label="Code blocks"
            value={settings.markdownCodeBlockStyle}
            options={[
              { value: "fenced", label: "``` fenced" },
              { value: "indented", label: "Indented" },
            ]}
            onChange={(next) => update("markdownCodeBlockStyle", next)}
          />
          <Choice
            label="Emphasis"
            value={settings.markdownEmphasis}
            options={[
              { value: "_", label: "_underscore_" },
              { value: "*", label: "*asterisk*" },
            ]}
            onChange={(next) => update("markdownEmphasis", next)}
          />
        </Section>

        <Section title="Context menu" hint="Choose which entries appear on right-click.">
          <Toggle
            label={ACTION_LABELS.copy_plain}
            checked={settings.menuCopyPlain}
            onChange={(next) => update("menuCopyPlain", next)}
          />
          <Toggle
            label={ACTION_LABELS.copy_clean}
            checked={settings.menuCopyClean}
            onChange={(next) => update("menuCopyClean", next)}
          />
          <Toggle
            label={ACTION_LABELS.copy_markdown}
            checked={settings.menuCopyMarkdown}
            onChange={(next) => update("menuCopyMarkdown", next)}
          />
          <Toggle
            label={ACTION_LABELS.paste_plain}
            checked={settings.menuPastePlain}
            onChange={(next) => update("menuPastePlain", next)}
          />
        </Section>

        <Section title="Feedback">
          <Toggle
            label="Flash a tick or cross on the toolbar icon"
            checked={settings.showBadge}
            onChange={(next) => update("showBadge", next)}
          />
          <Choice
            label="On-page message"
            hint="Errors explain themselves; the toolbar badge cannot."
            value={settings.toastMode}
            options={[
              { value: "errors", label: "Errors only" },
              { value: "always", label: "Every action" },
              { value: "never", label: "Never" },
            ]}
            onChange={(next) => update("toastMode", next)}
          />
        </Section>

        <Section
          title="Keyboard shortcuts"
          hint="Shortcuts are assigned by the browser, not by the extension. Unassigned actions can be given a key of your choice."
        >
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {SHORTCUT_ORDER.map((action) => (
              <li key={action} className="flex items-center justify-between gap-4 py-2.5 first:pt-0">
                <span className="text-sm text-ink-800 dark:text-ink-100">{ACTION_LABELS[action]}</span>
                {shortcuts[action] ? (
                  <kbd className="shrink-0 rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 text-xs font-medium text-ink-600 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-300">
                    {shortcuts[action]}
                  </kbd>
                ) : (
                  <span className="shrink-0 text-xs text-ink-400">not assigned</span>
                )}
              </li>
            ))}
          </ul>
          <div className="pt-3">
            <button
              type="button"
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              onClick={() => void openShortcutSettings()}
            >
              Edit shortcuts
            </button>
          </div>
        </Section>

        <footer className="pb-4 pt-2 text-xs text-ink-400">
          <p>
            {BRAND.name} works entirely on your device. No accounts, no analytics, no network
            requests.{" "}
            <a
              className="underline underline-offset-2 hover:text-ink-700 dark:hover:text-ink-200"
              href={BRAND.homepage}
              target="_blank"
              rel="noreferrer noopener"
            >
              Source and issues
            </a>
            .
          </p>
        </footer>
      </main>
    </>
  );
}
