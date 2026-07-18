// ==UserScript==
// @name         Clipboard Format Inspector
// @name:zh-CN   剪贴板格式查看器
// @namespace    https://github.com/askofcc/clipboard-format-inspector
// @version      1.0.0
// @description  Inspect clipboard MIME types and content: text/plain, text/html, images, files, and custom types when available
// @description:zh-CN 查看剪贴板中的多种格式：text/plain、text/html、图片、文件、自定义 MIME 等
// @author       askofcc
// @homepageURL  https://github.com/askofcc/clipboard-format-inspector
// @supportURL   https://github.com/askofcc/clipboard-format-inspector/issues
// @downloadURL  https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js
// @updateURL    https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  if (window.top !== window.self) return;
  if (window.__clipboardInspectorLoaded) return;
  window.__clipboardInspectorLoaded = true;

  const STYLE_ID = 'clipboard-inspector-style';
  const ROOT_ID = 'clipboard-inspector-root';

  const css = `
#${ROOT_ID} {
  --ci-bg: #111827;
  --ci-panel: #1f2937;
  --ci-border: #374151;
  --ci-text: #f3f4f6;
  --ci-muted: #9ca3af;
  --ci-accent: #38bdf8;
  --ci-ok: #34d399;
  --ci-warn: #fbbf24;
  --ci-danger: #f87171;
  --ci-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --ci-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  all: initial;
  font-family: var(--ci-sans);
  color: var(--ci-text);
  position: fixed;
  z-index: 2147483646;
  inset: 0;
  pointer-events: none;
}
#${ROOT_ID} * {
  box-sizing: border-box;
}
#${ROOT_ID} .ci-fab {
  pointer-events: auto;
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid var(--ci-border);
  background: linear-gradient(180deg, #1f2937, #111827);
  color: var(--ci-accent);
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
  display: flex;
  align-items: center;
  justify-content: center;
}
#${ROOT_ID} .ci-fab:hover {
  border-color: var(--ci-accent);
}
#${ROOT_ID} .ci-panel {
  pointer-events: auto;
  position: fixed;
  right: 18px;
  bottom: 76px;
  width: min(760px, calc(100vw - 24px));
  height: min(72vh, 720px);
  display: none;
  flex-direction: column;
  background: var(--ci-bg);
  border: 1px solid var(--ci-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.45);
}
#${ROOT_ID}.open .ci-panel {
  display: flex;
}
#${ROOT_ID} .ci-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ci-border);
  background: var(--ci-panel);
}
#${ROOT_ID} .ci-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .2px;
}
#${ROOT_ID} .ci-sub {
  margin-left: auto;
  font-size: 12px;
  color: var(--ci-muted);
}
#${ROOT_ID} .ci-close {
  border: 0;
  background: transparent;
  color: var(--ci-muted);
  font-size: 18px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 8px;
}
#${ROOT_ID} .ci-close:hover {
  background: rgba(255,255,255,.06);
  color: var(--ci-text);
}
#${ROOT_ID} .ci-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--ci-border);
  background: #0b1220;
}
#${ROOT_ID} .ci-btn {
  border: 1px solid var(--ci-border);
  background: #111827;
  color: var(--ci-text);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
}
#${ROOT_ID} .ci-btn:hover {
  border-color: var(--ci-accent);
  color: var(--ci-accent);
}
#${ROOT_ID} .ci-btn.primary {
  background: rgba(56,189,248,.12);
  border-color: rgba(56,189,248,.45);
  color: var(--ci-accent);
}
#${ROOT_ID} .ci-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}
#${ROOT_ID} .ci-hint {
  width: 100%;
  font-size: 12px;
  color: var(--ci-muted);
  line-height: 1.45;
}
#${ROOT_ID} .ci-body {
  flex: 1;
  overflow: auto;
  padding: 12px 14px 18px;
}
#${ROOT_ID} .ci-status {
  font-size: 12px;
  color: var(--ci-muted);
  margin-bottom: 10px;
  line-height: 1.5;
}
#${ROOT_ID} .ci-status strong {
  color: var(--ci-text);
}
#${ROOT_ID} .ci-status.ok strong { color: var(--ci-ok); }
#${ROOT_ID} .ci-status.warn strong { color: var(--ci-warn); }
#${ROOT_ID} .ci-status.err strong { color: var(--ci-danger); }
#${ROOT_ID} .ci-empty {
  border: 1px dashed var(--ci-border);
  border-radius: 12px;
  padding: 28px 16px;
  text-align: center;
  color: var(--ci-muted);
  font-size: 13px;
  line-height: 1.6;
}
#${ROOT_ID} .ci-card {
  border: 1px solid var(--ci-border);
  border-radius: 12px;
  background: var(--ci-panel);
  margin-bottom: 12px;
  overflow: hidden;
}
#${ROOT_ID} .ci-card-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--ci-border);
  background: rgba(0,0,0,.18);
}
#${ROOT_ID} .ci-type {
  font-family: var(--ci-mono);
  font-size: 12px;
  color: var(--ci-accent);
  word-break: break-all;
}
#${ROOT_ID} .ci-meta {
  margin-top: 4px;
  font-size: 11px;
  color: var(--ci-muted);
}
#${ROOT_ID} .ci-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
#${ROOT_ID} .ci-mini {
  border: 1px solid var(--ci-border);
  background: transparent;
  color: var(--ci-muted);
  border-radius: 7px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
}
#${ROOT_ID} .ci-mini:hover {
  color: var(--ci-text);
  border-color: #6b7280;
}
#${ROOT_ID} .ci-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 10px 0;
  flex-wrap: wrap;
}
#${ROOT_ID} .ci-tab {
  border: 1px solid transparent;
  background: transparent;
  color: var(--ci-muted);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
}
#${ROOT_ID} .ci-tab.active {
  color: var(--ci-text);
  border-color: var(--ci-border);
  background: rgba(255,255,255,.04);
}
#${ROOT_ID} .ci-content {
  padding: 10px 12px 12px;
}
#${ROOT_ID} .ci-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--ci-mono);
  font-size: 12px;
  line-height: 1.5;
  max-height: 320px;
  overflow: auto;
  background: #0b1220;
  border: 1px solid var(--ci-border);
  border-radius: 8px;
  padding: 10px;
}
#${ROOT_ID} .ci-html-view {
  background: #fff;
  color: #111;
  border: 1px solid var(--ci-border);
  border-radius: 8px;
  padding: 12px;
  max-height: 320px;
  overflow: auto;
}
#${ROOT_ID} .ci-img-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#${ROOT_ID} .ci-img-wrap img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
  border-radius: 8px;
  background:
    linear-gradient(45deg, #222 25%, transparent 25%),
    linear-gradient(-45deg, #222 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #222 75%),
    linear-gradient(-45deg, transparent 75%, #222 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  background-color: #333;
}
#${ROOT_ID} .ci-badge {
  display: inline-block;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid var(--ci-border);
  color: var(--ci-muted);
  margin-left: 6px;
  vertical-align: middle;
}
#${ROOT_ID} .ci-paste-zone {
  border: 1px dashed var(--ci-border);
  border-radius: 10px;
  padding: 12px;
  margin-top: 8px;
  color: var(--ci-muted);
  font-size: 12px;
  outline: none;
  min-height: 56px;
  background: rgba(255,255,255,.02);
}
#${ROOT_ID} .ci-paste-zone:focus {
  border-color: var(--ci-accent);
  color: var(--ci-text);
}
`;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'className') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  function formatBytes(n) {
    if (n == null || Number.isNaN(n)) return 'unknown size';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function looksBinary(text) {
    if (!text) return false;
    let bad = 0;
    const sample = text.slice(0, 2000);
    for (let i = 0; i < sample.length; i++) {
      const code = sample.charCodeAt(i);
      if (code === 0 || (code < 9) || (code > 13 && code < 32)) bad++;
    }
    return bad / sample.length > 0.05;
  }

  function toHexPreview(bytes, max = 256) {
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const slice = arr.slice(0, max);
    let hex = '';
    let ascii = '';
    const lines = [];
    for (let i = 0; i < slice.length; i++) {
      const b = slice[i];
      hex += b.toString(16).padStart(2, '0') + ' ';
      ascii += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
      if ((i + 1) % 16 === 0) {
        lines.push(`${hex.padEnd(16 * 3)} ${ascii}`);
        hex = '';
        ascii = '';
      }
    }
    if (hex) lines.push(`${hex.padEnd(16 * 3)} ${ascii}`);
    if (arr.length > max) lines.push(`... truncated, total ${arr.length} bytes`);
    return lines.join('\n');
  }

  async function blobToText(blob) {
    return await blob.text();
  }

  async function blobToArrayBuffer(blob) {
    return await blob.arrayBuffer();
  }

  async function blobToDataUrl(blob) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
      reader.readAsDataURL(blob);
    });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch {
        return false;
      }
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'clipboard-item.bin';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function classifyMime(type) {
    const t = (type || '').toLowerCase();
    if (!t) return 'unknown';
    if (t.startsWith('image/')) return 'image';
    if (t === 'text/html' || t.includes('html')) return 'html';
    if (t.startsWith('text/') || t === 'application/json' || t.includes('xml') || t.includes('javascript')) return 'text';
    if (t === 'Files' || t === 'public.file-url') return 'files';
    return 'binary';
  }

  async function normalizeItem(item) {
    // item: { type, source, blob?, text?, file?, size?, notes? }
    const type = item.type || 'unknown';
    const kind = classifyMime(type);
    const result = {
      type,
      kind,
      source: item.source || 'unknown',
      size: item.size,
      notes: item.notes || [],
      previews: {},
      rawText: null,
      blob: item.blob || null,
      file: item.file || null,
    };

    try {
      if (item.text != null) {
        result.rawText = String(item.text);
        result.size = result.size ?? new Blob([result.rawText]).size;
      } else if (item.blob) {
        result.size = result.size ?? item.blob.size;
        if (kind === 'text' || kind === 'html') {
          result.rawText = await blobToText(item.blob);
        } else if (kind === 'image') {
          result.previews.dataUrl = await blobToDataUrl(item.blob);
        } else {
          // try text first, fall back to hex
          const text = await blobToText(item.blob);
          if (!looksBinary(text)) {
            result.rawText = text;
            result.kind = 'text';
          } else {
            const buf = await blobToArrayBuffer(item.blob);
            result.previews.hex = toHexPreview(buf);
            result.kind = 'binary';
          }
        }
      } else if (item.file) {
        result.size = item.file.size;
        result.notes.push(`file name: ${item.file.name || '(unnamed)'}`);
        if (item.file.type) result.notes.push(`file.type: ${item.file.type}`);
        if (item.file.type.startsWith('image/')) {
          result.kind = 'image';
          result.blob = item.file;
          result.previews.dataUrl = await blobToDataUrl(item.file);
        } else if (item.file.type.startsWith('text/') || !item.file.type) {
          const text = await item.file.text();
          if (!looksBinary(text)) {
            result.rawText = text;
            result.kind = 'text';
          } else {
            result.previews.hex = toHexPreview(await item.file.arrayBuffer());
            result.kind = 'binary';
          }
        } else {
          result.previews.hex = toHexPreview(await item.file.arrayBuffer());
          result.kind = 'binary';
        }
      }

      if (result.kind === 'html' && result.rawText != null) {
        result.previews.html = result.rawText;
        result.previews.source = result.rawText;
      }
      if (result.kind === 'text' && result.rawText != null) {
        result.previews.text = result.rawText;
      }
      if (result.kind === 'binary' && !result.previews.hex && result.blob) {
        result.previews.hex = toHexPreview(await blobToArrayBuffer(result.blob));
      }
    } catch (err) {
      result.notes.push(`parse error: ${err && err.message ? err.message : String(err)}`);
    }

    return result;
  }

  async function readViaClipboardApi() {
    const items = [];
    const notes = [];

    if (!navigator.clipboard) {
      notes.push('当前环境没有 navigator.clipboard');
      return { items, notes, method: 'clipboard-api' };
    }

    // Prefer ClipboardItem API
    if (typeof navigator.clipboard.read === 'function') {
      try {
        const clipboardItems = await navigator.clipboard.read();
        notes.push(`clipboard.read() 返回 ${clipboardItems.length} 个 ClipboardItem`);
        for (let i = 0; i < clipboardItems.length; i++) {
          const ci = clipboardItems[i];
          const types = Array.from(ci.types || []);
          notes.push(`item[${i}] types: ${types.join(', ') || '(none)'}`);
          for (const type of types) {
            try {
              const blob = await ci.getType(type);
              items.push({
                type,
                source: `clipboard.read()[#${i}]`,
                blob,
                size: blob.size,
              });
            } catch (err) {
              items.push({
                type,
                source: `clipboard.read()[#${i}]`,
                text: '',
                notes: [`getType failed: ${err && err.message ? err.message : String(err)}`],
              });
            }
          }
        }
        return { items, notes, method: 'clipboard.read' };
      } catch (err) {
        notes.push(`clipboard.read() 失败: ${err && err.message ? err.message : String(err)}`);
      }
    } else {
      notes.push('不支持 clipboard.read()');
    }

    // Fallback: only plain text
    if (typeof navigator.clipboard.readText === 'function') {
      try {
        const text = await navigator.clipboard.readText();
        if (text != null && text !== '') {
          items.push({
            type: 'text/plain',
            source: 'clipboard.readText()',
            text,
          });
          notes.push('仅通过 readText() 读到 text/plain');
        } else {
          notes.push('readText() 返回空字符串');
        }
      } catch (err) {
        notes.push(`clipboard.readText() 失败: ${err && err.message ? err.message : String(err)}`);
      }
    }

    return { items, notes, method: 'clipboard-api-fallback' };
  }

  async function readViaPasteEvent(e) {
    const items = [];
    const notes = [];
    const cd = e.clipboardData || window.clipboardData;
    if (!cd) {
      notes.push('paste 事件没有 clipboardData');
      return { items, notes, method: 'paste' };
    }

    const types = [];
    try {
      for (let i = 0; i < cd.types.length; i++) types.push(cd.types[i]);
    } catch {
      // ignore
    }
    notes.push(`clipboardData.types: ${types.join(', ') || '(none)'}`);

    // text-like types via getData
    for (const type of types) {
      if (type === 'Files') continue;
      let data = '';
      try {
        data = cd.getData(type);
      } catch (err) {
        items.push({
          type,
          source: 'paste/getData',
          text: '',
          notes: [`getData failed: ${err && err.message ? err.message : String(err)}`],
        });
        continue;
      }
      // Some browsers return empty for non-text custom formats
      items.push({
        type,
        source: 'paste/getData',
        text: data,
        notes: data === '' ? ['getData 返回空（可能是二进制/受保护格式）'] : [],
      });
    }

    // items API (more reliable for images)
    if (cd.items && cd.items.length) {
      notes.push(`clipboardData.items: ${cd.items.length}`);
      for (let i = 0; i < cd.items.length; i++) {
        const it = cd.items[i];
        notes.push(`item[${i}] kind=${it.kind} type=${it.type || '(empty)'}`);
        if (it.kind === 'file') {
          const file = it.getAsFile();
          if (file) {
            items.push({
              type: it.type || file.type || 'application/octet-stream',
              source: `paste/items[#${i}]/file`,
              file,
              size: file.size,
            });
          }
        } else if (it.kind === 'string') {
          // already covered by getData usually, but capture async string if type missing
          await new Promise((resolve) => {
            try {
              it.getAsString((str) => {
                const t = it.type || 'text/plain';
                const exists = items.some((x) => x.type === t && x.source.startsWith('paste/getData') && x.text === str);
                if (!exists) {
                  items.push({
                    type: t,
                    source: `paste/items[#${i}]/string`,
                    text: str,
                  });
                }
                resolve();
              });
            } catch {
              resolve();
            }
          });
        }
      }
    }

    // files list
    if (cd.files && cd.files.length) {
      notes.push(`clipboardData.files: ${cd.files.length}`);
      for (let i = 0; i < cd.files.length; i++) {
        const file = cd.files[i];
        const already = items.some((x) => x.file === file || (x.file && x.file.name === file.name && x.file.size === file.size));
        if (!already) {
          items.push({
            type: file.type || 'application/octet-stream',
            source: `paste/files[#${i}]`,
            file,
            size: file.size,
          });
        }
      }
    }

    // de-dupe by type+source+content length
    const seen = new Set();
    const deduped = [];
    for (const it of items) {
      const key = `${it.type}|${it.source}|${it.size || (it.text ? it.text.length : 0)}|${(it.text || '').slice(0, 32)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(it);
    }

    return { items: deduped, notes, method: 'paste' };
  }

  function buildRoot() {
    injectStyle();
    const root = el('div', { id: ROOT_ID });
    const fab = el('button', {
      className: 'ci-fab',
      title: 'Clipboard Format Inspector',
      type: 'button',
      text: 'CB',
    });
    const panel = el('div', { className: 'ci-panel' });
    const header = el('div', { className: 'ci-header' }, [
      el('div', { className: 'ci-title', text: 'Clipboard Format Inspector' }),
      el('div', { className: 'ci-sub', text: '尽可能显示剪贴板中的可用格式' }),
      el('button', { className: 'ci-close', type: 'button', text: '×', title: '关闭' }),
    ]);
    const toolbar = el('div', { className: 'ci-toolbar' });
    const btnRead = el('button', { className: 'ci-btn primary', type: 'button', text: '读取剪贴板 API' });
    const btnClear = el('button', { className: 'ci-btn', type: 'button', text: '清空结果' });
    const btnExport = el('button', { className: 'ci-btn', type: 'button', text: '导出 JSON' });
    const hint = el('div', {
      className: 'ci-hint',
      text: '浏览器安全限制：异步读取通常只能拿到标准 MIME（如 text/plain、text/html、image/png）。自定义格式、应用私有格式，多数只能在 paste 事件里看到 type 名，内容可能为空。下方粘贴区可捕获 Ctrl/Cmd+V。',
    });
    const pasteZone = el('div', {
      className: 'ci-paste-zone',
      contenteditable: 'true',
      spellcheck: 'false',
      tabindex: '0',
      text: '点这里，然后粘贴（Ctrl/Cmd+V）以捕获 clipboardData 中的所有 types',
    });
    toolbar.append(btnRead, btnClear, btnExport, hint, pasteZone);

    const body = el('div', { className: 'ci-body' });
    const status = el('div', { className: 'ci-status', html: '<strong>就绪</strong> — 点击读取，或在粘贴区粘贴内容。' });
    const list = el('div', { className: 'ci-list' });
    const empty = el('div', {
      className: 'ci-empty',
      text: '还没有结果。\n1) 先复制一段内容（可带格式/图片）\n2) 点“读取剪贴板 API”，或直接在上方区域粘贴',
    });
    list.appendChild(empty);
    body.append(status, list);

    panel.append(header, toolbar, body);
    root.append(fab, panel);
    document.documentElement.appendChild(root);

    let lastNormalized = [];
    let lastMeta = null;

    function setOpen(open) {
      root.classList.toggle('open', open);
      if (open) pasteZone.focus();
    }

    function setStatus(kind, html) {
      status.className = `ci-status ${kind || ''}`;
      status.innerHTML = html;
    }

    function clearResults() {
      lastNormalized = [];
      lastMeta = null;
      list.innerHTML = '';
      list.appendChild(empty);
      setStatus('', '<strong>已清空</strong>');
    }

    function renderItems(normalized, meta) {
      lastNormalized = normalized;
      lastMeta = meta;
      list.innerHTML = '';

      if (!normalized.length) {
        list.appendChild(el('div', {
          className: 'ci-empty',
          text: '没有读到任何可展示格式。\n可能原因：权限被拒绝、剪贴板为空、页面不在安全上下文、或格式受浏览器保护。',
        }));
      }

      for (const item of normalized) {
        const card = el('div', { className: 'ci-card' });
        const head = el('div', { className: 'ci-card-head' });
        const left = el('div', {}, [
          el('div', { className: 'ci-type', html: `${escapeHtml(item.type)}<span class="ci-badge">${escapeHtml(item.kind)}</span>` }),
          el('div', {
            className: 'ci-meta',
            text: [
              `source: ${item.source}`,
              `size: ${formatBytes(item.size)}`,
              ...(item.notes || []),
            ].join(' · '),
          }),
        ]);
        const actions = el('div', { className: 'ci-actions' });
        const copyBtn = el('button', { className: 'ci-mini', type: 'button', text: '复制文本' });
        const dlBtn = el('button', { className: 'ci-mini', type: 'button', text: '下载' });
        actions.append(copyBtn, dlBtn);
        head.append(left, actions);

        const tabs = el('div', { className: 'ci-tabs' });
        const content = el('div', { className: 'ci-content' });

        const views = [];
        if (item.kind === 'html') {
          views.push({ id: 'render', label: '渲染', render: () => {
            const box = el('div', { className: 'ci-html-view' });
            // isolate styles somewhat
            const shadowHost = el('div');
            box.appendChild(shadowHost);
            const shadow = shadowHost.attachShadow({ mode: 'open' });
            shadow.innerHTML = item.previews.html || '';
            return box;
          }});
          views.push({ id: 'source', label: 'HTML 源码', render: () => el('pre', { className: 'ci-pre', text: item.previews.source || '' }) });
        }
        if (item.kind === 'text' || item.rawText != null) {
          views.push({ id: 'text', label: '文本', render: () => el('pre', { className: 'ci-pre', text: item.rawText || item.previews.text || '' }) });
        }
        if (item.kind === 'image' && item.previews.dataUrl) {
          views.push({ id: 'image', label: '图片', render: () => {
            const wrap = el('div', { className: 'ci-img-wrap' });
            const img = el('img', { src: item.previews.dataUrl, alt: item.type });
            wrap.append(img, el('div', { className: 'ci-meta', text: item.previews.dataUrl.slice(0, 64) + '...' }));
            return wrap;
          }});
        }
        if (item.previews.hex) {
          views.push({ id: 'hex', label: 'Hex', render: () => el('pre', { className: 'ci-pre', text: item.previews.hex }) });
        }
        if (!views.length) {
          views.push({ id: 'empty', label: '空', render: () => el('pre', { className: 'ci-pre', text: '(无内容或无法读取)' }) });
        }

        // unique view ids
        const used = new Set();
        const uniqViews = [];
        for (const v of views) {
          if (used.has(v.id)) continue;
          used.add(v.id);
          uniqViews.push(v);
        }

        let active = uniqViews[0].id;
        function paint() {
          tabs.innerHTML = '';
          content.innerHTML = '';
          for (const v of uniqViews) {
            const tab = el('button', {
              className: `ci-tab${v.id === active ? ' active' : ''}`,
              type: 'button',
              text: v.label,
              onClick: () => {
                active = v.id;
                paint();
              },
            });
            tabs.appendChild(tab);
          }
          const current = uniqViews.find((v) => v.id === active) || uniqViews[0];
          content.appendChild(current.render());
        }
        paint();

        copyBtn.addEventListener('click', async () => {
          const text = item.rawText != null
            ? item.rawText
            : item.previews.hex || item.previews.dataUrl || JSON.stringify(item, null, 2);
          const ok = await copyText(text);
          copyBtn.textContent = ok ? '已复制' : '失败';
          setTimeout(() => { copyBtn.textContent = '复制文本'; }, 1200);
        });

        dlBtn.addEventListener('click', async () => {
          try {
            let blob = item.blob || item.file;
            if (!blob) {
              if (item.rawText != null) blob = new Blob([item.rawText], { type: item.type || 'text/plain' });
              else if (item.previews.hex) blob = new Blob([item.previews.hex], { type: 'text/plain' });
              else throw new Error('无可下载内容');
            }
            const safeType = (item.type || 'bin').replace(/[^\w.+-]+/g, '_');
            const ext =
              item.kind === 'image' && item.type.includes('png') ? 'png' :
              item.kind === 'image' && item.type.includes('jpeg') ? 'jpg' :
              item.kind === 'html' ? 'html' :
              item.kind === 'text' ? 'txt' : 'bin';
            downloadBlob(blob, `clipboard-${safeType}.${ext}`);
          } catch (err) {
            dlBtn.textContent = '失败';
            setTimeout(() => { dlBtn.textContent = '下载'; }, 1200);
            console.warn(err);
          }
        });

        card.append(head, tabs, content);
        list.appendChild(card);
      }

      const method = meta?.method || 'unknown';
      const noteText = (meta?.notes || []).map(escapeHtml).join('<br>');
      setStatus(
        normalized.length ? 'ok' : 'warn',
        `<strong>${normalized.length} 个格式</strong> · method: ${escapeHtml(method)}` +
        (noteText ? `<br>${noteText}` : '')
      );
    }

    async function handleReadApi() {
      setStatus('', '<strong>读取中…</strong> 浏览器可能会弹出剪贴板权限请求。');
      btnRead.disabled = true;
      try {
        const { items, notes, method } = await readViaClipboardApi();
        const normalized = [];
        for (const it of items) normalized.push(await normalizeItem(it));
        // sort: html/text/image first
        const order = { html: 0, text: 1, image: 2, files: 3, binary: 4, unknown: 5 };
        normalized.sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9) || a.type.localeCompare(b.type));
        renderItems(normalized, { notes, method });
      } catch (err) {
        setStatus('err', `<strong>读取失败</strong> — ${escapeHtml(err && err.message ? err.message : String(err))}`);
      } finally {
        btnRead.disabled = false;
      }
    }

    async function handlePaste(e) {
      // only capture when panel open and event is from our zone or while open
      if (!root.classList.contains('open')) return;
      // Prefer capturing when focus is inside panel
      if (!panel.contains(e.target) && document.activeElement !== pasteZone) {
        // still allow if paste zone focused via composition; otherwise ignore global pastes
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setStatus('', '<strong>解析 paste 事件…</strong>');
      try {
        const { items, notes, method } = await readViaPasteEvent(e);
        const normalized = [];
        for (const it of items) normalized.push(await normalizeItem(it));
        const order = { html: 0, text: 1, image: 2, files: 3, binary: 4, unknown: 5 };
        normalized.sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9) || a.type.localeCompare(b.type));
        renderItems(normalized, { notes, method });
        // clear paste zone visual junk
        pasteZone.textContent = '已捕获粘贴内容。可继续粘贴覆盖结果。';
      } catch (err) {
        setStatus('err', `<strong>paste 解析失败</strong> — ${escapeHtml(err && err.message ? err.message : String(err))}`);
      }
    }

    function exportJson() {
      const payload = {
        exportedAt: new Date().toISOString(),
        page: location.href,
        meta: lastMeta,
        items: lastNormalized.map((it) => ({
          type: it.type,
          kind: it.kind,
          source: it.source,
          size: it.size,
          notes: it.notes,
          text: it.rawText,
          hasImage: Boolean(it.previews?.dataUrl),
          hexPreview: it.previews?.hex || null,
        })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `clipboard-inspect-${Date.now()}.json`);
    }

    fab.addEventListener('click', () => setOpen(!root.classList.contains('open')));
    header.querySelector('.ci-close').addEventListener('click', () => setOpen(false));
    btnRead.addEventListener('click', handleReadApi);
    btnClear.addEventListener('click', clearResults);
    btnExport.addEventListener('click', exportJson);
    pasteZone.addEventListener('paste', handlePaste);
    // prevent the zone from accumulating pasted DOM noise
    pasteZone.addEventListener('input', () => {
      if (pasteZone.childElementCount > 0) {
        pasteZone.textContent = '点这里，然后粘贴（Ctrl/Cmd+V）以捕获 clipboardData 中的所有 types';
      }
    });

    // Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('open')) setOpen(false);
    });

    return { setOpen };
  }

  function boot() {
    buildRoot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
