# timeline-milestones.json · 字段说明

用于 `framework: earth-history-book` 类方向。构建脚本内联到 HTML 的 `window.TIMELINE_MILESTONES`。

## 顶层

| 字段 | 说明 |
|------|------|
| `hero` | 页面标题、副标题、blurb；可选 `treeOfLife.url` |
| `eraBands` | 图例色带（简化为文案即可） |
| `lifeTreeBranches` | 四段叙事 + 内含 `eras[].periods[]` 纪 ID 列表 |
| `transformNodes` | 变革节点；`afterPeriod` = 该纪在「现今→古老」顺序中靠上的一侧 |
| `scaleNote` | 时间尺度一句话 |
| `milestones` | 可选；与 `01-*.md` 深读标记对齐 |

## lifeTreeBranches[]

| 字段 | 说明 |
|------|------|
| `branchId` | 唯一 ID |
| `metaphor` | 如「树根」「树顶新芽」 |
| `title` / `tagline` / `time` | 叙事卡展示 |
| `summary` / `bullets[]` | 展开后正文 |
| `eras[]` | `{ eraId, eraLabel, eraColor, periods: ["cambrian", ...] }` |

## transformNodes[]

| 字段 | 说明 |
|------|------|
| `id` | 唯一 |
| `afterPeriod` | 锚定纪 ID |
| `type` | `extinction` \| `evolution` \| `boundary` \| `climate` |
| `label` / `hook` | 横幅文案 |
| `ma` | 数值（百万年）；构建时转中文年代 |
| `relatedDeep` | 可选；点击跳转深读纪 ID |

纪 ID 必须与 `01-geologic-timescale.md` 表格中 `` `id` `` 一致。
