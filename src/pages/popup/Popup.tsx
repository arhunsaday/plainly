import React, { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import {
  AlertIcon,
  CheckIcon,
  CleanIcon,
  GearIcon,
  MarkdownIcon,
  PasteIcon,
  PlainIcon,
} from "@src/components/icons";
import { currentShortcuts, openShortcutSettings } from "@src/components/shortcuts";
import { BRAND } from "@src/lib/brand";
import {
  ACTION_LABELS,
  type ActionId,
  type ActionOutcome,
  type ActionRequest,
} from "@src/lib/messages";

const ACTIONS: {
  id: ActionId;
  description: string;
  Icon: (props: { className?: string }) => JSX.Element;
}[] = [
  { id: "copy_plain", description: "Strip every trace of styling", Icon: PlainIcon },
  { id: "copy_clean", description: "Keep structure, drop the noise", Icon: CleanIcon },
  { id: "copy_markdown", description: "Convert the selection to Markdown", Icon: MarkdownIcon },
  { id: "paste_plain", description: "Insert the clipboard as plain text", Icon: PasteIcon },
];

export default function Popup(): JSX.Element {
  const [shortcuts, setShortcuts] = useState<Partial<Record<ActionId, string>>>({});
  const [busy, setBusy] = useState<ActionId | null>(null);
  const [outcome, setOutcome] = useState<ActionOutcome | null>(null);

  useEffect(() => {
    void currentShortcuts().then(setShortcuts);
  }, []);

  async function run(action: ActionId): Promise<void> {
    setBusy(action);
    setOutcome(null);
    const request: ActionRequest = { kind: "run-action", action };
    try {
      const result = (await Browser.runtime.sendMessage(request)) as ActionOutcome | undefined;
      setOutcome(result ?? { ok: false, message: "The extension did not respond." });
    } catch (error) {
      setOutcome({ ok: false, message: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col bg-white text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      <header className="flex items-center gap-2.5 px-4 pb-3 pt-4">
        <img src="/icon-48.png" alt="" className="h-6 w-6 rounded-md" />
        <h1 className="flex-1 text-[13px] font-semibold tracking-tight">{BRAND.name}</h1>
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 dark:hover:bg-ink-800 dark:hover:text-ink-100"
          onClick={() => void Browser.runtime.openOptionsPage()}
        >
          <GearIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-col gap-1 px-2.5">
        {ACTIONS.map(({ id, description, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={busy !== null}
            onClick={() => void run(id)}
            className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition
              hover:bg-ink-50 active:scale-[.985] disabled:pointer-events-none disabled:opacity-50
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600
              dark:hover:bg-ink-900"
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600 transition
                group-hover:bg-accent-600 group-hover:text-white
                dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-accent-600 dark:group-hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight">
                {ACTION_LABELS[id]}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-ink-400 dark:text-ink-400">
                {busy === id ? "Working…" : description}
              </span>
            </span>
            {shortcuts[id] && (
              <kbd className="shrink-0 rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-400">
                {shortcuts[id]}
              </kbd>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[34px] px-4 pt-2.5" aria-live="polite">
        {outcome && (
          <p
            className={`flex items-start gap-1.5 text-[11px] leading-snug ${
              outcome.ok
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {outcome.ok ? (
              <CheckIcon className="mt-px h-3.5 w-3.5 shrink-0" />
            ) : (
              <AlertIcon className="mt-px h-3.5 w-3.5 shrink-0" />
            )}
            <span>{outcome.message}</span>
          </p>
        )}
      </div>

      <footer className="mt-1 flex items-center gap-3 border-t border-ink-100 px-4 py-2.5 text-[11px] text-ink-400 dark:border-ink-800">
        <button
          type="button"
          className="underline-offset-2 transition hover:text-ink-800 hover:underline dark:hover:text-ink-100"
          onClick={() => void openShortcutSettings()}
        >
          Edit shortcuts
        </button>
        <span className="ml-auto tabular-nums">v{Browser.runtime.getManifest().version}</span>
      </footer>
    </div>
  );
}
