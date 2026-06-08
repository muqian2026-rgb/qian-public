# 体系学习 · 图谱字段（pipeline: system）

在 [output-modes.md](./output-modes.md) A–J 基础上扩展。

## meta

- `pipeline`: `"system"`
- `sourceRoot`: 业务认知相对路径
- `modules[]`: `{ id, title, sourceFile, order, dependsOn[] }`

## system

- `actors[]`: `{ id, label, goal }`
- `principles[]`, `constraints[]`

## 节点类型

| type | 说明 |
|------|------|
| `strategy-module` | 对应 modules[] 中的一章 |
| `decision-rule` | 可执行规则/策略点 |
| `metric` | 指标与验收 |

## K · 流程

- 数据：`06-flows.json` → `flows[].mermaid`
- HTML：`#flows`，Mermaid 10

## 标杆

[learn/wyc-trading-strategy/](../../../learn/wyc-trading-strategy/)
