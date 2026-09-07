# HTML 交付物 QA 清单

> 对齐 `~/.claude/skills/qa.md`：**风险优先 · 自动化门禁 · 失败即阻断 build**  
> 脚本：`scripts/qa-verify-html.py`（build 结束后自动执行）

## 风险分级

| 级别 | 含义 | 处理 |
|------|------|------|
| **P0** | 页面打不开 / 数据损坏 / 核心区块缺失 | build 失败，必须修复 |
| **P1** | 自然科学特性、课程层、索引体量 | 报告警告，建议本迭代修 |
| **P2** | CDN 依赖、冗余外链 | 记录，可后续优化 |

## P0 自动检查项

- [ ] HTML 存在且 > 10KB
- [ ] 文档结构完整（DOCTYPE / body / 闭合）
- [ ] `window.GRAPH_DATA` 可解析，节点 ≥ 3
- [ ] 核心 DOM：`overview` `theory` `graph-svg` `readingPath` `bookQaPanel`
- [ ] **应用 JS 已内联**（单文件 `file://` 可运行，不依赖旁路 `.js`）
- [ ] `GRAPH_DATA` 内无裸 `</script>` 破坏标签
- [ ] `BOOK_INDEX` 有 chunks（若项目有 book-index）

## P1 · natural-science（`bookProfile: natural-science`）

- [ ] 内联 `GEOTIME` / `PHYLOGENY` / `TAXA`
- [ ] 有 `book-curriculum.json` 时内联 `CURRICULUM`，章节 ≥ 8
- [ ] DOM：`courseRoot` `courseModeBar` `geotimePanel` `explorerRail`
- [ ] G/H 区为 `profile-business-only` 或已移除

## P1 · 作者 Persona（可选）

- [ ] K 区 10 条白话问句命中率 ≥ 80%（人工，见 persona-template）

## 展示走查（人工 · 约 5 分钟）

打开 `publish/知识图谱/<slug>_知识图谱.html`。**必须与同目录的 `<slug>_book-index.js`、`<slug>_app.js` 一起**（不要只拷贝 HTML）。有 SVG 时还需 `<slug>_assets/` 或 `paleontology_assets/`。

> 默认 **split 交付**：HTML 约 400KB（编辑器可打开），书内索引单独 3MB JS。**不要用 Cursor 预览**；本地服务 + 系统浏览器。

脚本 22/22 **不够**。下面红了先洗 raw / 改 B1，再 build。完整表：plan 六-C。

1. **A 总览** 最上是全书精华（这是一本什么书 / 核心逻辑 / 带走什么），不是只有一句口号  
2. **B1** 展开一节是 2–3 段核心，不是口号  
3. **版面** 单列铺满、少折行；没有为填空而两栏挤成细条  
4. **C 图谱** 圆点可点、侧栏弹出  
5. **E 路径阅读** 点「前言 / 第1章 / 末章」是正文。不许出现 `:::`、`#partxxx`、目录链接墙、章名写成制作说明 /「§1.4」  
6. **K 书内问答** 输入关键词有命中 + 书摘  
7. **H** 场景 + 口令，不是只写 skill 路径  
8. 控制台无红色报错  

## 报告位置

- `publish/知识图谱/<slug>-qa-report.json`
- `publish/知识图谱/<slug>-qa-report.md`

## 命令

```bash
bash skills/book-learn-distill/scripts/build-preview-html.sh <slug>
# 仅重跑 QA：
python3 skills/book-learn-distill/scripts/qa-verify-html.py <slug> \
  "publish/知识图谱/<slug>_知识图谱.html" "learn/<slug>"
```
