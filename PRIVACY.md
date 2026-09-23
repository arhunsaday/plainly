# Privacy policy — Plainly

*Last updated: 2026-09-23*

**Plainly collects nothing and transmits nothing.** No analytics, no telemetry,
no accounts, no identifiers, no network requests of any kind. There is no
server; there is nothing to collect it with.

## What the extension touches, and when

Plainly does one thing: it converts the text you selected, or the text on your
clipboard, and hands the result back.

It has **no host permissions**. It cannot read any page until you invoke it —
with its keyboard shortcut, its right-click entry, or its toolbar button — and
then only the tab you invoked it on, for that one action. It never reads any
other tab, and it registers no persistent content scripts.

When you invoke an action, it runs a short function in that tab to read your
selection (or to insert text at your caret), converts the result inside the
extension, and writes it to your clipboard. Everything happens on your device,
in memory, and is discarded when the action finishes.

## What is stored

Your settings, and only your settings, in the browser's extension storage:
which formatting survives a clean copy, your Markdown style, which right-click
entries you want, and how you want to be notified. They sync through your
browser profile if you are signed in to it, exactly as your browser's own
settings do.

**Nothing you copy or paste is ever stored.** There is no clipboard history and
no log of what you converted.

Uninstalling removes the settings.

## Permissions, and why each one exists

| Permission | Why |
| --- | --- |
| `activeTab` | Read your selection, and insert text at your caret, in the tab you invoked the extension on. Granted by that gesture, for that tab only. |
| `scripting` | Run the selection-reading and text-insertion routines in that tab. No persistent content scripts are registered. |
| `contextMenus` | Add the four entries to the right-click menu. |
| `clipboardRead` | "Paste without formatting" reads the clipboard so it can strip formatting before inserting. |
| `clipboardWrite` | The three copy actions place their result on the clipboard. |
| `storage` | Your settings, above. |
| `offscreen` (Chrome only) | A Manifest V3 service worker has no document, and clipboard access needs one. Creates a hidden, empty extension document used only for clipboard access and HTML-to-Markdown conversion. It loads no remote content. |

**Host permissions:** none requested.
**Remote code:** none. Everything that executes ships inside the package.

## Links

With "Remove tracking parameters from links" on — the default — campaign and
click identifiers (`utm_*`, `gclid`, `fbclid`, and the like) are removed from
URLs in what you copy. This happens entirely on your device. No URL is
resolved, fetched, or sent anywhere.

## Contact

Open an issue at
<https://github.com/Jeusto/copy-paste-without-formatting/issues>.
