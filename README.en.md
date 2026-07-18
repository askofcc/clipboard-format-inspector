# Clipboard Format Inspector

[中文说明](./README.md) · [Live demo](https://askofcc.github.io/clipboard-format-inspector/)

A low-frequency utility works better as a **single webpage**: open it when needed, close it when done.

The page shows as many browser-readable clipboard formats as possible (`text/plain`, `text/html`, images, and custom type names visible on paste).

## Use online

**[Open the web app](https://askofcc.github.io/clipboard-format-inspector/)**

You can also download [`index.html`](./index.html) and open it locally. Some browsers restrict the Clipboard API more on `file://`; prefer the hosted page or a local http server.

## Features

- **Clipboard API read** via `navigator.clipboard.read()`
- **Paste capture** with `Ctrl/Cmd+V` to enumerate `clipboardData.types`
- Format-aware views: text / HTML render + source / image / hex
- Copy, download items, export JSON
- Chinese / English switch (persisted)
- Processing stays in your browser; nothing is uploaded

## Usage

1. Copy content (plain text, rich text, image, etc.)
2. Open the page
3. Click **Read Clipboard API**, or paste into the paste zone
4. Inspect each MIME type card

## Browser limitations

Web pages **cannot** fully inspect every private system clipboard format.

| Path | What you usually get |
|------|----------------------|
| `clipboard.read()` | Standard MIME types; needs permission + secure context (https / localhost) |
| `paste` + `clipboardData.types` | Fuller type list; many custom payloads empty |
| App-private formats | Content generally unavailable |

## Optional userscript

If you prefer a floating button on every site:

**[clipboard-inspector.user.js](https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js)**

The single-page app is the recommended default.

## Files

| File | Description |
|------|-------------|
| `index.html` | Single-page app (recommended) |
| `clipboard-inspector.user.js` | Optional userscript |
| `README.md` / `README.en.md` | Docs |
| `LICENSE` | MIT |

## License

[MIT](./LICENSE)
