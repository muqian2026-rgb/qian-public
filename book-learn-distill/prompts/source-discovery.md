# 电子书源发现 · Source Discovery（Phase 1b）

在 **书目确认（01）** 之后、**Skeleton / Ingest** 之前执行。  
目标：为每本入选书找到 **免费且来源可信** 的电子材料，并标明 **覆盖范围** 与 **置信度**。

> 原则：**正确性 > 完整性 > 免费**。宁可只读官网 6 章，也不用来路不明的「全书 PDF」。

---

## 来源分级（Tier）

| Tier | 定义 | 可用作 ingest | 示例 |
|------|------|---------------|------|
| **A** | 作者或出版社官方公开 | 是 | Osborne 官网 sample chapters；MIT Press 开放章节 |
| **B** | 高校课程页 **仅链接** 到 A，或托管 **自编讲义**（注明非全书） | 讲义可；链接登记 | syllabus 指向 utoronto.ca/osborne/igt |
| **C** | 图书馆 / 学校订阅 / 你已购正版电子版 | 是（本地文件） | 京东读书、学校 VPN 数据库 |
| **D** | 需购买、无合法免费全文 | 否（仅元数据 + 骨架） | 其余章节购书 |
| **X** | 第三方镜像、GitHub 匿名全书扫描、网盘 | **禁止** ingest | 不写入 raw |

---

## 搜索步骤（Agent 必做）

对 shortlist 中每本书：

1. **作者官网**  
   - 搜索：`{作者} {书名} official site sample chapter PDF`  
   - 记录：章节列表 URL、每章 PDF 直链、习题解答 PDF

2. **出版社**  
   - 搜索：`{书名} Oxford University Press companion site open access`（按出版社替换）

3. **课程 Reading List（只取链接，不取镜像）**  
   - `gh search code "{书名}" syllabus` 或 `site:github.com "{书名}" reading`  
   - 只登记 **指向 A/B 的 URL**；若 repo 内嵌全书 PDF → 标 Tier X，不用

4. **同作者替代卷**  
   - 若全书不可免费，查作者是否有 **更高级/更低级** 的合法全文（如 Osborne 的 *A Course in Game Theory* 全文免费）

5. **中文辅读**  
   - 出版社页、作者机构、豆瓣元数据；**无合法免费全文则标 D**

产出写入：`learn/<slug>/01b-source-discovery.md`

---

## 产出模板

```markdown
# 电子书源 · {方向}

检索日：YYYY-MM-DD

## {书名 1}

| 章节/范围 | Tier | URL | 本地路径（ingest 后） | 备注 |
|-----------|------|-----|----------------------|------|
| Ch 1–6 | A | … | raw/… | 官方 sample |
| Ch 7+ | D | — | — | 需购书 |
| Solutions | A | … | raw/… | 官方解答 |

**推荐 ingest 顺序**：…

## GitHub / 网盘结论

- 是否发现全书镜像：是/否（若是，标 X，不使用）
- 有用 repo：仅 syllabus 链接 …

## 门禁

请确认 ingest 范围（默认：仅 A 级 PDF）。
```

---

## 与 Ingest 的衔接

- 仅 **Tier A/C** 下载后执行 `docling-ingest`  
- `meta.json` 增加 `sourcesLegal` 数组，记录 tier + url  
- 无 A/C 时维持 Skeleton，`confidence` 最高 medium

---

## 博弈论 · Osborne 已定稿来源（示例）

见 `learn/game-theory/01b-source-discovery.md`。
