# Intake · 学习方向（4 问 + 管线分流）

按序提问，用户可跳过非必填项。汇总后写入 `learn/<slug>/meta.json` 并 **等人确认** 再进入下一阶段。

**第一步必须先定管线**（见下文 §管线分流）。

---

## 问题

1. **学习方向**（必填）  
   - 用一句话：「我想系统掌握 ___，用来 ___。」

2. **管线**（必填，给选项并解释）  
   - **A · 书驱动**（`pipeline: "book"`）— 权威教材/PDF → **book-learn-distill**  
   - **B · 领域驱动**（`pipeline: "domain"`）— 年表/时间轴、无单一教材（私有库管线，本公开仓库不含）  
   - **C · 体系驱动**（`pipeline: "system"`）— 内部多模块 DOCX、业务体系（私有库管线）  
   - 判定：年表/地质年代 → B；内部体系稿、无教材但有内部文档 → C；否则 A  
   - 若判为 B/C：告知用户需在私有学习库继续，本 Skill 仅服务 A

3. **类型与深度**（必填，给选项）  
   - 类型：`科学/学科` | `方法论/实践` | `混合`  
   - 深度：`概览` | `可决策` | `可教学他人`

4. **应用场景**（选填）  
   - 写入 `meta.contexts`。

---

## 管线分流

| `meta.pipeline` | 文档 | 模板 | 主交付物 |
|-----------------|------|------|----------|
| `book` | [book-learn-distill](../../../docs/book-learn-distill.md) | `learn/_template/` | 知识图谱 A–J + Skill |
| `domain` | 私有库 | `learn/_template-domain/` | timemachine HTML |
| `system` | 私有库 | `learn/_template-system/` | 知识图谱 A–J + **K 流程** |

---

## 汇总模板（确认用）

### 若 pipeline = book

```markdown
## Intake 确认
- **方向**：…
- **slug**：…
- **pipeline**：book
- **交付物**：知识图谱 + Domain Skill
确认后进入选书（Discover）。
```

### 若 pipeline = domain

```markdown
## Intake 确认
- **pipeline**：domain
- **framework**：earth-history-book | concept-tree | industry-timeline
- **交付物**：年表 + 深读 + 交互 HTML
确认后 Framework。勿选书。
```

### 若 pipeline = system

```markdown
## Intake 确认
- **方向**：…
- **slug**：wyc-trading-strategy（示例）
- **pipeline**：system
- **sourceRoot**：业务认知/wyc交易策略
- **modules**：overview → match → passenger / driver → carpool
- **交付物**：知识图谱（A–J）+ K 策略流程（Mermaid）+ 可选 Skill
确认后进入 01-module-registry，勿走选书。
```
