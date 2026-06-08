---
name: docling-ingest
description: >-
  用 Docling 将 PDF/DOCX/PPTX/XLSX 等转为 Markdown，写入 knowledge-base/raw/，
  供后续 wiki ingest。口令：「docling 转一下」「PDF 进知识库」。需本机已 pip install docling。
disable-model-invocation: false
---

# Docling 文档解析

> 项目：[docling-project/docling](https://github.com/docling-project/docling) — Get your documents ready for gen AI.

## 分工

| 步骤 | Skill / 动作 |
|------|----------------|
| **二进制 → Markdown** | **本 Skill** |
| **Markdown → 互链 wiki** | 按你的 wiki schema 做 ingest |

## 前置条件

- **Python ≥ 3.10**
- 安装：`pip install docling`（或 `uv pip install docling`）
- 敏感文档：**本地执行**，不上传第三方解析服务。

## 用法

在 **仓库根目录**（含 `knowledge-base/raw/`）：

```bash
# 单文件 → knowledge-base/raw/<basename>.md
bash skills/docling-ingest/scripts/docling-to-raw.sh "/path/to/file.pdf"

# 或 Python 直接调
python3 skills/docling-ingest/scripts/docling_convert.py --file "/path/to/file.pdf"
```

成功后提示用户：「是否做 wiki ingest？」

## Agent 规则

1. **必须先有明确文件路径**；不得猜测仓库内任意 PDF。
2. 输出写入 **`knowledge-base/raw/`**，文件名建议 `YYYY-MM-DD-<主题>.md`。
3. **不**假装「已精读」——转换后仍须 ingest 或人工扫一眼表格/数字。
4. 含 **客户隐私、未脱敏合同** → 仅本地 raw，**禁止** `html-public-publish`。

## 与「不擅长」的边界

Docling 解决 **可读文本与结构**；扫描极差、手写、纯图无 OCR 的页 → 标注 `待人工` 或 `低置信度`，不编造正文。
