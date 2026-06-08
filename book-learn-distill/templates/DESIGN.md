# Design System: Book Learn Distill · 知识图谱通用设计语言

**Origin:** 反向蒸馏自 `templates/knowledge-graph.html`（首版基于 yujun-product-methodology 项目校准）  
**Method:** design-md（跳过 Stitch，直接输出到 HTML/CSS）  
**用法:** 任何新书蒸馏项目继承此设计语言；新加组件先回此处对照"参考件"，不再发明新色/新圆角/新阴影。

---

## 1. Visual Theme & Atmosphere

**学术阅读 (Academic Reading) + 克制实用 (Restrained Utility)**

整体氛围像一本「打开的工具书」：克制、信息密度高、留白合理。

- 顶部 hero 用「**深夜到黎明的渐变**」（深靛蓝 → 中靛蓝 → 学者蓝）暗示「从未知到求知」
- 主体是「**雾灰底 + 白卡**」的阅读分区，模仿 Notion / 知乎专栏的卡片化文档
- 几乎不用立体阴影——**平面 (flat) 优先**；只有顶部 nav 用了 backdrop-blur 制造一点漂浮感
- 重色克制：主色 Ant Blue (#1890ff) 是唯一的高饱和度，其他都是浅底深字的「**浅染色 (tinted)**」配色
- 不使用艳色 emoji 装饰，仅在功能上用极简符号（▸ ✕ ★）

**关键词：** Crisp · Scholarly · Flat · Information-dense · Tinted-pastel

---

## 2. Color Palette & Roles

### 中性骨架 (Neutral Skeleton)
| 名字 | Hex | 用途 |
|---|---|---|
| **Mist Background** | `#f0f2f5` | 页面底（panel 之间的留白） |
| **Pure Card** | `#ffffff` | 所有信息面板的基底 |
| **Inkstone Text** | `#1a1a1a` | 正文 / 标题主色 |
| **Slate Muted** | `#8c8c8c` | 辅助说明 / 元数据 / 章节计数 |
| **Hairline Border** | `#e8e8e8` | 所有 1px 分隔线 / 卡片边 |

### 品牌主色 (Brand / Primary)
| 名字 | Hex | 用途 |
|---|---|---|
| **Scholar Blue** | `#1890ff` | 主操作、链接、激活状态、品牌色 |
| **Mist Blue (Tint)** | `#e6f4ff` | 浅底（chip 底、术语 hover 底、章节标签底） |
| **Midnight Indigo** | `#1e3a8a` | 主色加深态（标题、深色 chip 字、品牌色加深） |
| **Hero Dawn Gradient** | `linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1890ff 100%)` | 顶部 hero、**重要黑卡（答案卡）共享这个语言** |

### 功能色 (Functional)
| 名字 | Hex | 用途 |
|---|---|---|
| **Sage Green** | `#52c41a` (浅底 `#f6ffed`, 边 `#b7eb8f`) | 高置信、肯定（pill-high、"可迁移"） |
| **Amber Caution** | `#fa8c16` (浅底 `#fff7e6`, 警示底 `#fffbe6` + `#faad14`) | 提醒、警示卡、章节侧栏强调 |
| **Coral Danger** | `#ff4d4f` (浅底 `#fff1f0`, 边 `#ffa39e`) | 误区、错位、不能迁移 |
| **Iris Purple** | `#722ed1` (浅底 `#f9f0ff`) | 跨域类比、外部知识图谱节点 |

> **规则**：永远是「浅底 + 深字 + 1px 同色调 border」三件套，不要纯实色块。

---

## 3. Typography Rules

- **字体栈**：`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`（不引外部字体，本机优先）
- **行高**：正文 `1.65` 偏宽松；标题 `1.5`；密集列表 `1.45`
- **字号阶梯**（rem 等价于 16px 基准）：

| 角色 | 字号 | 粗细 | 颜色 |
|---|---|---|---|
| Hero H1 (页面标题) | 26px | 600 | #fff |
| Panel H2 (区标题 A/B/C/E…) | 18px | 600 | Inkstone + 2px primary-light underline |
| Block Title (B1/B2…) | 15px | 600 | Midnight Indigo |
| Sub Title (H4) | 14px | 600 | Midnight Indigo |
| 正文 | 13-14px | 400 | Inkstone |
| Meta / Muted | 12-13px | 400 | Slate Muted |
| 标签/章节号 (chip) | 10-12px | 500-600 | 同色调深字 |
| 按钮 | 12-15px | 400-600 | 视层级 |

- **不用斜体**，强调用 `<strong>` 600 粗体 + Inkstone
- **中英文混排**字号一致（不放大英文）
- **不缩字距**，PingFang 默认即可

---

## 4. Geometry & Shape

| 元素 | 圆角 | 物理描述 |
|---|---|---|
| Panel (主分区卡) | `12px` | Softly rounded corners |
| 内部卡片 (qa-ref / rp-main / 子卡) | `8-10px` | Gently rounded |
| Pill / Tag / Chip | `10-20px` | Pill-shaped 椭圆 |
| 章节号小标签 (.fw-ref) | `8px` | Snippet rounded |
| 按钮（主） | `8-10px` | Subtly rounded |
| 按钮（次/链接） | `6px` | Slightly rounded |
| 内嵌输入框 | `8-10px` | Soft rounded |
| 图谱容器 / 大区块 | `8-12px` + `dashed border` | Sketchy outlined |

**全系统不用直角 (`border-radius: 0`)**——保持柔软友好的阅读感。

---

## 5. Depth & Elevation

**平面优先 (Flat-first)，仅在 3 个地方允许微阴影：**

1. **Hero header gradient**：天然的深色块带视觉重量，不需要 shadow
2. **Sticky nav**：`rgba(255,255,255,0.92)` + `backdrop-filter: blur(10px)`——制造一层漂浮玻璃感
3. **Floating popover / modal**：`box-shadow: 0 8px 24px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.04)`——**软散射阴影 (whisper-soft diffused shadow)**，绝不重

普通 panel/card 一律 **1px solid hairline border** + 无阴影。

---

## 6. Component Stylings

### Panel（主分区容器）
- 白底，12px 圆角，1px hairline border，padding 24px，margin-bottom 20px
- 顶部 `<h2>` + `2px solid primary-light` 下划线作为分隔

### Pill / Tag（极小标签）
- 椭圆，10-20px 圆角，11-12px 字
- **永远是「浅底 + 深字 + 1px 同色 border」**
- 高度统一 22px（vertical-align: middle）

### Chip（章节关键词 chip · fw-chip）
- 圆角 12px，浅底（Mist Blue），深字（Midnight Indigo），1px primary border
- Hover 加深底色到 `#d6ebff`
- 激活态：实色 primary 底 + 白字

### Button
| 层级 | 视觉 |
|---|---|
| **主按钮** (qa-form 询问) | Scholar Blue 实色底 + 白字 + 10px 圆角 + 600 粗体 |
| **次按钮** (read-section-btn) | 白底 + Scholar Blue 字 + 1px primary border + 6-8px 圆角 |
| **链接按钮** (book-search-trigger) | 浅 Mist Blue 底 + Midnight 字 + 圆角 pill |
| **图标按钮** (close ✕) | 透明底 + Slate Muted + hover #f1f5f9 |

### Input
- 1px hairline border，10px 圆角，padding 12px 16px
- Focus：border 变 Scholar Blue + `0 0 0 3px Mist Blue` ring
- 字号 15px，行高 1.5

### Card (qa-ref / rp-chunk)
- 白底，8-10px 圆角，1px hairline border
- **强化型** 用 `border-left: 4px solid Scholar Blue` 表示"原文/重要引用"
- 微间距 padding 14-18px

### Popover (term tooltip)
- 白底，10px 圆角
- 软阴影（见第 5 节）
- padding 14px 16px 12px，max-width 360px
- 头部 1px 浅 border-bottom 分隔
- 14ms 淡入 + 上移 4px 动效
- 关闭：外击 / Esc / 滚动

### Dark Answer Card (qa-card)
- **复用 Hero Dawn Gradient**，制造"这是 AI 答案"的视觉特异感
- 12px 圆角（与 panel 同），padding 20px 24px
- 仅在 K 区出现，**全系统只此一处深色实色块**
- 内部白字 / 浅灰副字 / 琥珀色 tag

---

## 7. Layout Principles

- **最大宽度 1200px** + 居中（适合 13 寸 / 16 寸笔记本）
- **page padding 16-24px**（移动端 16，桌面 24）
- **panel 间距 20px** 垂直 rhythm
- **panel 内部 24px** 四边 padding，内嵌组件之间 12-20px
- **关键三栏布局**：
  - 阅读双栏 (E)：220px sticky 侧栏 + 1fr 主体，gap 18px
  - 节点详情侧栏 (sidebar)：浮在右侧，max-width 380px
- **响应式**：≤768px 双栏转单列；侧栏转横滚 tab

---

## 8. Iconography

不用 icon font / SVG icon。仅用 7 个**字符级图标**：

| 字符 | 用途 |
|---|---|
| `▸ / ▾` | 折叠/展开 |
| `→` | 跳转动作 |
| `●` | 节点指示 |
| `★` | 相关度/评分 |
| `§` | 章节号前缀 |
| `✕` | 关闭 |
| `✓ / ✕` (在 misc-card) | 对错对比 |

---

## 9. Motion & Interaction

| 场景 | 时长 | 缓动 |
|---|---|---|
| Popover 出现 | 140ms | ease-out + translateY(-4px → 0) |
| Term hover / chip hover | 120ms | linear background |
| Details 展开 (chevron 转 90°) | 150ms | ease |
| Section reader 展开 | 无动效（瞬时） |
| 滚动跳转 | smooth | 浏览器默认 |

**触发约定**：单击触发；不依赖 hover-only（因为术语 popover 需要点击才打开，避免误触）。

---

## 10. Accessibility

- 颜色对比度：正文 ≥ 7:1（Inkstone on White），按钮文字 ≥ 4.5:1
- 所有可点元素 `tabindex` 或原生可聚焦
- popover close 按钮带 `aria-label="关闭"`
- 键盘：Tab / Enter / Esc 全可用
- 不只用颜色区分（pill 同时用浅底+边+图标字符）

---

## 11. 给后续生成器的元规则

把这些原则用在任何新增模块上：

1. **永远 panel-card + hairline border + 12px 圆角**——不另起一套
2. **任何新颜色都先看第 2 节是否已有**——不要发明新的 brand color
3. **暗色块只出现在「Hero / Answer Card / 重要 callout」**，其他场景一律 light theme
4. **任何 chip/tag 都是「浅底 + 深字 + 1px 同色 border」三件套**
5. **加任何阴影前先考虑是否能用 border 解决**——能就用 border
6. **新组件做完先回 §6 找最接近的"参考件"对比一遍**，确保视觉血缘一致

---

## 12. 自然科学模式（natural-science）专用组件

> 用于 `meta.bookProfile === "natural-science"`：地质年表、生命树、时期故事、物种图鉴、双语阅读。

### §12.1 网络课程层（`book-curriculum.json`）

- 顶栏切换：**网络课程 · 8 章** | **教材精读**
- 深度：**速览 L0** / **标准 L1** / **学者 L2**
- 样板页：`pages.page-devonian-dunkleosteus`（泥盆纪 + 邓氏鱼，Wikimedia 图库 + 简笔画分步）
- 构建：`build-preview-html.sh` 内联 `window.CURRICULUM`，合并 `knowledge-graph-course.js`

| 组件 | 参考件 | 规格 |
|------|--------|------|
| **Explorer Rail** | `.rp-side` + `.nav-inner` | 宽 240px；`--bg` 底；右边 1px `--border`；顶部 Tab = `.graph-toolbar button` 样式 |
| **GeoTimeline** | `.gloss-filter` chip 行 | 横向 `overflow-x: auto`；纪块 = Mist Blue 三件套；`.active` = Scholar Blue 边 + 字重 600 |
| **PeriodStoryCard** | `.qa-card` + `.panel` | 12px 圆角；`timeRange` = Amber 浅底标签；`.period-hero` 16:9 `#f5f5f5` 居中 SVG |
| **TaxonCard** | `.qa-ref` 横卡 | 左 72px sketch 方图；右 nameZh + appearanceZh；底行 link 按钮 |
| **TaxonStrip** | `.qa-suggest` | 横滑 `display:flex; gap:10px; overflow-x:auto` |
| **BilingualToggle** | `.graph-toolbar` | 三按钮：中文 / 英文 / 对照；激活 `.active` |
| **LifeTree SVG** | `#graph-svg` 线稿 | stroke `#1a1a1a` 1.5px；`.lt-active` stroke Scholar Blue fill `#e6f4ff` |
| **Science Layout** | — | `.layout-science` = `grid-template-columns: 240px 1fr`；`<1024px` 探索轨变 `details.explorer-drawer` |

**学科 Hero（可选）**：`linear-gradient(135deg, #0f172a 0%, #14532d 45%, #1890ff 100%)` 替换默认 hero，仅 science profile 启用。
