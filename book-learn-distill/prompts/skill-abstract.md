# Domain Skill 生成模板

路径：`skills/<slug>/`（复杂书可拆 `skills/<slug>/diagnose/` + `skills/<slug>/apply/`，见 `prompts/skill-activation-test.md`）

## `SKILL.md` frontmatter

```yaml
---
name: <slug>
description: >-
  <一句话：何时触发本方向能力>。来源：读书蒸馏 <书目简写>。知识图谱：作业输出/<slug>_知识图谱.html
disable-model-invocation: true
---
```

## 正文结构

1. **定义与边界**（是什么 / 不是什么）  
2. **何时使用**（触发场景，对齐 Intake contexts）  
3. **核心判断**（3–7 条可执行句，来自 03-core-synthesis）  
4. **推荐框架**（名称 + 步骤要点 + 反例）  
5. **争议下的默认立场**（仅写 04-human-review 已确认的）  
6. **检查清单**（调用本 skill 时逐步核对）  
7. **证据** → `references/book-evidence.md`（章节索引，无全文）  
8. **知识图谱** → `../../作业输出/<slug>_知识图谱.html`

## `references/quick-reference.md`

一页速查：支柱 + 框架 + 关键术语。

## `meta.json`

```json
{
  "slug": "",
  "version": 1,
  "sources": [],
  "distilledFrom": "book-learn-distill",
  "graphHtml": "作业输出/<slug>_知识图谱.html"
}
```
