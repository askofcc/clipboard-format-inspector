# Clipboard Format Inspector

[中文说明](./README.md) · **Canonical URL: [https://clip.srint.cn/](https://clip.srint.cn/)**

A low-frequency utility as a **single webpage**: open when needed, close when done.

> **Only custom domain: `clip.srint.cn`**
> Hosted on Cloudflare Pages (usually more reachable than `github.io` in some networks).
> One repository powers automatic updates — no duplicate app code.

## Where to use it

| Entry | Notes |
|------|------|
| **https://clip.srint.cn/** | Primary (Cloudflare Pages + custom domain) |
| GitHub Pages | Fallback: `https://askofcc.github.io/clipboard-format-inspector/` |
| `index.html` in this repo | Local open (`file://` may limit Clipboard API) |

## Features

- Clipboard API read
- Paste capture for fuller type lists
- Text / HTML / image / hex views
- Copy, download, JSON export
- Chinese / English UI
- Local-only processing

## Maintenance cost

**Low.** One repo:

1. Edit files and push to `main`
2. GitHub Pages updates automatically
3. Cloudflare Pages deploys via GitHub Action (one-time secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)

Same artifact, two hosts. Day-to-day work is just edit + push.

## License

[MIT](./LICENSE)
