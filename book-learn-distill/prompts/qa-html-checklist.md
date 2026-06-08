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

打开 `作业输出/<slug>_知识图谱.html`。**必须与同目录的 `<slug>_book-index.js`、`<slug>_app.js` 一起**（不要只拷贝 HTML）。有 SVG 时还需 `<slug>_assets/` 或 `paleontology_assets/`。

> 默认 **split 交付**：HTML 约 400KB（编辑器可打开），书内索引单独 3MB JS。勿用 Cursor 预览 3MB 单文件 bundle。

1. **A 总览** 有标题与 meta  
2. **C 图谱** 圆点可点、侧栏弹出  
3. **E 路径阅读** 左侧章节能切换正文  
4. **K 书内问答** 输入关键词有命中  
5. **自然科学**：顶栏「网络课程 / 教材」可切换；样板课图片能加载（需联网）  
6. 控制台无红色报错  

## 报告位置

- `作业输出/<slug>-qa-report.json`
- `作业输出/<slug>-qa-report.md`

## 命令

```bash
bash skills/book-learn-distill/scripts/build-preview-html.sh <slug>
# 仅重跑 QA：
python3 skills/book-learn-distill/scripts/qa-verify-html.py <slug> \
  "作业输出/<slug>_知识图谱.html" "learn/<slug>"
```
