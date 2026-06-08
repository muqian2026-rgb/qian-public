---
name: domain-learn
description: >-
  领域学习（无单一教材）：年表/框架 → 深读节点 → 交互探索 HTML。与 book-learn-distill 并列；
  Intake 时 pipeline=domain。口令：「领域学习」「年表学习」「时间机器」。
disable-model-invocation: false
---

# 领域学习 · Domain → 探索 HTML

> **人读**：[docs/domain-learn.md](./docs/domain-learn.md)  
> **模板**：[learn/_template-domain/](./learn/_template-domain/)  
> **勿用**：book-index、11 阶段强制选书（除非用户明确要求）

## 何时启动

- 「领域学习 {方向}」「年表学习 {方向}」「时间机器 {方向}」
- Intake 判定为 **无单一教材**、以 ICS/年表/行业阶段为主轴
- 「继续 learn/{slug}」且 `meta.json` 中 `"pipeline": "domain"`

**若用户要给一本主教材精读** → 改走 [book-learn-distill](../book-learn-distill/SKILL.md)。

## 执行前

1. 确认用户有 **学习仓库**（含 `learn/` 与 `作业输出/` 目录）。
2. Read [book-learn-distill prompts/intake.md](../book-learn-distill/prompts/intake.md) 完成 Intake（含 pipeline 判定）。
3. 在 `meta.json` 写入 `"pipeline": "domain"` 与 `"framework"`（见下表）。
4. 若无 `learn/<slug>/`，从 `learn/_template-domain/` 复制创建。

```bash
bash "${CLAUDE_SKILL_DIR}/../book-learn-distill/scripts/find-existing.sh" "<slug>" "<方向关键词>"
```

---

## framework 类型

| `meta.framework` | 主轴文件 | JSON |
|------------------|----------|------|
| `earth-history-book` | `01-geologic-timescale.md` | `timescale-enrichment.json` + `timeline-milestones.json` |
| `concept-tree` | `01-concept-tree.md` | 自定 enrichment |
| `industry-timeline` | `01-industry-timeline.md` | 自定 enrichment |

---

## 六阶段

| 阶段 | 产出 | 门禁 |
|------|------|------|
| 0 Intake | `meta.json` | pipeline=domain、framework |
| 1 Framework | `00-vision.md` + `01-*.md` | **确认主轴结构** |
| 2 Enrich | `*-enrichment.json` + `04-media-and-sources.md` | 开放图 URL、来源 |
| 3 Deep dives | `deepdives/<node>.md` | 关键节点深读（先 3 篇样板） |
| 4 Build HTML | `作业输出/<slug>_timemachine.html` | 浏览器验收 |
| 4b Video | `narrative-videos.json` + `assets/videos/*.mp4` | 可选；≤90s 总/子叙事 |
| 5 Optional | `skills/<slug>/` 或 wiki | 用户要 Agent 装备时 |

**状态机示例**：`intake` → `text_framework_v1` → `enriched` → `timemachine_html_v1` → `narrative_video_v1`

---

## 阶段细则

### 1 Framework

- `00-vision.md`：一句话、隐喻、子领域分工。
- `01-*.md`：主轴目录表（ID 列供 JSON/HTML 引用）。
- 可选 `02-disciplines.md`、`03-reading-guide.md`。

### 2 Enrich

- JSON `entries`：每节点 `extendedDetail`、`keyTerms`、`refs`、`media[]`（Wikimedia 等）。
- `timeline-milestones.json`：分段叙事 + `transformNodes`（变革节点）。
- 年代展示用中文「约 X 万/亿年前」；构建脚本可自动转换 Ma/Ga。

### 3 Deep dives

每篇结构：速览表 → 分节正文 → 延伸链接；配图 URL 放 enrichment，正文可不重复贴图。

### 4 Build HTML

```bash
bash skills/book-learn-distill/scripts/build-timemachine-html.sh
```

- 模板：`learn/<slug>/templates/timemachine.{html,css,js}`
- 同步：`learn/<slug>/timemachine.html` 与 `作业输出/<slug>_timemachine.*`
- 新 slug 需扩展构建脚本参数或复制已有 slug 的构建逻辑。

验收：打开 `作业输出/<slug>_timemachine.html`，检查手风琴、深读、年代展示。

### 4b Video（可选 · 全 AI ≤90s）

1. 从叙事分支写 `narrative-videos.json`（Read [prompts/video-scene.md](prompts/video-scene.md)）。
2. 人工过一遍各段的 `prompt`。
3. 生成视频后重建 HTML。

---

## 与 book-learn-distill 共享

| 共享 | 不共享 |
|------|--------|
| `learn/<slug>/`、`作业输出/` | `01-book-shortlist`、`book-index` |
| 开放图、来源标注 | Persona / 教材 compliance JSON |
| Intake 分流逻辑 | A–J 书目知识图谱 |

---

## 参考文件

- [timeline-milestones.schema.md](references/timeline-milestones.schema.md) — JSON 字段说明
- [video-scene.md](prompts/video-scene.md) — 分镜与 API 生成
- [learn/_template-domain/](./learn/_template-domain/) — 起步模板
