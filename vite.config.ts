import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

import pkg from "./package.json";
import { BRAND } from "./src/lib/brand";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const componentsDir = resolve(root, "components");

const browser = process.env.BROWSER || "chrome";
const isFirefox = browser === "firefox";

export default defineConfig(({ mode }) => {
  const manifest = defineManifest({
    manifest_version: 3,
    version: pkg.version,
    name: mode === "development" ? `[Dev] ${BRAND.name}` : BRAND.name,
    description: BRAND.description,
    homepage_url: BRAND.homepage,
    options_ui: {
      page: "src/pages/options/index.html",
      open_in_tab: true,
    },
    background: isFirefox
      ? // Firefox MV3 background scripts still run inside a document, so they can
        // reach the clipboard directly and need no offscreen document.
        { scripts: ["src/pages/background/background.ts"], type: "module" as const }
      : { service_worker: "src/pages/background/background.ts", type: "module" as const },
    action: {
      default_popup: "src/pages/popup/index.html",
      default_title: BRAND.name,
      default_icon: {
        "16": "icon-16.png",
        "32": "icon-32.png",
        "48": "icon-48.png",
        "128": "icon-128.png",
      },
    },
    icons: {
      "16": "icon-16.png",
      "32": "icon-32.png",
      "48": "icon-48.png",
      "128": "icon-128.png",
    },
    // No host_permissions: every entry point (toolbar action, context menu,
    // keyboard command) is a gesture that grants activeTab for the current tab,
    // so the extension never needs standing access to every site.
    permissions: [
      "activeTab",
      "contextMenus",
      "clipboardRead",
      "clipboardWrite",
      "scripting",
      "storage",
      ...(isFirefox ? [] : ["offscreen"]),
    ],
    commands: {
      copy_plain: {
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
        },
        description: "Copy selected text without formatting",
      },
      paste_plain: {
        suggested_key: {
          default: "Ctrl+Shift+V",
          mac: "Command+Shift+V",
        },
        description: "Paste text without formatting",
      },
      // Left unbound on purpose: browsers cap suggested shortcuts, and these two
      // are assigned from the options page by whoever wants them.
      copy_clean: {
        description: "Copy selected text with clean formatting",
      },
      copy_markdown: {
        description: "Copy selected text as Markdown",
      },
    },
    ...(isFirefox && {
      browser_specific_settings: {
        gecko: {
          id: BRAND.geckoId,
          strict_min_version: "115.0",
          data_collection_permissions: {
            required: ["none"],
          },
        },
      },
    }),
  });

  return {
    root: ".",
    server: {
      port: 5000,
    },
    resolve: {
      alias: {
        "@src": root,
        "@assets": assetsDir,
        "@pages": pagesDir,
        "@components": componentsDir,
      },
    },
    build: {
      outDir: isFirefox ? "dist-firefox" : "dist",
      rollupOptions: {
        // Not referenced from the manifest, so crxjs cannot discover it.
        ...(isFirefox
          ? {}
          : { input: { offscreen: "src/pages/offscreen/index.html" } }),
      },
    },
    plugins: [react(), crx({ manifest, browser: isFirefox ? "firefox" : "chrome" })],
  };
});
