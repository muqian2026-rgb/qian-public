# 装备形态与知识图谱规格

## 默认双交付

1. `skills/<slug>/` — Agent 调用  
2. `作业输出/<slug>_知识图谱.html` — 人读与探索  

## 知识图谱 HTML · 区块 A–J（全部必做）

| 区块 | ID | 数据源字段 |
|------|-----|------------|
| A 方向总览 | `#overview` | meta, theory.definition, theory.notThis |
| B 核心理论 | `#theory` | theory.pillars, theory.coreClaims |
| C 交互图谱 | `#graph` | nodes, edges |
| D 争议解读 | `#controversies` | controversies |
| E 阅读路径 | `#reading-path` | readingPath |
| F 证据置信度 | 侧边栏 | nodes[].sources, confidence |
| G 已有认知 | `#existing` | existingKnowledgeLinks |
| H 应用桥 | `#skill-bridge` | nodes[].skillRef |
| I 误区 | `#misconceptions` | misconceptions |
| J 术语表 | `#glossary` | glossary |

## 节点 / 边类型

**节点**：concept, framework, author/school, heuristic, misconception, external-theory, your-position  

**边**：is-a, part-of, causes, enables, contradicts, extends, prerequisite, analog-to, cites, cross-domain  

## 可选第三形态

| 形态 | 何时 |
|------|------|
| wiki-only | 争议未闭合，暂不生成 skill |
| methodology 片段 | 已内化 → immortals/倩/methodology.md 3–5 行 + 链 wiki |
| Sub-agent | 需固定「唱反调」人格 → immortals/<名>/ 轻量套 |

## Excalidraw

流程/泳道图 **不替代** HTML 图谱；仅用户明确要求时额外产出。
