---
name: book-learn-distill
description: >-
  读书蒸馏：学习方向 → 权威选书 → 知识骨架 → PDF 校验 → 人机思辨 → 双交付物（Domain Skill +
  知识图谱 HTML）。口令：「学一下」「读书蒸馏」「/book-learn」。续跑：「补了 PDF」「继续 learn/<slug>」。
disable-model-invocation: false
---

# 读书蒸馏 · Book → Skill + 知识图谱

> **人读**：[docs/book-learn-distill.md](../../docs/book-learn-distill.md)  
> **工作区**：[learn/](../../learn/)  
> **双交付物**：`skills/<slug>/` + `作业输出/<slug>_知识图谱.html`  
> **并列管线**：无单一教材/年表为主 → [domain-learn](../domain-learn/SKILL.md)（`meta.pipeline`: `"domain"`）

## 何时启动

- 「学一下 {方向}」「读书蒸馏 {方向}」「/book-learn {方向}」（Intake 判定为 **book** 时）
- 「继续 learn/{slug}」「补了 PDF」「二次校验 {方向}」「融合已有 {slug}」
- 混任务（PDF + wiki + skill + 图谱）→ 先 **task-orchestrator**，本 Skill 为主链

## 执行前

1. 确认仓库根为 **蒸馏自己**。
2. Read `${CLAUDE_SKILL_DIR}/prompts/intake.md` 完成 Intake（可 3 问）。
3. 将方向转为 **slug**（小写英文连字符，如 `behavioral-economics`）。
4. 若无 `learn/<slug>/`，从 `learn/_template/` 复制；`meta.pipeline` 必须为 `"book"`（缺省视为 book）。
5. 若 Intake 判定为 **domain**，停止本 Skill，改 Read [domain-learn](../domain-learn/SKILL.md)。

```bash
# 扫是否已有同方向
bash "${CLAUDE_SKILL_DIR}/scripts/find-existing.sh" "<slug>" "<方向中文关键词>"

# 定稿后同步全局 skill（可选）
bash "${CLAUDE_SKILL_DIR}/scripts/sync-global-skills.sh" "<slug>"
```

---

## 八阶段（每阶段结束须等人确认再继续）

| 阶段 | 产出文件 | 门禁 |
|------|----------|------|
| 0 Intake | `meta.json` 更新 | 方向一句话 |
| 1 Discover | `01-book-shortlist.md` | **确认书目** |
| 1b Source | `01b-source-discovery.md` | **确认合法电子书源与 ingest 范围** |
| 2 Skeleton | `02-skeleton.md` | **确认骨架** |
| 3 Ingest | `wiki-knowledge-base/raw/books/*.md` | 有 PDF 时执行 docling-ingest |
| 4 Synthesize | `03-core-synthesis.md` + wiki 页 | **确认理论与争议** |
| 5 Debate | `04-human-review.md` | **确认立场** |
| 6 Equip | `06-graph-data.json` + `knowledge-graph.html` + `skills/<slug>/` + `skill-activation-test.md` | **确认图谱、skill、激活测试** |
| **6a Persona**（可选） | `book-persona.json` | **K 区问答有作者视角时启动** |
| **6b Compliance** | `book-compliance.json` | **内联了原文索引则必做** |
| **6c Design Calibration**（可选） | `DESIGN.md` 复用 | 新加组件先回模板对照 |
| 7 Merge | `05-merge-diff.md` + wiki/synthesis 更新 | **确认合并策略** |

**状态机**（写入 `meta.json` → `status`）：
`intake` → `books_confirmed` → `skeleton_confirmed` → `ingesting` → `synthesis_confirmed` → `graph_confirmed` → `equipped` → `compliance_confirmed` → `merged`

---

## 阶段细则

### 1 Discover · 选书

Read `${CLAUDE_SKILL_DIR}/prompts/book-rubric.md`。输出 `01-book-shortlist.md`，含评分表与数据源。**暂停**。

### 1b Source · 合法电子书源（新增）

Read `${CLAUDE_SKILL_DIR}/prompts/source-discovery.md`。对每本入选书：

1. 查作者官网 / 出版社开放章节 / 课程 syllabus（**仅链接**）。  
2. 用 Tier A–D–X 分级；**禁止** Tier X ingest。  
3. 输出 `01b-source-discovery.md`（URL 表 + ingest 顺序 + GitHub 结论）。  

可选脚本（登记模板）：

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/discover-sources.sh" "<slug>"
```

**暂停** — 等人确认 ingest 范围后再下载与 docling。

### 2 Skeleton · 无 PDF 骨架

- 仅目录、序言、书评、百科级概念。
- 禁止「第 X 章指出」；`model-prior` 标红。
- 模板见 `${CLAUDE_SKILL_DIR}/prompts/synthesis-template.md` 之 Skeleton 节。

### 3 Ingest

```bash
bash skills/docling-ingest/scripts/docling-to-raw.sh "/path/to/book.pdf"
# 建议移动到或登记为 wiki-knowledge-base/raw/books/
```

再按 `wiki-knowledge-base/WIKI_SCHEMA.md` ingest。

### 4–5 Synthesize & Debate

- 填 `03-core-synthesis.md`（理论支柱、观点、框架、证据索引）。
- 争议表：命题 / 阵营 A·B / 适用条件；思辨用固定三问（见 docs）。
- 你的立场写入 `04-human-review.md`。

### 6 Equip · 双交付物

1. **编辑** `06-graph-data.json`（schema 见 `templates/graph-data.schema.json`）。
2. **生成 HTML**：运行 `bash scripts/build-preview-html.sh <slug>`，自动内联 GRAPH_DATA + BOOK_INDEX + 扩展 JSON + **完整应用 JS**（单文件可 `file://` 打开），并同步到 `learn/<slug>/knowledge-graph.html`。
3. **QA 门禁（自动）**：build 结束后运行 `qa-verify-html.py`；P0 失败则 build 退出码 1。清单见 `prompts/qa-html-checklist.md`（对齐 `qa` skill）。
4. **Domain Skill**：
   - 默认：按 `${CLAUDE_SKILL_DIR}/prompts/skill-abstract.md` 生成 `skills/<slug>/`。
   - **复杂方法论书**（同时有「分析」与「产出」两类任务）：拆 **diagnose / apply** 双 Skill → `skills/<slug>/diagnose/` + `skills/<slug>/apply/`（模板见 `ai 学习日志/learnings/2026-06-agent-architecture/templates/diagnose-apply-split.md`）。
5. **Skill 激活测试（必过）**：Read `${CLAUDE_SKILL_DIR}/prompts/skill-activation-test.md`，填写 `learn/<slug>/skill-activation-test.md`（5 种触发 + 3 种误触发 + 自问）；通过后写 `meta.json` → `skillTestedAt`。**未通过不得标 `equipped`**。
6. 运行 `sync-global-skills.sh <slug>`（若需全局可调用）。

### 6a Persona（可选）· 作者视角 K 区问答

当被蒸馏的书有**强烈作者风格 + 公开方法论 + 已有 AI Skill** 时启动。让 K 区从"关键词检索"升级为"作者亲自答疑 + 引导原文巩固"。

```bash
# 一键起初稿
python3 ${CLAUDE_SKILL_DIR}/scripts/init-persona-from-skill.py \
  --skill ~/.claude/skills/<author>.md \
  --out learn/<slug>/book-persona.json \
  --name "作者名" --tagline "身份标签"

# 人工调优：keywords / core / sectionRefs（见 prompts/persona-template.md）
```

完整指南：`${CLAUDE_SKILL_DIR}/prompts/persona-template.md`  
Schema：`${CLAUDE_SKILL_DIR}/templates/book-persona.schema.json`

**自测**：10 道白话提问命中率 ≥ 80%。

### 6b Compliance · 内部分享合规（默认必做）

**任何内联了 ≥10% 原文索引的项目必须做。** 配置存于 `learn/<slug>/book-compliance.json`，build 时自动注入 banner / 水印 / 禁复制 / 页脚 takedown。

```jsonc
// 留空使用默认（内部敏感模式：水印 + 禁复制 + AI 标识全开）
{}
```

```jsonc
// 公有领域/原创：完全关闭
{ "enabled": false }
```

完整字段与三种典型场景配置：`${CLAUDE_SKILL_DIR}/prompts/compliance-template.md`

部署清单：
- 内网/飞书空间登录可见，**不上公网**
- HTML 文件名带日期版本号 `_v20260520.html`
- 整理人邮箱必须真实可达，能 24h 响应 takedown

### 6c Design Calibration（可选）· 视觉血缘对齐

新加 UI 组件前，先回 `${CLAUDE_SKILL_DIR}/templates/DESIGN.md` 对照「参考件」，遵循 §11 元规则：
1. 永远 panel-card + hairline border + 12px 圆角
2. 任何新颜色都先看是否已有
3. 暗色块只出现在「Hero / Answer Card / 重要 callout」
4. 任何 chip/tag 都是「浅底 + 深字 + 1px 同色 border」三件套
5. 加阴影前先考虑是否能用 border 解决

防止冒出第 4 套蓝色或第 3 套阴影。

### 7 Merge

- 运行 `find-existing.sh` 的结果写入 `05-merge-diff.md`。
- 策略：replace | layer | fork（等人选）。
- replace 时旧 skill 移至 `历史的skill/<slug>-archived-YYYYMMDD/`。

---

## 知识图谱 HTML · 必含区块

| 区块 | 内容 | 备注 |
|------|------|------|
| A | 方向总览 | 一句话 + 不是什么 + 元数据 |
| B | 核心理论（含 B1 全书理论框架，叶子节点显示 summary，关键词点击 popover） | 删除了 B2 五章地图（与 B1 冗余） |
| C | 可交互图谱（节点点击侧栏含 deepDive / quotes / sectionRef 阅读原文） | |
| E | 路径阅读（左 sticky 章节树 + 右 docs 风格正文）| 取代旧"推荐阅读路径"按钮列 |
| **K** | 书内问答（先答案后引用原文；命中 persona 模型则用作者视角） | 新增；取代旧 D 争议区 |
| G | 与已有认知 | |
| H | 应用桥 → Skill | |
| I | 常见误区（对错对比卡片 + 章节筛选） | 重构自原"误区速览" |
| J | 术语云（搜索 + 章节着色 + 详情面板） | 重构自原"术语表" |

> ⚠ 已移除：~~D 争议与解读~~（与 B/I 冗余）、~~F 证据~~（合并入节点 sidebar）

详见 `${CLAUDE_SKILL_DIR}/references/output-modes.md`。

---

## 约束

- **版权**：默认 `book-compliance.json` 必填；内联原文索引 > 10% 时自动启用 banner+水印+禁复制
- **AI 标识**：使用 Persona Card 时必须在卡内显示「AI 模拟 · 非作者本人」
- **个人解读**：节点的 "PM 应用 / 行业类比" 必须在 footer 声明为整理者个人观点
- 单次默认 ≤3 本书。
- 未确认争议不写 `immortals/倩/personality.md`。
- wiki = 世界模型；immortals = 默认决策。

---

## 与其它 Skill

| 辅助 | 何时 |
|------|------|
| docling-ingest | PDF → raw |
| WIKI_SCHEMA | raw → wiki |
| d3-charts / open-design-main | 图谱版式微调（可选） |
| excalidraw-diagram | 仅流程/泳道草图，不替代 HTML 图谱 |
| task-orchestrator | 多类型混任务 |
