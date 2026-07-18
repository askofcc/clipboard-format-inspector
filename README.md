# 剪贴板格式查看器

[English](./README.en.md) · [在线使用](https://askofcc.github.io/clipboard-format-inspector/)

低频工具，做成**单网页**更合适：需要时打开，用完关掉。

网页会尽量展示浏览器能读到的剪贴板格式（`text/plain`、`text/html`、图片、以及 paste 时能看到的自定义 type 名）。

## 在线使用

**[打开网页版](https://askofcc.github.io/clipboard-format-inspector/)**

也可以直接下载本仓库的 [`index.html`](./index.html)，用浏览器本地打开（部分浏览器对 `file://` 的剪贴板 API 限制更严，优先用在线版或本地 http 服务）。

## 功能

- **读取剪贴板 API**：`navigator.clipboard.read()`
- **粘贴捕获**：在页面粘贴区 `Ctrl/Cmd+V`，枚举 `clipboardData.types`
- 按类型展示：文本 / HTML 渲染与源码 / 图片 / Hex
- 复制、下载单项内容、导出 JSON
- 中英文切换（记住选择）
- 数据只在本地浏览器处理，不上传

## 使用

1. 复制一段内容（纯文本、富文本、图片等）
2. 打开网页
3. 点 **读取剪贴板 API**，或在粘贴区粘贴
4. 查看各 MIME 类型卡片

## 浏览器限制

网页**不能**像桌面程序那样读完系统剪贴板全部私有格式。

| 路径 | 通常能看到什么 |
|------|----------------|
| `clipboard.read()` | 标准 MIME；需要权限与安全上下文（https / localhost） |
| `paste` + `clipboardData.types` | type 列表更全；很多自定义格式内容为空 |
| 应用私有格式 | 内容基本读不到 |

## 可选：油猴脚本

如果你更想在任意网页角落随时点开，也可以装：

**[clipboard-inspector.user.js](https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js)**

主推还是单网页。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 单页工具（主推） |
| `clipboard-inspector.user.js` | 油猴脚本（可选） |
| `README.md` / `README.en.md` | 中英文说明 |
| `LICENSE` | MIT |

## 许可

[MIT](./LICENSE)
