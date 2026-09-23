/**
 * Runs in the page. Shows a short confirmation.
 *
 * Rendered inside a closed shadow root with fully inline styles so no page
 * stylesheet can restyle or hide it, and nothing leaks back into the page.
 *
 * MUST stay self-contained (see readSelection).
 */
export function showToast(message: string, tone: "ok" | "error"): void {
  const hostId = "plainly-toast-host";
  document.getElementById(hostId)?.remove();

  const host = document.createElement("div");
  host.id = hostId;
  host.style.cssText =
    "all:initial;position:fixed;top:16px;right:16px;z-index:2147483647;pointer-events:none;";

  const shadow = host.attachShadow({ mode: "closed" });
  const box = document.createElement("div");
  box.textContent = message;
  box.setAttribute("role", "status");
  box.style.cssText = [
    "font:500 13px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
    "box-sizing:border-box",
    "display:flex",
    "align-items:center",
    "gap:8px",
    "max-width:min(340px,70vw)",
    "padding:9px 14px",
    "border-radius:10px",
    "color:#fff",
    // Matches the extension's own palette rather than raw Tailwind reds and
    // greens, so the toast reads as part of the same product as the popup.
    "background:" + (tone === "ok" ? "#16161A" : "#B4232A"),
    "box-shadow:0 10px 30px rgba(22,22,26,.28), 0 2px 8px rgba(22,22,26,.2)",
    "border-left:3px solid " + (tone === "ok" ? "#6366F1" : "#FF8A8A"),
    "opacity:0",
    "transform:translateY(-6px)",
    "transition:opacity .16s ease,transform .16s ease",
  ].join(";");

  shadow.appendChild(box);
  (document.body || document.documentElement).appendChild(host);

  requestAnimationFrame(() => {
    box.style.opacity = "1";
    box.style.transform = "translateY(0)";
  });

  window.setTimeout(() => {
    box.style.opacity = "0";
    box.style.transform = "translateY(-6px)";
    window.setTimeout(() => host.remove(), 220);
  }, 1700);
}
