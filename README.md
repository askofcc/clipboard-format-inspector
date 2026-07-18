# 剪贴板格式查看器（油猴脚本）

[English](./README.en.md)

一个用于查看网页剪贴板中**多种格式**的 Tampermonkey / Violentmonkey 用户脚本。

复制富文本、图片或带格式内容后，脚本会尽量把浏览器能读到的 MIME 类型列出来，并展示文本、HTML 源码/渲染、图片预览、二进制 Hex 等。

## 功能

- 右下角悬浮按钮 **CB**，一键打开检查面板
- **读取剪贴板 API**：通过 `navigator.clipboard.read()` 获取标准格式
- **粘贴捕获**：在面板粘贴区 `Ctrl/Cmd+V`，枚举 `clipboardData.types`（自定义 type 名更全）
- 按类型展示：
  - `text/*` → 文本
  - `text/html` → 渲染预览 + HTML 源码
  - `image/*` → 图片预览
  - 二进制/不可读明文 → Hex 预览
- 支持复制文本、下载单项内容、导出 JSON

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. 打开脚本文件安装：

   **[点击安装 clipboard-inspector.user.js](https://raw.githubusercontent.com/askofcc/clipboard-format-inspector/main/clipboard-inspector.user.js)**

3. 刷新任意网页，点击右下角 **CB**

也可以把仓库里的 `clipboard-inspector.user.js` 内容复制到油猴「添加新脚本」中保存。

## 使用

1. 在任意应用中复制内容（纯文本、网页富文本、截图/图片等）
2. 打开脚本面板
3. 任选一种方式：
   - 点 **读取剪贴板 API**（可能弹出权限请求）
   - 或在面板粘贴区粘贴（适合查看更多 type 名称）
4. 在结果卡片中切换预览、复制或下载

## 浏览器限制（重要）

网页环境**不能像桌面程序那样**完整读取系统剪贴板的所有私有格式。

| 路径 | 通常能看到什么 |
|------|----------------|
| `clipboard.read()` | 标准 MIME：`text/plain`、`text/html`、`image/png` 等；需要权限，且一般要求 https / localhost |
| `paste` + `clipboardData.types` | type 列表更全，有时能看到自定义名称；很多自定义格式 `getData()` 为空 |
| 系统/应用私有格式（如部分 Office 内部格式） | 网页基本读不到内容，最多偶尔看到 type 名 |

本脚本的策略是：**API 读标准格式 + paste 尽量枚举 types**。有内容就展示，没内容也会保留 type 名与来源信息。

## 文件

| 文件 | 说明 |
|------|------|
| `clipboard-inspector.user.js` | 用户脚本本体 |
| `README.md` | 中文说明 |
| `README.en.md` | English docs |
| `LICENSE` | MIT |

## 许可

[MIT](./LICENSE)
