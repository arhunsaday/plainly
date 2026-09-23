import React, { useId } from "react";

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section
      id={title.toLowerCase().replace(/\s+/g, "-")}
      className="scroll-mt-24 rounded-card border border-ink-200/70 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-900"
    >
      <h2 className="text-[13px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
        {title}
      </h2>
      {hint && (
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-500 dark:text-ink-400">
          {hint}
        </p>
      )}
      <div className="mt-4 divide-y divide-ink-100 dark:divide-ink-800">{children}</div>
    </section>
  );
}

/**
 * A real switch rather than a checkbox: these settings take effect instantly,
 * and a switch is the control that says "on now", where a checkbox implies a
 * form waiting to be submitted.
 */
export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}): JSX.Element {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0">
      <label htmlFor={id} className="min-w-0 cursor-pointer select-none">
        <span className="block text-sm text-ink-800 dark:text-ink-100">{label}</span>
        {hint && (
          <span className="mt-0.5 block max-w-prose text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            {hint}
          </span>
        )}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600
          ${checked ? "bg-accent-600" : "bg-ink-300 dark:bg-ink-700"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all
            ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export function Choice<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}): JSX.Element {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-5 py-3 first:pt-0 last:pb-0">
      <label htmlFor={id} className="min-w-0">
        <span className="block text-sm text-ink-800 dark:text-ink-100">{label}</span>
        {hint && (
          <span className="mt-0.5 block max-w-prose text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            {hint}
          </span>
        )}
      </label>
      <select
        id={id}
        className="shrink-0 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-sm text-ink-900
          transition hover:border-ink-300
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600
          dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Before / after, so a setting's effect is visible without leaving the page. */
export function Preview({
  before,
  after,
}: {
  before: string;
  after: string;
}): JSX.Element {
  return (
    <div className="mt-4 grid gap-px overflow-hidden rounded-lg bg-ink-200 sm:grid-cols-2 dark:bg-ink-800">
      {[
        ["What you copied", before],
        ["What you get", after],
      ].map(([caption, body]) => (
        <div key={caption} className="bg-ink-50 p-3 dark:bg-ink-950">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">{caption}</p>
          <pre className="mt-1.5 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink-700 dark:text-ink-300">
            {body || "(empty)"}
          </pre>
        </div>
      ))}
    </div>
  );
}
