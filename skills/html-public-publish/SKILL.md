---
name: html-public-publish
description: >-
  将本地 HTML 发布为外网可访问的静态页（默认 Surge.sh），成功后在标准输出打印一行 https URL。
  需一次性配置 SURGE_LOGIN + SURGE_TOKEN；不得上传含敏感/未脱敏商业数据的文件。
  若用户未给出 HTML 路径，须向其确认路径，不得擅自假定。
disable-model-invocation: false
---

# 外网可访问 HTML 发布

将单页 HTML 发布到公网 `*.surge.sh`，流程：**准备文件 → 上传 → stdout 一行 URL**。

## 与内网方案的对应

| 企业内网静态页 | 本 Skill |
|----------------|----------|
| 预签名上传 + 内网域名 | `npx surge` 推送到 Surge CDN |
| 需 VPN | 公网任意访问 |

## 一次性配置

1. 安装 [Surge](https://surge.sh/) 账号（免费）：邮箱注册。
2. 获取 token：本机执行 `npx surge@latest token`，得到 **token**。
3. 在 shell 配置或发布前导出：

```bash
export SURGE_LOGIN="你的邮箱"
export SURGE_TOKEN="你的 token"
```

仅保存在本机环境变量或私密 `.env`，**不要提交 git**。

## 脚本位置与用法

脚本：[`scripts/publish-html-public.mjs`](scripts/publish-html-public.mjs)

```bash
node skills/html-public-publish/scripts/publish-html-public.mjs --file /path/to/page.html
# 指定子域（可选；已被占用时会自动换随机子域重试）
node skills/html-public-publish/scripts/publish-html-public.mjs --file ./report.html --subdomain my-demo-2026
```

- 需要 **Node.js ≥ 18**。
- 会将 HTML 复制为临时目录中的 `index.html` 再发布（单页站点根路径即你的页面）。

## 智能体注意事项

1. **路径**：必须由用户提供明确本地 `.html` 路径；不得猜测。
2. **敏感内容**：战略、客户、内部数据默认**不**建议发公网；若用户坚持，需提示风险并可建议先脱敏。
3. **输出**：将脚本 **标准输出的最后一行 URL** 回复给用户即可。

## 不用 Surge 时的备选（人工）

- [Netlify Drop](https://app.netlify.com/drop) 拖拽文件夹（内含 `index.html`）。
- 自有 OSS + 静态网站托管按各云文档配置。

## 更新 / 下线

- **更新**：对同一 `--subdomain` 再执行一次发布即可覆盖。
- **下线**：Surge 控制台删除项目；无法仅靠本脚本「一键删站」。
