# Clipboard Format Inspector (Userscript)

[中文说明](./README.md)

A Tampermonkey / Violentmonkey userscript that inspects **as many clipboard formats as the browser allows**.

After you copy rich text, images, or other formatted content, the script lists available MIME types and shows plain text, HTML source/render, image previews, and binary hex dumps when possible.

## Features

- Floating **CB** button at the bottom-right to open the inspector panel
- **Clipboard API read** via `navigator.clipboard.read()` for standard formats
- **Paste capture** with `Ctrl/Cmd+V` in the panel to enumerate `clipboardData.types` (better for custom type names)
- Format-aware views:
  - `text/*` → text
  - `text/html` → rendered preview + HTML source
  - `image/*` → image preview
  - binary / non-text → hex preview
- Copy text, download individual items, export JSON

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Install from raw script:

   **[Install clipboard-inspector.user.js](https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js)**

3. Refresh any page and click the **CB** button

Alternatively, paste the contents of `clipboard-inspector.user.js` into Tampermonkey → “Create a new script”.

## Usage

1. Copy content from any app (plain text, rich HTML, screenshot/image, etc.)
2. Open the inspector panel
3. Either:
   - click **Read Clipboard API** (may prompt for permission), or
   - paste into the panel paste zone (better for discovering type names)
4. Switch previews, copy, or download from each result card

## Browser Limitations (Important)

Web pages **cannot** fully inspect every private system clipboard format the way a desktop app can.

| Path | What you usually get |
|------|----------------------|
| `clipboard.read()` | Standard MIME types such as `text/plain`, `text/html`, `image/png`; requires permission and a secure context (https / localhost) |
| `paste` + `clipboardData.types` | Fuller type list, sometimes including custom names; many custom formats return empty `getData()` |
| App-private formats (e.g. some Office internal formats) | Content is generally unavailable to the web page; type names may appear rarely |

This script combines **API reads for standard formats** with **paste-time type enumeration**. Content is shown when available; type names and sources are kept even when payload access is blocked.

## Files

| File | Description |
|------|-------------|
| `clipboard-inspector.user.js` | Userscript |
| `README.md` | Chinese docs |
| `README.en.md` | English docs |
| `LICENSE` | MIT |

## License

[MIT](./LICENSE)
