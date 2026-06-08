# Compliance · 内部分享合规配置

> 阶段 **6b Compliance**。任何包含书内原文索引的项目，**默认必须开启合规水印 + 禁复制**。如要关闭，需在 `06-graph-data.json` 的 `meta` 中注明授权信息。

---

## 风险分级（决定要不要做这一步）

| 项目情况 | 风险 | 必做项 |
|---|---|---|
| **内联了全书 200+ 段原文** | 🔴 高 | Banner + 水印 + 禁复制 + Footer + Takedown 全开 |
| 仅章节摘要 + 不超过 10% 原文摘录 | 🟡 中 | Banner + Footer + AI 标识 |
| 完全用自己语言改写 + 公开范围 | 🟢 低 | 仅 Footer 版权署名 |
| 出版方已开放 / 公有领域 | ⚪ 无 | 标明许可证即可 |

---

## 配置文件位置

```
learn/<slug>/book-compliance.json
```

构建时由 `build-preview-html.sh` 自动内联到 `window.COMPLIANCE`，前端覆盖默认值。

---

## 完整 schema（每个字段都有默认值）

```json
{
  "enabled": true,
  "banner": "⚠ 学习用途 · 仅限公司内部分享 · 不得公开传播 / 转载 / 外发 / 商用 · 请支持正版",
  "watermark": "内部分享内容 · 禁止转发",
  "noCopy": true,
  "noContextMenu": true,
  "footer": {
    "copyright": "© 俞军 · 机械工业出版社（原著版权）",
    "curator": "内部学习材料 · 团队内部读书会整理",
    "contact": "反馈/纠错：请联系组织者",
    "aiNote": "「俞军答」内容由 AI 基于公开方法论模拟生成，不代表俞军本人立场，仅作学习启发用。",
    "personalNote": "图谱节点的「PM 应用 / OTA 类比」是整理者的个人解读，不属于原书内容。",
    "takedown": "⚠ 本页面包含原书摘录段落，仅供内部学习。禁止外传、禁止上传公网、禁止用于对外营销/培训。如俞军老师本人或出版方认为侵权，请联系整理者即下架。"
  }
}
```

---

## 字段含义

| 字段 | 类型 | 说明 |
|---|---|---|
| `enabled` | bool | 总开关。`false` 时所有合规元素都不渲染（仅用于公有领域或自己原创内容） |
| `banner` | string | hero 下方琥珀警示条文案 |
| `watermark` | string | 全屏对角线重复水印文字。短句最佳（10-15 字） |
| `noCopy` | bool | 禁选、禁复制、禁剪切、禁拖拽。输入框内豁免 |
| `noContextMenu` | bool | 禁右键菜单。仅在 `noCopy=true` 时生效 |
| `footer.copyright` | string | 版权署名行 |
| `footer.curator` | string | 整理人 / 团队 |
| `footer.contact` | string | 反馈渠道 |
| `footer.aiNote` | string | AI 模拟声明（Persona Card 用了 AI 答案时必填） |
| `footer.personalNote` | string | 个人解读声明（图谱节点有 PM 应用/类比时必填） |
| `footer.takedown` | string | 下架通知（如何联系下架） |

---

## 三种典型配置

### A · 内部敏感（默认）

```json
{ }
```

留空即可，默认配置就是这种。Banner + 水印 + 禁复制全开。

### B · 开放课堂用（无水印但要署名）

```json
{
  "watermark": "",
  "noCopy": false,
  "noContextMenu": false,
  "banner": "学习用途 · 课堂教学材料 · 转发请保留署名",
  "footer": {
    "curator": "课程：产品方法论 · 讲师：XX",
    "takedown": "本材料仅供课堂使用。如认为侵权请联系即下架。"
  }
}
```

### C · 公有领域/原创（完全关闭）

```json
{ "enabled": false }
```

> 注意：即使关闭合规模块，**仍建议保留 footer 的版权署名**，可单独通过 CSS 显示。

---

## 部署清单

1. **谁可见**：放在公司内网 / 飞书空间 / SSO 后面，**不要**上公网 URL
2. **谁有权限改 compliance**：建议固定整理人，不要让团队人人改
3. **审计**：HTML 文件名带日期 `_v20260520.html`，方便追责
4. **下架预案**：takedown.contact 必须真实可达，出问题 24h 内能联系到整理者

---

## 法务最常追问的 3 个问题（提前准备答案）

1. **"原文用了多少？"** → 全书约 N 万字，索引 M 段，摘录显示上限 480 字/段
2. **"以谁名义发布？"** → 个人学习笔记 / 团队读书会，不署公司名
3. **"外网可见吗？"** → 仅内网/飞书空间登录可见，无公网链接

---

## 与 `06-graph-data.json` 的关系

`meta.compliance` 字段也可以放一份摘要，便于后续审计：

```json
{
  "meta": {
    "title": "俞军产品方法论",
    "compliance": {
      "level": "internal-strict",
      "scope": "公司内部团队读书会",
      "deployed": "飞书空间 / 内网",
      "curator": "[团队/姓名]",
      "lastReview": "2026-05-20"
    }
  }
}
```

这个字段不影响渲染，只是元数据备案。
