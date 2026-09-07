# 单文件阅读器 · 能力与标注设计

`templates/reader-template.html` 是从西方哲学史 v2.0 成品抽出的通用模板，
`build-reader.py` 只负责填目录、正文和书籍元信息。改能力改模板，不要改生成脚本。

## 阅读能力

| 能力 | 说明 |
|------|------|
| 分组目录 | 按 `abridged.json` 的 groups 分组，章节缩进，完成的章打勾 |
| 全文搜索 | 侧栏筛选命中篇目，回车跳到第一处并高亮 |
| 阅读进度 | 顶部进度条 + `当前 / 总数` |
| 明暗主题 | 纸色 / 夜间，记忆到 localStorage |
| 字号 | 15–24px，记忆 |
| 续读 | 记住上次读到哪一篇 |
| 前后篇 | 按钮 + 左右方向键 |
| 离线 | 无外部依赖，双击即开 |

## 标注设计

参考的开源实现：

- [Koodo Reader](https://github.com/koodo-reader/koodo-reader)（约 2.8 万星）：阅读中轻操作，最后集中导出
- [KOReader](https://github.com/koreader/koreader)（约 2.6 万星）：导出保留章节、位置、回链
- [Readest](https://github.com/readest/readest)（约 2.2 万星）：选中即高亮，导出按章分组带颜色与时间
- [Zotero Better Notes](https://github.com/windingwind/zotero-better-notes)：标注不是最终笔记，整理后才成 Markdown
- [web-highlighter](https://github.com/alienzhou/web-highlighter)（MIT）：选区序列化与恢复
- [W3C Web Annotation](https://www.w3.org/TR/annotation-model/) / [Hypothesis](https://github.com/hypothesis/client)：TextQuoteSelector 的 exact + prefix + suffix

**四色语义**（颜色带含义，否则事后记不住当时为什么标）：

| 色 | 含义 | 浮条文案 |
|----|------|----------|
| 黄 | 重点 | 重点 |
| 蓝 | 概念 / 观点 | 观点 |
| 红 | 疑问 / 不同意 | 疑问 |
| 绿 | 启发 / 关联 | 启发 |

浮条上必须写字，不能只有色点。右侧抽屉里另有一块颜色说明。

## 定位方式

只存 DOM 路径会在改版式后全部错位。模板同时存三样：

```jsonc
{
  "exact":  "被标注的原文",
  "prefix": "前 32 字",
  "suffix": "后 32 字",
  "start":  1234,   // 篇内字符偏移
  "end":    1250
}
```

恢复顺序：先按偏移直接命中；不中则全篇找 `exact`，按 prefix/suffix 是否吻合、
与原偏移的距离加权打分，取最优。这套来自 Hypothesis 的做法。

## 存储与备份

- `localStorage`：`<slug>-annotations-v1` / `-summaries-v1` / `-completed-v1`
- 抽屉里提供「备份 JSON」「恢复 JSON」，防止清缓存丢标注
- 备份文件带 `schema` 字段，恢复时校验，不匹配直接拒绝

## 读书笔记导出

按 `groups` → 篇目组织，`showSaveFilePicker` 可用时弹保存框，否则下载。

```markdown
---
book: <bookTitle>
reading_version: v2.0-原书简读版
type: reading-notes
exported_at: 2026-09-06
completed_chapters: 12/20
annotations: 87
---

# <shortTitle> · v2.0 读书笔记

## 古希腊

### 第3章 柏拉图

#### 我的总结
……

#### 标注与批注

> 被标注的原文

- 类型：疑问/不同意
- 位置：3.2 理念论
- 我的批注：……
```

导出文件默认放**书籍根目录**，与 `原文/`、`v2.0-原书简读版/` 平级。

## 浏览器边界

单个离线 HTML 不能无提示写文件系统。点导出后由使用者选保存位置；
支持 File System Access API 的浏览器弹保存框，其余走下载。这条要在交付时讲清楚。

## 可选脑图

放 `片段/00-导读与目录.html`，编译时追加到导读末尾。

要画**阶段之间的因果**：竖向流程，每个阶段一张宽卡（关键问题 / 理论回应 / 代表人物 + 入口链接），
阶段之间插一条「为什么转向」——前一个答案留下什么困难，所以下一阶段出现。

不要做成五张并列窄卡：标题会折行，而且看不出先后关系。
中心概述要正面回答"这两千多年在研究什么根本问题"，不能只堆五个名词。
