# 剪贴板格式查看器

[English](./README.en.md) · **正式地址：[https://clip.srint.cn/](https://clip.srint.cn/)**

低频工具，做成**单网页**：需要时打开，用完关掉。

> **唯一自定义域名：`clip.srint.cn`**
> 由 Cloudflare Pages 托管（国内访问通常比 `github.io` 更稳）。
> 仓库推送后可自动部署，不必维护两套代码。

## 在哪里用

| 入口 | 说明 |
|------|------|
| **https://clip.srint.cn/** | 正式入口（Cloudflare Pages + 自定义域名） |
| GitHub Pages | 备用：`https://askofcc.github.io/clipboard-format-inspector/` |
| 本仓库 `index.html` | 本地打开（`file://` 下剪贴板 API 可能受限） |

## 功能

- 读取剪贴板 API：`navigator.clipboard.read()`
- 粘贴捕获：枚举 `clipboardData.types`
- 文本 / HTML 渲染与源码 / 图片 / Hex
- 复制、下载、导出 JSON
- 中英文切换
- 本地处理，不上传剪贴板内容

## 部署与维护成本

**很低。** 只有这一份仓库：

1. 改 `index.html` 等文件并 push 到 `main`
2. GitHub Pages 自动更新（GitHub 自带）
3. Cloudflare Pages 通过 GitHub Action 自动部署（需一次性配置 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`）

没有两套业务代码，只是**同一产物两个托管出口**；平时维护 ≈ 改一个文件 + push。

## 浏览器限制

网页不能像桌面程序那样读完系统剪贴板全部私有格式。标准 MIME 通常可读；自定义格式多半只能看到 type 名。

## 可选：油猴脚本

[clipboard-inspector.user.js](https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js)

主推仍是单网页。

## 许可

[MIT](./LICENSE)
