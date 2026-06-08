# book-learn-distill

> 把「读一本书」做成可重复、可继承、可合规的工程流水线。  
> **输入**：一个学习方向 + 权威书目  
> **输出**：① Domain Skill（Agent 可调用）② 知识图谱 HTML（人可探索）

跑在 [Cursor](https://cursor.com) / Claude Code 上的 Agent Skill：选书 → 骨架 → PDF 校验 → 人机思辨 → 双交付物。

**本目录位于** [qian-public](https://github.com/muqian2026-rgb/qian-public) 仓库内，是作者唯一对外发布的 Skill 源码。

---

## 30 秒看懂

| | |
|---|---|
| **类型** | Agent Skill（Markdown + Scripts + Templates） |
| **安装位置** | `~/.cursor/skills/book-learn-distill/` |
| **入口口令** | `学一下 {方向}` / `读书蒸馏 {方向}` |
| **续跑口令** | `补了 PDF` / `继续 learn/{slug}` |

```
Intake → Discover → Source → Skeleton → Ingest → Synthesize
→ Debate → Equip → Merge
→ skills/<slug>/ + 作业输出/<slug>_知识图谱.html
```

详细架构：[docs/architecture.md](./docs/architecture.md)

---

## 特点

- **双交付物**：Agent 可执行的 Skill + 人可探索的单文件 HTML，同源
- **三管线分流**：book（教材）/ domain（年表）/ system（内部体系 DOCX）
- **可中断可续跑**：每阶段一个 markdown 产物，`meta.json` 记状态
- **合规配置化**：水印 / 免责声明走 JSON，不改代码
- **单文件 HTML**：数据 inline，断网可看、邮件可发

---

## 安装

```bash
git clone https://github.com/muqian2026-rgb/qian-public.git
cp -r qian-public/book-learn-distill ~/.cursor/skills/book-learn-distill
```

或只下载本目录后复制到 `~/.cursor/skills/book-learn-distill`。

---

## 使用

```
学一下 俞军产品方法论
```

每阶段等人确认再继续。有 PDF 后：

```
补了 PDF
继续 learn/yujun-product-methodology
```

---

## 目录

```
book-learn-distill/
├── SKILL.md                 ← Skill 入口（Agent 必读）
├── docs/architecture.md     ← 工程架构
├── scripts/                 ← build / merge / ingest 脚本
├── prompts/                 ← 各阶段对话模板
├── templates/               ← 知识图谱 HTML/JS + DESIGN.md
└── references/
```

---

## 产出示例

公开库仅提供**结构示例**（合成数据，不含图书原文）：

**[在线 Demo →](https://muqian2026-rgb.github.io/qian-public/demo/pipeline-structure-demo.html)**

完整书目产出（书摘、路径阅读、书内问答）在私有学习库生成，不公开发布，尊重原著版权。

---

## License

个人作品，开源仅供学习参考。  
用本 Skill 处理的书籍内容受原作者版权保护；书源须遵守 `prompts/source-discovery.md` 合法源分级。

---

## 反馈

[在 qian-public 提 Issue](https://github.com/muqian2026-rgb/qian-public/issues)
