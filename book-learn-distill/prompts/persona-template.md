# Persona · 把作者蒸馏成 K 区"老师视角"

> 阶段 **6a Persona**（可选）。当被蒸馏的书有公开方法论 + 强烈作者风格时，做 persona 能让 K 区从"关键词检索"升级为"老师亲自答疑 + 推荐原文巩固"。

---

## 何时做

| 适合 | 不适合 |
|---|---|
| 作者有标志性方法论（俞军用户价值公式 / Don Norman 设计原则 / Christensen 颠覆理论） | 编辑合集 / 多人合著 / 历史档案 |
| 作者有强烈表达风格（口头禅、反问、金句） | 译著且原作者立场分散 |
| 已经有作者的 AI Skill 文件（`~/.claude/skills/<author>.md`） | 作者立场不可考 |

---

## 工作流（30-60 分钟）

```
1. 找作者 skill   → ~/.claude/skills/<author>.md（如 yujun.md）
2. 浓缩成 7±2 个模型 → learn/<slug>/book-persona.json
3. 在意图匹配上自测   → 列 10 个用户可能问的问题，看命中率 ≥ 80%
4. 重 build          → bash scripts/build-preview-html.sh <slug>
5. 浏览器实测       → K 区输入自然语言，看俞老师卡片是否出现
```

---

## Schema 速览（详见 `templates/book-persona.schema.json`）

```json
{
  "persona": {
    "name": "俞军",
    "tagline": "前百度产品总监 · 《俞军产品方法论》作者",
    "intro": "用户的本质是需求集合，好产品的本质是可持续的价值交换。",
    "principles": ["不接受没有用户模型的讨论", "对「数据好」持怀疑", ...]
  },
  "models": [
    {
      "id": "good-product",
      "title": "好产品三要素",
      "keywords": ["好产品", "画像", "三要素", "特征", "什么是好产品"],
      "core": "好产品必须**同时**满足三件事——①**有效用** ②**有利润** ③**可持续**。",
      "callout": "数据好不是好产品的证据，可持续复购才是。",
      "questions": [
        "这个产品对哪类用户有真实效用？",
        "利润模型撤掉补贴还成立吗？",
        "这个交易下次还会发生吗？"
      ],
      "bookSearchTerms": ["好产品", "三属性", "可持续"],
      "sectionRefs": ["§1.3.4", "§2.5"]
    }
  ]
}
```

---

## 写 keywords 的 5 条心法

1. **包含「白话提问句」**：用户不会输入「用户价值公式」，他会问「用户价值怎么算」「要不要做这个功能」——把这些问句拆词放进 keywords
2. **覆盖中英文 / 大小写**：`["PM", "pm", "产品经理"]` 同义都加上
3. **避免单字**：单字（"用"、"做"）噪声太大；keywords 元素长度 ≥ 2
4. **覆盖同义词与反问**：「好产品」要带「成功产品」「合格产品」「画像」「特征」
5. **避开通用名词**：「问题」「方法」这种命中得分太宽，慎用

> 命中算法：`q.toLowerCase().includes(keyword.toLowerCase()) → score += keyword.length`。每个模型取最高分，阈值 ≥ 2 才命中。

---

## 写 core 的 3 条心法

1. **保留作者原话**：能直接抄方法论就别复述，作者声音是 Persona Card 的灵魂
2. **支持 markdown bold**：用 `**关键词**` 让公式/术语在深色卡里突出（会被渲染成琥珀色）
3. **控制长度**：120-180 字最佳；太长被截断，太短没料

---

## 写 questions 的 3 条心法

1. **是反问不是答疑**：「这个用户是谁？」不是「这个用户是 XX」——逼用户自己想
2. **保留作者口头禅**：俞军的「旧方案是什么？」「替换成本算过吗？」是 signature
3. **2-4 条**：太多变啰嗦；3 条是黄金数

---

## 一键起初稿

```bash
python3 skills/book-learn-distill/scripts/init-persona-from-skill.py \
  --skill ~/.claude/skills/yujun.md \
  --out learn/<slug>/book-persona.json
```

会从 skill 文件结构提取章节、keywords、口头禅作初稿，**仍需人工调优**：补 keywords / 改 core 字数 / 关联 sectionRefs。

---

## 命中率自测清单

写完 persona 后，跑这 10 个测试问题，命中数应 ≥ 8：

```text
1. 什么是好产品？             → good-product
2. 用户价值怎么算？           → user-value-formula
3. 怎么降低交易成本？         → transaction-cost
4. 数据涨了就是产品做对了吗？  → decision-rationality
5. PM 该怎么选？             → pm-select-grow
6. 什么是用户？               → user-model
7. 为什么有企业？             → enterprise-org
8. 怎么留住团队？             → pm-select-grow
9. 我们要做高端用户群体        → user-model
10. AB 测试可信吗？           → decision-rationality
```

未命中时调 keywords 而不是改 core。
