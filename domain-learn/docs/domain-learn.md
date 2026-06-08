# 领域学习工作流 · domain-learn

> **版本**：v1.0（公开发布副本）  
> **编排 Skill**：[SKILL.md](../SKILL.md)  
> **对照**：[book-learn-distill](../book-learn-distill/)（管线 A · 书驱动）

---

## 1. 这是什么

把「学一个**领域**」（无单一权威教材、或年表/时间轴为主轴）变成可重复流程：

| 输入 | 学习方向 + 权威结构（年表、ICS、行业阶段等） |
| 过程 | 愿景 → 主轴目录 → 开放资料 enrichment → 关键节点深读 → 交互 HTML |
| 输出 | ① **交互探索 HTML**（人读）② 可选 **薄 Domain Skill** / wiki 沉淀 |

**结构示例**：[domain-timemachine-demo](https://muqian2026-rgb.github.io/qian-public/demo/domain-timemachine-demo.html)（合成数据）

---

## 2. 与读书蒸馏（管线 A）怎么选

Intake 时定 `meta.json` → `"pipeline": "book" | "domain"`。

| 信号 | 走 **domain**（本工作流） |
|------|---------------------------|
| 用户说学科 / 年表 / 时间轴 / 无单一教材 | 是 |
| 科学史、地质年代、行业演进时间线 | 是 |
| 明确不要围绕一本书 | 是 |
| 否则 | **book-learn-distill** |

---

## 3. 目录结构

在你的学习仓库中创建：

```
learn/<slug>/
├── meta.json                 # pipeline: "domain"
├── 00-vision.md              # 愿景与隐喻
├── 01-<spine>.md             # 主轴（年表 / 概念树）
├── 03-reading-guide.md       # L0/L1/L2 阅读深度
├── 04-media-and-sources.md   # 开放配图与外链索引
├── *-enrichment.json         # 机器可读扩展
├── timeline-milestones.json  # 可选：分段叙事 + 变革节点
├── deepdives/                # 关键节点 Markdown 深读
├── templates/                # HTML/CSS/JS 模板
└── 99-changelog.md
```

定稿 HTML：`作业输出/<slug>_timemachine.html`

从 [learn/_template-domain/](../learn/_template-domain/) 复制新建方向。

---

## 4. 六阶段

| 阶段 | 产出 | 门禁 |
|------|------|------|
| 0 Intake | `meta.json` | pipeline=domain、framework |
| 1 Framework | `00-vision` + `01` 主轴 | 确认年表/结构 |
| 2 Enrich | enrichment JSON + `04-media` | 开放图 URL、来源 |
| 3 Deep dives | `deepdives/*.md` | 关键节点 ≥3 篇样板 |
| 4 Build HTML | timemachine HTML | 浏览器验收 |
| 4b Video（可选） | narrative-videos + mp4 | ≤90s 叙事 |
| 5 Optional | 薄 skill / wiki | 需 Agent 可调用时 |

**不做**（除非用户明确要求）：book-index、PDF 全书 ingest、11 阶段选书门禁。

---

## 5. framework 类型

| framework | 说明 |
|-----------|------|
| `earth-history-book` | 地质年表 + 时间隐喻 |
| `concept-tree` | 概念树 / 技能树 |
| `industry-timeline` | 行业阶段时间轴 |

---

## 6. 构建与预览

```bash
bash skills/book-learn-distill/scripts/build-timemachine-html.sh
```

需在你的学习仓库配置 `learn/<slug>/` 与构建脚本路径。

---

## 7. 合规与配图

- 配图优先 **Wikimedia Commons** 等开放许可；条目内写 `credit`。
- 不 ingest 盗版全书 PDF 冒充「学科教材」。
- **深读原文不公开发布**；公开库仅提供结构与模板。

---

## 8. 启动口令

```
领域学习 <方向>
年表学习 <方向>
时间机器 <方向>
继续 learn/<slug>   # 且 meta.pipeline === "domain"
```

Agent 应 Read `domain-learn/SKILL.md`，勿默认走 11 阶段选书。
