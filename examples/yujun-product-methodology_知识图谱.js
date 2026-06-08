const SECTIONS_CN = [
  ["overview", "A 总览"],
  ["theory", "B 理论"],
  ["graph", "C 图谱"],
  ["reading-path", "E 路径阅读"],
  ["book-qa", "K 问俞老师"],
  ["existing", "G 已有"],
  ["skill-bridge", "H 应用"],
  ["misconceptions", "I 误区"],
  ["glossary", "J 术语"],
];
const SECTIONS_EN = [
  ["overview", "A · Overview"],
  ["theory", "B · Theory"],
  ["graph", "C · Graph"],
  ["reading-path", "E · Reading"],
  ["book-qa", "K · Ask Yu"],
  ["existing", "G · Linkage"],
  ["skill-bridge", "H · Practice"],
  ["misconceptions", "I · Pitfalls"],
  ["glossary", "J · Glossary"],
];
const SECTIONS = (window.LANG === "en" ? SECTIONS_EN : SECTIONS_CN);
const EDGE_CN_LABELS = {
  prerequisite: "先修",
  "part-of": "组成",
  causes: "塑造",
  enables: "使能",
  contradicts: "张力",
  extends: "扩展",
  "analog-to": "类比",
  cites: "例证",
  "cross-domain": "跨域",
  "is-a": "是一种",
};
const EDGE_EN_LABELS = {
  prerequisite: "prereq",
  "part-of": "part-of",
  causes: "shapes",
  enables: "enables",
  contradicts: "tension",
  extends: "extends",
  "analog-to": "analogy",
  cites: "cites",
  "cross-domain": "cross-domain",
  "is-a": "is-a",
};
const EDGE_CN = (window.LANG === "en" ? EDGE_EN_LABELS : EDGE_CN_LABELS);

// === i18n ===
const I18N_CN = {
  expandDeep: "展开精读 · 书摘与机制",
  copyBlocked: "🚫 内部资料 · 禁止复制",
  bookHint: "未加载书内索引。",
  noPersona: "俞老师人格档案未加载，无法启动对话。",
  chatTitle: "问俞老师",
  chatHero: "你的问题会被 AI 用《俞军产品方法论》框架回答。<br/>信息不全时，俞老师会先反问你 1–3 个澄清问题。",
  chatSamples: [
    "什么是好产品？",
    "用户价值怎么算？",
    "数据涨了是不是就说明产品做对了？",
    "我们要做一个会员体系，你怎么看？",
    "PM 该看什么指标？",
  ],
  chatPlaceholder: "问俞老师：什么是好产品？怎么看新功能 X？",
  chatSend: "发送",
  chatClear: "清空对话",
  chatClearConfirm: "清空当前对话？",
  chatKeyConfig: "配置 Key",
  chatKeyChange: "更换 Key",
  chatReady: "已就绪 · 千问 API",
  chatReadyProxy: "已就绪 · 后端代理",
  chatNoKey: "未配置 API Key",
  chatFollowupHead: "想继续追问",
  chatModalTitle: "配置千问 API Key",
  chatModalSub: "Key 只保存在你本机浏览器（localStorage），不上传任何服务器。",
  chatModalCancel: "取消",
  chatModalRemove: "删除",
  chatModalSave: "保存",
  chatModalHelp:
    '在阿里云 <a href="https://bailian.console.aliyun.com/?apiKey=1" target="_blank" rel="noopener">百炼控制台</a> 获取 API Key（DashScope）。<br/>费用按 token 计算，qwen-plus 约 ¥0.0008/千 token；建议为该项目单独申请 Key 并设月度额度上限。',
  chatErrInvalidKey: "API Key 无效或已过期，请重新配置",
  chatErrApi: "千问 API 错误",
  chatErrEmpty: "模型返回为空",
  chatTryHint: "可点右上角「更换 Key」重新配置；或换个模型再试。",
  modelLabels: {
    "qwen-plus": "qwen-plus（默认 · 性价比）",
    "qwen-max": "qwen-max（更强 · 略慢）",
    "qwen-turbo": "qwen-turbo（快 · 简单问题）",
  },
  // K-section persona card / book refs / fallback
  personaAvatar: "俞",
  personaAiTag: "AI 模拟 · 非俞军本人",
  personaAiTitle: "本回答由 AI 基于公开方法论模拟，不代表俞军本人立场",
  personaQHead: "俞老师会先反问你",
  personaRefsLabel: "在书内对应章节：",
  qaTagExcerpt: "摘录",
  qaSourceHint: "未命中俞老师的核心模型，以下是相关原文摘录。",
  qaEmptyHint: "可以试试：用户价值公式、好产品、交易成本、用户模型、PM 选拔。",
  qaEmptyLead: (q) => `没找到与 <strong>「${q}」</strong> 直接相关的段落。`,
  qaRefsTitle: "书中原文 · 巩固阅读",
  qaRefsHintModel: "俞老师指向这几段",
  qaRefsHintScore: "按相关度",
  qaRefsCountSuffix: (n) => `· 共 ${n} 段索引`,
  qaScoreTitle: "相关度",
  qaRefExpand: "展开完整段落",
  qaRefCollapse: "收起",
  qaNoMatchPrefix: "本次未在书内匹配到段落，可点上面章节按钮",
  qaNoMatchSuffix: "直接阅读。",
  // reading-path
  readSection: "阅读本节正文",
  collapseSection: "收起正文",
  // chat avatar role labels (used inside bubbles)
  chatRoleUser: "我",
  chatRoleAssistant: "俞",
  // theory blocks (B0-B5)
  theoryB0Title: "B0 · 一句话",
  theoryB1Title: "B1 · 全书理论框架（按章展开）",
  theoryB1Sub: "与书本目录一致：点击章/节逐层展开；每节可书内检索、跳转概念图谱。",
  theoryB3Title: "B3 · 入门导引",
  theoryB3bTitle: "B3b · 核心概念精读",
  theoryB4Title: "B4 · 快速学习",
  theoryB5DefaultTitle: "中国对齐 / 勿误用",
  pillarLabelDefinition: "定义",
  pillarLabelMechanism: "机制",
  pillarLabelBoundary: "边界",
  pillarLabelPlain: "白话",
  pillarLabelExample: "例子",
  pillarLabelAnalogy: "类比",
  notThis: "不是什么：",
  plainPrefix: "白话：",
  decisionGuideHeader: "决策指南",
  decisionColJudgement: "判断",
  decisionColAction: "做法",
  decisionColGraph: "图谱",
  classicModelsHeader: "经典模型",
  classicColName: "模型",
  classicColOneLine: "一句话",
  classicColLesson: "学到什么",
  coreClaimsHeader: "核心观点（可执行）",
  learningTracksHeader: "学习轨道",
  workedExampleHeader: "迷你例题：",
  conclusionPrefix: "结论：",
  defaultPathHeader: "默认路径",
  // B5 market comparison
  mc_portable: "可迁移",
  mc_notPortable: "勿误用",
  mc_jumpCnMarket: "→ 中国市场落地",
  mc_jumpMisCopy: "→ 勿照搬误区",
  mc_otaPrefix: "机酒火",
  mc_compDimHead: "维度",
  mc_compNAHead: "北美本课",
  mc_compCNHead: "中国落地注意",
  // misc - common pitfalls (I)
  miscColMistake: "✕ 常见想法",
  miscColCorrection: "✓ 书内更正",
  miscDefaultChapter: "全书",
  miscFilterAll: "全部",
  miscJumpGraph: "● 图谱",
  miscJumpGraphTitle: "跳转概念图谱",
  // glossary (J)
  glossDefaultChapter: "其他",
  glossEmpty: "无匹配术语",
  glossJumpGraph: "● 概念图谱",
  glossClose: "关闭",
  glossNoDef: "（未填写定义）",
  // sidebar (right rail)
  sbType: "类型",
  sbOneLiner: "一句话",
  sbPlain: "白话",
  sbMechanism: "机制",
  sbBoundary: "边界",
  sbHowToUse: "怎么用",
  sbPmPrefix: "PM：",
  sbExample: "例子",
  sbAnalogy: "类比",
  sbDeepRead: "精读",
  sbQuotes: "书摘",
  sbSources: "来源",
  sbReadOriginal: "阅读原文",
  sbExpandSection: (ref) => `展开 §${ref} 正文`,
  sbContext: "场景",
  sbBookSearch: "书内检索",
  sbRelated: "相关关系",
  sbRelType: "关系类型",
  sbMeaning: "含义",
  sbStartConcept: "起点概念",
  sbEndConcept: "终点概念",
  sbViewPrefix: "查看 ",
  sbConfidence: "置信度",
  sbConfHigh: "置信度高：有章节/证据支撑",
  sbConfMedium: "置信度中：体系常识或部分 ingest",
  sbConfLow: "置信度低：待辅书 PDF 或人工确认",
  sbConfPrior: "待证据",
  pillHigh: "高",
  pillMedium: "中",
  pillLow: "低",
  pillPrior: "待证",
  // tooltip / glossary popup
  tpClose: "关闭",
  tpJumpGraph: "→ 概念图谱",
  tpBookSearch: "→ 书内检索",
  // qa more
  qaMoreSummary: (n) => `另有 ${n} 段匹配（展开）`,
  qaListHint: "输入问题或关键词后检索。",
  // theory body fallback / reading-path fallback
  empty: "待填",
  emptyMerge: "Merge 后填入",
  emptyMatch: "未匹配到正文",
  emptyNoBookIndex: '无 book-index 数据。可在 K 区检索：',
  // legend / nav
  legendEdgeTypes: "连线类型：",
  // header subtitle bits
  hdrUpdated: "更新：",
  hdrDepth: "深度：",
  hdrBooks: "书目：",
  hdrContexts: "场景：",
  // book-search header label
  bookSearchSuffix: "书内",
  graphChip: "→图谱",
  documentTitleSuffix: " · 知识图谱",
  paragraphsSuffix: "段",
  approxCharsPrefix: "约 ",
  approxCharsSuffix: " 字",
};
const I18N_EN = {
  expandDeep: "Expand · Excerpt & Mechanism",
  copyBlocked: "🚫 Internal · Copy disabled",
  bookHint: "Book index not loaded.",
  noPersona: "Yu Jun persona not loaded; chat cannot start.",
  chatTitle: "Ask Yu Jun",
  chatHero: "Your question is answered by an AI using Yu Jun's product methodology.<br/>If the question is under-specified, Yu Jun will ask 1–3 clarifying questions first.",
  chatSamples: [
    "What makes a good product?",
    "How do you calculate user value?",
    "If a metric goes up, does it mean we did the right thing?",
    "We're planning a membership program — what's your take?",
    "What metrics should a PM actually watch?",
  ],
  chatPlaceholder: "Ask Yu Jun: what makes a good product? What's your take on feature X?",
  chatSend: "Send",
  chatClear: "Clear chat",
  chatClearConfirm: "Clear the current conversation?",
  chatKeyConfig: "Set API Key",
  chatKeyChange: "Change Key",
  chatReady: "Ready · Qwen API",
  chatReadyProxy: "Ready · Backend proxy",
  chatNoKey: "API Key not set",
  chatFollowupHead: "Follow-up questions",
  chatModalTitle: "Configure Qwen API Key",
  chatModalSub: "The key is stored only in your browser (localStorage); it is not uploaded to any server.",
  chatModalCancel: "Cancel",
  chatModalRemove: "Remove",
  chatModalSave: "Save",
  chatModalHelp:
    'Get an API key from Alibaba Cloud <a href="https://bailian.console.aliyun.com/?apiKey=1" target="_blank" rel="noopener">Bailian console</a> (DashScope).<br/>Billed per token; qwen-plus is roughly ¥0.0008 per 1K tokens. Use a project-scoped key with a monthly quota.',
  chatErrInvalidKey: "API key invalid or expired — please reconfigure.",
  chatErrApi: "Qwen API error",
  chatErrEmpty: "Empty response from the model.",
  chatTryHint: "Click 'Change Key' on the top-right to reconfigure, or try a different model.",
  modelLabels: {
    "qwen-plus": "qwen-plus (default · balanced)",
    "qwen-max": "qwen-max (stronger · slower)",
    "qwen-turbo": "qwen-turbo (fast · simple Q)",
  },
  // K-section persona card / book refs / fallback
  personaAvatar: "Yu",
  personaAiTag: "AI simulation · not the real Yu Jun",
  personaAiTitle: "AI-simulated answer based on the published methodology; does not represent Yu Jun's personal views.",
  personaQHead: "Yu Jun will ask you first",
  personaRefsLabel: "Related chapters in the book:",
  qaTagExcerpt: "Excerpt",
  qaSourceHint: "No core model matched. Showing related excerpts from the book.",
  qaEmptyHint: "Try: user-value formula, good product, transaction cost, user model, PM selection.",
  qaEmptyLead: (q) => `No passage in the book directly matches <strong>"${q}"</strong>.`,
  qaRefsTitle: "Book excerpts · for deeper reading",
  qaRefsHintModel: "Yu Jun points to these passages",
  qaRefsHintScore: "By relevance",
  qaRefsCountSuffix: (n) => `· across ${n} indexed passages`,
  qaScoreTitle: "Relevance",
  qaRefExpand: "Expand full passage",
  qaRefCollapse: "Collapse",
  qaNoMatchPrefix: "No passage matched this time. Use the chapter buttons above",
  qaNoMatchSuffix: "to read the original.",
  // reading-path
  readSection: "Read this section",
  collapseSection: "Collapse",
  // chat avatar role labels
  chatRoleUser: "Me",
  chatRoleAssistant: "Yu",
  // theory blocks (B0-B5)
  theoryB0Title: "B0 · One-liner",
  theoryB1Title: "B1 · Full theory framework (by chapter)",
  theoryB1Sub: "Mirrors the book's table of contents. Click a chapter or section to expand; each section has book search and graph jumps.",
  theoryB3Title: "B3 · Beginner's guide",
  theoryB3bTitle: "B3b · Core concepts in depth",
  theoryB4Title: "B4 · Quick learning",
  theoryB5DefaultTitle: "Localisation / What does NOT transfer",
  pillarLabelDefinition: "Definition",
  pillarLabelMechanism: "Mechanism",
  pillarLabelBoundary: "Boundary",
  pillarLabelPlain: "In plain words",
  pillarLabelExample: "Example",
  pillarLabelAnalogy: "Analogy",
  notThis: "What it is not:",
  plainPrefix: "In plain words: ",
  decisionGuideHeader: "Decision guide",
  decisionColJudgement: "Question",
  decisionColAction: "What to do",
  decisionColGraph: "Graph",
  classicModelsHeader: "Classic models",
  classicColName: "Model",
  classicColOneLine: "One line",
  classicColLesson: "Takeaway",
  coreClaimsHeader: "Core claims (actionable)",
  learningTracksHeader: "Learning tracks",
  workedExampleHeader: "Worked example: ",
  conclusionPrefix: "Conclusion: ",
  defaultPathHeader: "Default path",
  // B5 market comparison
  mc_portable: "Transfers",
  mc_notPortable: "Does NOT transfer",
  mc_jumpCnMarket: "→ China market",
  mc_jumpMisCopy: "→ Don't copy-paste",
  mc_otaPrefix: "Industry note",
  mc_compDimHead: "Dimension",
  mc_compNAHead: "Original (NA)",
  mc_compCNHead: "China caveat",
  // misc - common pitfalls (I)
  miscColMistake: "✕ Common belief",
  miscColCorrection: "✓ Book's correction",
  miscDefaultChapter: "All",
  miscFilterAll: "All",
  miscJumpGraph: "● Graph",
  miscJumpGraphTitle: "Jump to the concept graph",
  // glossary (J)
  glossDefaultChapter: "Other",
  glossEmpty: "No matching term",
  glossJumpGraph: "● Concept graph",
  glossClose: "Close",
  glossNoDef: "(no definition yet)",
  // sidebar (right rail)
  sbType: "Type",
  sbOneLiner: "One line",
  sbPlain: "In plain words",
  sbMechanism: "Mechanism",
  sbBoundary: "Boundary",
  sbHowToUse: "How to use",
  sbPmPrefix: "PM: ",
  sbExample: "Example",
  sbAnalogy: "Analogy",
  sbDeepRead: "Deep dive",
  sbQuotes: "Book quotes",
  sbSources: "Sources",
  sbReadOriginal: "Original text",
  sbExpandSection: (ref) => `Expand §${ref}`,
  sbContext: "Context",
  sbBookSearch: "Book search",
  sbRelated: "Related",
  sbRelType: "Relation type",
  sbMeaning: "Meaning",
  sbStartConcept: "Source concept",
  sbEndConcept: "Target concept",
  sbViewPrefix: "View ",
  sbConfidence: "Confidence",
  sbConfHigh: "High confidence: backed by chapter / evidence",
  sbConfMedium: "Medium confidence: common knowledge or partial intake",
  sbConfLow: "Low confidence: pending PDF or manual review",
  sbConfPrior: "Awaiting evidence",
  pillHigh: "High",
  pillMedium: "Med",
  pillLow: "Low",
  pillPrior: "TBD",
  // tooltip / glossary popup
  tpClose: "Close",
  tpJumpGraph: "→ Concept graph",
  tpBookSearch: "→ Book search",
  // qa more
  qaMoreSummary: (n) => `${n} more matches (expand)`,
  qaListHint: "Type a question or keyword to search.",
  // theory body fallback / reading-path fallback
  empty: "TBD",
  emptyMerge: "To be filled after merge",
  emptyMatch: "No matching text",
  emptyNoBookIndex: 'No book-index data available. Try the K section search:',
  // legend / nav
  legendEdgeTypes: "Edge types: ",
  // header subtitle bits
  hdrUpdated: "Updated: ",
  hdrDepth: "Depth: ",
  hdrBooks: "Books: ",
  hdrContexts: "Contexts: ",
  // book-search header label
  bookSearchSuffix: "Book",
  graphChip: "→ Graph",
  documentTitleSuffix: " · Knowledge Graph",
  paragraphsSuffix: "passages",
  approxCharsPrefix: "approx. ",
  approxCharsSuffix: " chars",
};
const T = (window.LANG === "en" ? I18N_EN : I18N_CN);

let DATA = null;
let BOOK_INDEX = null;
let PERSONA = null;
let COMPLIANCE = null;

const COMPLIANCE_DEFAULTS = {
  enabled: true,
  banner:
    "⚠ 学习用途 · 仅限公司内部分享 · 不得公开传播 / 转载 / 外发 / 商用 · 请支持正版",
  watermark: "内部分享内容 · 禁止转发",
  noCopy: true,
  noContextMenu: true,
  footer: {
    copyright: "© 原著版权归原作者及出版方所有",
    curator: "内部学习材料 · 团队内部读书会整理",
    contact: "反馈/纠错：请联系组织者",
    aiNote:
      "「AI 模拟答」内容由 AI 基于公开方法论模拟生成，不代表原作者本人立场，仅作学习启发用。",
    personalNote:
      "图谱节点的「PM 应用 / 行业类比」是整理者的个人解读，不属于原书内容。",
    takedown:
      "⚠ 本页面包含原书摘录段落，仅供内部学习。禁止外传、禁止上传公网、禁止用于对外营销/培训。如原作者或出版方认为侵权，请联系整理者即下架。",
  },
};
let simulation = null;
let svg, g;
let linkVisSel, linkHitSel, linkLabelSel, nodeSel, nodeLabelSel;
let filterMode = "all";
let selNode = null;
let selEdge = null;

async function loadData() {
  if (window.GRAPH_DATA) return window.GRAPH_DATA;
  try {
    const r = await fetch("06-graph-data.json");
    if (r.ok) return await r.json();
  } catch (e) {
    /* file:// or missing */
  }
  return null;
}

async function loadBookIndex() {
  if (window.BOOK_INDEX) return window.BOOK_INDEX;
  const path =
    (DATA && DATA.meta && DATA.meta.bookIndex) || "book-index.json";
  try {
    const r = await fetch(path);
    if (r.ok) return await r.json();
  } catch (e) {
    /* file:// or missing */
  }
  return null;
}

async function loadPersona() {
  if (window.PERSONA) return window.PERSONA;
  const candidates = ["book-persona.json", "author-persona.json", "yujun-persona.json"];
  for (const path of candidates) {
    try {
      const r = await fetch(path);
      if (r.ok) return await r.json();
    } catch (e) {
      /* file:// or missing */
    }
  }
  return null;
}

async function loadCompliance() {
  if (window.COMPLIANCE) return window.COMPLIANCE;
  for (const path of ["book-compliance.json", "compliance.json"]) {
    try {
      const r = await fetch(path);
      if (r.ok) return await r.json();
    } catch (e) {
      /* file:// or missing */
    }
  }
  return null;
}

function applyCompliance() {
  const cfg = Object.assign({}, COMPLIANCE_DEFAULTS, COMPLIANCE || {});
  cfg.footer = Object.assign({}, COMPLIANCE_DEFAULTS.footer, (COMPLIANCE || {}).footer || {});
  if (!cfg.enabled) {
    document.querySelector(".compliance-banner")?.remove();
    document.querySelector(".watermark")?.remove();
    document.querySelector(".site-footer")?.remove();
    return;
  }
  // Banner
  const banner = document.querySelector(".compliance-banner");
  if (banner) banner.innerHTML = cfg.banner;
  // Watermark via CSS var (set inline svg with text)
  const wm = document.querySelector(".watermark");
  if (wm && cfg.watermark) {
    const txt = String(cfg.watermark).replace(/'/g, "");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='240' viewBox='0 0 420 240'><g transform='rotate(-22 210 120)' fill='%23000' fill-opacity='0.06' font-family='-apple-system,PingFang SC,Microsoft YaHei,sans-serif' font-size='18' font-weight='500'><text x='40' y='80'>${txt}</text><text x='40' y='180'>${txt}</text></g></svg>`;
    wm.style.backgroundImage = `url("data:image/svg+xml;utf8,${svg}")`;
  }
  // Footer
  const f = document.querySelector(".site-footer");
  if (f) {
    f.innerHTML = `
      <div class="ft-row">
        <span>${esc(cfg.footer.copyright)}</span>
        <span><strong>${esc(cfg.footer.curator)}</strong></span>
        <span>${esc(cfg.footer.contact)}</span>
      </div>
      <div class="ft-row"><span>${esc(cfg.footer.aiNote)}</span></div>
      <div class="ft-row"><span>${esc(cfg.footer.personalNote)}</span></div>
      <div class="ft-takedown">${esc(cfg.footer.takedown)}</div>
    `;
  }
  // No-copy toggle
  if (!cfg.noCopy) {
    document.body.style.userSelect = "auto";
    document.body.style.webkitUserSelect = "auto";
  }
}

function renderDeepDiveBlock(item, label) {
  const has =
    item.deepDive ||
    (item.quotes && item.quotes.length) ||
    (item.bookSearchTerms && item.bookSearchTerms.length);
  if (!has) return "";
  let h = `<details class="deep-dive"><summary>${esc(label || T.expandDeep)}</summary><div class="deep-dive-body">`;
  if (item.deepDive) h += `<div class="deep-dive-text">${fmt(item.deepDive)}</div>`;
  if (item.quotes && item.quotes.length) {
    h += `<ul class="quote-list">${item.quotes
      .map(
        (q) =>
          `<li><blockquote>${fmt(q.text)}</blockquote><cite>${esc(q.ref || q.chapter || "")}</cite></li>`
      )
      .join("")}</ul>`;
  }
  if (item.bookSearchTerms && item.bookSearchTerms.length) {
    h += `<p class="jump-row">${esc(T.sbBookSearch)}: ${item.bookSearchTerms
      .map(
        (t) =>
          `<button type="button" class="book-search-trigger" data-query="${esc(t)}">${esc(t)}</button>`
      )
      .join(" ")}</p>`;
  }
  h += `</div></details>`;
  return h;
}

function tokenizeQuery(q) {
  const s = (q || "").toLowerCase().trim();
  const stop = new Set([
    "什么", "是", "的", "了", "和", "与", "怎么", "如何", "为什么",
    "请", "可以", "我", "你", "他", "她", "它", "这", "那", "吗", "啊",
    "呢", "也", "都", "在", "有", "没有", "并", "或", "但", "而",
    "一个", "一种", "一些",
  ]);
  let tokens = (s.match(/[\u4e00-\u9fff]{2,}|[a-z0-9]{2,}/g) || []).filter(
    (t) => !stop.has(t)
  );
  if (!tokens.length && /[\u4e00-\u9fff]/.test(s)) {
    tokens = (s.match(/[\u4e00-\u9fff]{1,}/g) || []).filter((t) => !stop.has(t));
  }
  return tokens;
}

function expandQueryTerms(q) {
  const base = tokenizeQuery(q);
  const set = new Set(base);
  const lowQ = (q || "").toLowerCase();

  // 从 glossary 扩展：query 命中 term → 加入该 term 的 bookSearchTerms
  (DATA?.glossary || []).forEach((g) => {
    if (!g.term) return;
    if (lowQ.includes(g.term)) {
      (g.bookSearchTerms || []).forEach((t) => set.add(t));
      set.add(g.term);
    }
  });
  // 从 persona 模型扩展
  (PERSONA?.models || []).forEach((m) => {
    if (m.keywords.some((k) => lowQ.includes(k))) {
      (m.bookSearchTerms || []).forEach((t) => set.add(t));
      m.keywords.forEach((k) => set.add(k));
    }
  });
  return Array.from(set);
}

function matchPersonaModel(query) {
  if (!PERSONA || !PERSONA.models) return null;
  const q = (query || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  PERSONA.models.forEach((m) => {
    let score = 0;
    m.keywords.forEach((k) => {
      if (q.includes((k || "").toLowerCase())) score += k.length;
    });
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  });
  return bestScore >= 2 ? best : null;
}

function sectionReaderId(sectionRef) {
  return (
    "reader-" +
    String(sectionRef || "x")
      .replace(/§/g, "s")
      .replace(/[^a-zA-Z0-9\u4e00-\u9fff_]/g, "_")
  );
}

function chunksForSection(sectionRef) {
  if (!BOOK_INDEX || !BOOK_INDEX.chunks) return [];
  const ref = (sectionRef || "").replace(/^§/, "").trim();
  if (!ref) return [];
  const isChapter = !ref.includes(".");
  return BOOK_INDEX.chunks
    .filter((c) => {
      const sr = (c.sectionRef || "").replace(/^§/, "");
      if (sr === ref || sr.startsWith(ref + ".")) return true;
      if (isChapter && String(c.chapterNum) === ref) return true;
      if (isChapter && new RegExp(`第\\s*${ref}\\s*章`).test(c.chapter || "")) return true;
      if (!isChapter) {
        const head = ((c.text || "").trim().split("\n")[0] || "").trim();
        if (head === ref || head.startsWith(ref + ".")) return true;
      }
      return false;
    })
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function loadSectionReader(sectionRef, container) {
  if (!container) return;
  const chunks = chunksForSection(sectionRef);
  if (!chunks.length) {
    container.innerHTML =
      `<p class="muted">${esc(T.emptyMatch)}</p>`;
    container.classList.remove("hidden");
    return;
  }
  const full = chunks.map((c) => c.text).join("\n\n");
  container.innerHTML = `<p class="muted">§${esc(sectionRef.replace(/^§/, ""))} · ${chunks.length} ${esc(T.paragraphsSuffix)} · ${esc(T.approxCharsPrefix)}${full.length}${esc(T.approxCharsSuffix)}</p><pre class="book-pre section-full">${esc(full)}</pre>`;
  container.classList.remove("hidden");
}

function bindReadSectionButtons(root) {
  (root || document).querySelectorAll(".read-section-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ref = btn.dataset.section || "";
      const rid = btn.dataset.reader || sectionReaderId(ref);
      let box = document.getElementById(rid);
      if (!box) {
        box = document.createElement("div");
        box.id = rid;
        box.className = "section-reader hidden";
        btn.parentElement.appendChild(box);
      }
      if (!box.classList.contains("hidden")) {
        box.classList.add("hidden");
        btn.textContent = T.readSection;
        return;
      }
      btn.textContent = T.collapseSection;
      loadSectionReader(ref, box);
    };
  });
}

function searchBookChunks(query, limit = 8) {
  if (!BOOK_INDEX || !BOOK_INDEX.chunks) return [];
  const baseTerms = tokenizeQuery(query);
  const allTerms = expandQueryTerms(query);
  if (!allTerms.length) return [];
  const model = matchPersonaModel(query);
  const boostRefs = new Set(model ? model.sectionRefs || [] : []);

  const scored = BOOK_INDEX.chunks
    .map((c) => {
      const hay = (c.chapter + " " + c.text).toLowerCase();
      let score = 0;
      allTerms.forEach((t) => {
        if (!t) return;
        const isBase = baseTerms.includes(t);
        const weight = (t.length >= 2 ? 2 : 1) * (isBase ? 2 : 1);
        if (hay.includes(t)) score += weight;
      });
      if (c.chapter && baseTerms.some((t) => c.chapter.includes(t))) score += 3;
      if (boostRefs.has(c.sectionRef)) score += 5;
      return { chunk: c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

function highlightTerms(text, terms) {
  let out = esc(text);
  terms.forEach((t) => {
    if (t.length < 2) return;
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    out = out.replace(re, "<mark>$1</mark>");
  });
  return out;
}

function extractAnswerSentences(text, terms, maxLen = 360) {
  if (!text) return "";
  const sentences = text
    .replace(/\s+/g, "")
    .split(/(?<=[。！？!?；;])/)
    .filter((s) => s.length > 4);
  if (!sentences.length) return text.slice(0, maxLen);
  const scored = sentences.map((s, idx) => {
    let score = 0;
    terms.forEach((t) => {
      if (t.length < 2) return;
      const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const m = s.match(re);
      if (m) score += m.length * t.length;
    });
    if (idx < 3) score += 1;
    return { s, score, idx };
  });
  const hot = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, 4)
    .sort((a, b) => a.idx - b.idx);
  let pick = hot.length ? hot : scored.slice(0, 2);
  let out = "";
  for (const x of pick) {
    if (out.length + x.s.length > maxLen) break;
    out += x.s;
  }
  if (!out) out = sentences.slice(0, 2).join("");
  return out;
}

function pickLang(model, key) {
  if (!model) return "";
  if (window.LANG === "en" && model[key + "_en"]) return model[key + "_en"];
  return model[key] || "";
}
function pickLangArr(model, key) {
  if (!model) return [];
  if (window.LANG === "en" && Array.isArray(model[key + "_en"])) return model[key + "_en"];
  return Array.isArray(model[key]) ? model[key] : [];
}
function pickPersonaField(key) {
  const p = PERSONA?.persona;
  if (!p) return "";
  if (window.LANG === "en" && p[key + "_en"]) return p[key + "_en"];
  return p[key] || "";
}

function renderPersonaCard(query, model) {
  if (!model) return "";
  const refsBtn = (model.sectionRefs || [])
    .map(
      (r) =>
        `<button type="button" class="persona-ref-btn book-search-trigger" data-query="${esc(r.replace(/^§/, ""))}">${esc(r)}</button>`
    )
    .join("");
  const calloutText = pickLang(model, "callout");
  const callout = calloutText
    ? `<p class="persona-callout">「${fmt(calloutText)}」</p>`
    : "";
  const questions = pickLangArr(model, "questions")
    .map((q) => `<li>${esc(q)}</li>`)
    .join("");
  return `<div class="qa-card persona-card">
    <div class="persona-head">
      <div class="persona-avatar">${esc(T.personaAvatar)}</div>
      <div class="persona-meta">
        <div class="persona-name">
          ${esc(pickPersonaField("name"))}
          <span class="persona-model-tag">${esc(pickLang(model, "title"))}</span>
          <span class="persona-ai-tag" title="${esc(T.personaAiTitle)}">${esc(T.personaAiTag)}</span>
        </div>
        <div class="persona-tagline">${esc(pickPersonaField("tagline"))}</div>
      </div>
    </div>
    <div class="persona-body">
      <p class="persona-core">${fmt(pickLang(model, "core"))}</p>
      ${callout}
      ${questions ? `<div class="persona-qblock"><div class="persona-qhead">${esc(T.personaQHead)}</div><ol class="persona-qlist">${questions}</ol></div>` : ""}
      ${refsBtn ? `<div class="persona-refs"><span class="muted">${esc(T.personaRefsLabel)}</span>${refsBtn}</div>` : ""}
    </div>
  </div>`;
}

function renderBookAnswer(query, hits) {
  const model = matchPersonaModel(query);
  let h = "";

  // 1) Persona 卡（命中则优先展示）
  if (model) {
    h += renderPersonaCard(query, model);
  } else if (hits.length) {
    // 没命中俞军模型 → fallback：传统提取式答案卡
    const terms = tokenizeQuery(query);
    const top = hits.slice(0, 3);
    const answerText = top
      .map(({ chunk }) => extractAnswerSentences(chunk.text, terms, 280))
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");
    h += `<div class="qa-card">
      <div class="qa-card-head">
        <span class="qa-tag">${esc(T.qaTagExcerpt)}</span>
        <span class="qa-question">${esc(query)}</span>
      </div>
      <p class="qa-answer-text">${highlightTerms(answerText, terms)}</p>
      <p class="qa-source-hint">${esc(T.qaSourceHint)}</p>
    </div>`;
  } else {
    return `<div class="qa-empty">
      <p>${T.qaEmptyLead(esc(query))}</p>
      <p class="muted">${esc(T.qaEmptyHint)}</p>
    </div>`;
  }

  // 2) 原文引用卡（巩固阅读）
  if (hits.length) {
    const terms = expandQueryTerms(query);
    const top = hits.slice(0, 3);
    h += `<div class="qa-refs">
      <div class="qa-refs-head">
        <span class="qa-refs-title">${esc(T.qaRefsTitle)}</span>
        <span class="muted">${esc(model ? T.qaRefsHintModel : T.qaRefsHintScore)} ${esc(T.qaRefsCountSuffix(BOOK_INDEX.meta?.chunkCount || "?"))}</span>
      </div>`;
    top.forEach(({ chunk, score }, i) => {
      const excerpt = chunk.text.slice(0, 480).replace(/\s+/g, " ");
      const truncated = chunk.text.length > 480;
      h += `<article class="qa-ref" data-id="${chunk.id}">
        <header class="qa-ref-head">
          <span class="qa-ref-rank">${i + 1}</span>
          <span class="qa-ref-ch">${esc(chunk.chapter || chunk.sectionRef || "")}</span>
          <span class="qa-ref-score" title="${esc(T.qaScoreTitle)}">★ ${score}</span>
        </header>
        <p class="qa-ref-excerpt">${highlightTerms(excerpt + (truncated ? "…" : ""), terms)}</p>
        ${truncated ? `<button type="button" class="qa-ref-expand" data-id="${chunk.id}">${esc(T.qaRefExpand)}</button><div class="qa-ref-full hidden" id="qaFull-${chunk.id}"><pre class="book-pre">${highlightTerms(chunk.text.slice(0, 8000), terms)}</pre></div>` : ""}
      </article>`;
    });
    h += `</div>`;
  } else if (model) {
    h += `<p class="muted" style="margin-top:12px">${esc(T.qaNoMatchPrefix)} (${(model.sectionRefs || []).join(", ")}) ${esc(T.qaNoMatchSuffix)}</p>`;
  }

  return h;
}

function bindBookSearchTriggers(root) {
  (root || document).querySelectorAll(".book-search-trigger").forEach((btn) => {
    btn.onclick = () => {
      const q = btn.dataset.query || "";
      document.getElementById("book-qa").scrollIntoView({ behavior: "smooth" });
      // K 区已改为 Chat 形式：直接把这个查询作为问题发给俞老师
      if (typeof sendYuChat === "function") {
        // 给一点时间让滚动落位
        setTimeout(() => sendYuChat(q), 220);
        return;
      }
      // fallback（理论上不会走到）
      const input = document.getElementById("bookQaInput");
      if (input) {
        input.value = q;
        runBookSearch(q);
      }
    };
  });
}

function runBookSearch(query) {
  const q = (query || "").trim();
  const answerEl = document.getElementById("bookQaAnswer");
  const listEl = document.getElementById("bookQaList");
  if (!answerEl || !listEl) return;
  if (!BOOK_INDEX || !BOOK_INDEX.chunks) {
    answerEl.innerHTML =
      `<p class='muted'>${esc(T.bookHint)}</p>`;
    return;
  }
  if (!q) {
    answerEl.innerHTML = `<p class='muted'>${esc(T.qaListHint)}</p>`;
    listEl.innerHTML = "";
    return;
  }
  const hits = searchBookChunks(q, 12);
  answerEl.innerHTML = renderBookAnswer(q, hits);
  bindBookSearchTriggers(answerEl);
  const terms = expandQueryTerms(q);
  const more = hits.slice(3);
  listEl.innerHTML = more.length
    ? `<details class="qa-more"><summary>${esc(T.qaMoreSummary(more.length))}</summary>${more
        .map(
          ({ chunk, score }) =>
            `<article class="qa-ref qa-ref-min"><header class="qa-ref-head"><span class="qa-ref-ch">${esc(chunk.chapter)}</span><span class="qa-ref-score">★ ${score}</span></header><p class="qa-ref-excerpt">${highlightTerms(chunk.text.slice(0, 320) + "…", terms)}</p></article>`
        )
        .join("")}</details>`
    : "";
  answerEl.querySelectorAll(".qa-ref-expand").forEach((btn) => {
    btn.onclick = () => {
      const full = document.getElementById("qaFull-" + btn.dataset.id);
      if (full) full.classList.toggle("hidden");
      btn.textContent = full.classList.contains("hidden") ? T.qaRefExpand : T.qaRefCollapse;
    };
  });
}

function renderBookQA() {
  const panel = document.getElementById("bookQaPanel");
  if (!panel) return;
  // 新形态：纯 Chat（接千问）
  renderYuChat(panel);
}

// =====================================================================
// 「问俞老师」Chat — 千问 (DashScope OpenAI 兼容端点)
// =====================================================================
const YUCHAT = {
  storageKey: "yujun_chat_apikey_v1",
  modelKey: "yujun_chat_model_v1",
  endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  models: [
    { id: "qwen-plus", label: T.modelLabels["qwen-plus"] },
    { id: "qwen-max", label: T.modelLabels["qwen-max"] },
    { id: "qwen-turbo", label: T.modelLabels["qwen-turbo"] },
  ],
  history: [], // [{role:'user'|'assistant', content:string}]
  busy: false,
  proxyUrl: null, // 留给阿里云 FC 部署用：window.YU_CHAT_PROXY_URL
};

function getYuApiKey() {
  return localStorage.getItem(YUCHAT.storageKey) || "";
}
function setYuApiKey(k) {
  if (k) localStorage.setItem(YUCHAT.storageKey, k);
  else localStorage.removeItem(YUCHAT.storageKey);
}
function getYuModel() {
  return localStorage.getItem(YUCHAT.modelKey) || YUCHAT.models[0].id;
}
function setYuModel(m) {
  localStorage.setItem(YUCHAT.modelKey, m);
}

function buildYuSystemPrompt() {
  const p = PERSONA?.persona || {};
  if (window.LANG === "en") {
    return buildYuSystemPromptEN(p);
  }
  // 把 PERSONA 卡片浓缩成系统提示，约束输出格式
  const principles = (p.principles || []).map((x) => `- ${x}`).join("\n");
  const models = (PERSONA?.models || [])
    .map(
      (m) => `### ${m.title}\n核心: ${m.core}\n常用反问: ${(m.questions || []).join(" / ")}\n关键提醒: ${m.callout || "（无）"}`
    )
    .join("\n\n");
  return `你扮演${p.name || "俞军"}（${p.tagline || "前百度产品总监"}），用第一人称严格基于下列方法论回答问题。

# 立场
${p.intro || ""}

# 评审原则
${principles}

# 你掌握的核心模型（必须用其中之一作为主分析框架）
${models}

# 回答规则（严格执行）
1. **先反问后判断**：如果用户的问题信息不足以套进上述任一模型——比如没说清"用户在什么情境"、"旧方案是什么"、"利润模型怎么算"——必须先反问 1–3 个澄清问题再回答，**不要瞎猜**。
2. **不接受竞品参照系**："XXX 也这么做"不是论据。
3. **不接受用户量/数据涨作为证明**：先解释机制，再相信数据。
4. **判断要给依据**：说"这个对/不对"必须指出命中或断在哪个模型的哪个环节（例：用户价值公式的"替换成本"项）。
5. **第一性原理**：从用户价值、交易成本、可持续性出发，不堆砌名词。
6. **风格**：直接、克制、不寒暄、不说"非常好的问题"。短句优先。可以用 \`**加粗**\` 强调关键词、用 \`*斜体*\` 标注俞军式的用词（如 *用户模型*、*替换成本*、*D10*）。
7. **追问**：每次回答末尾给出 2–3 个用户可能想继续追问的方向，用 JSON 块输出，格式严格如下：
\`\`\`followup
["追问 1", "追问 2", "追问 3"]
\`\`\`
   这个 JSON 块是给前端解析的，**只输出这一个 JSON 块**，不要在其他位置写 JSON。

# 范围
- 你只回答与产品方法论、用户价值、交易模型、组织/PM 选用育留、决策理性相关的问题。
- 用户问无关问题（生活、八卦、其它行业知识）→ 简短拒绝并引导回方法论：「我只在产品方法论里有判断力，这个问题问别人。」
- 不要编造原书章节号或具体页码。如需引用，只引用上面"核心模型"中已有的 sectionRefs 范围。

# 重要免责
你是 AI 模拟，**不代表俞军本人立场**。如果用户问"你是俞军本人吗"——明确说不是，是基于公开方法论的模拟。`;
}

function buildYuSystemPromptEN(p) {
  const principles = (p.principles_en || p.principles || []).map((x) => `- ${x}`).join("\n");
  const models = (PERSONA?.models || [])
    .map(
      (m) =>
        `### ${m.title_en || m.title}\nCore: ${m.core_en || m.core}\nClarifying questions you ask first: ${(m.questions_en || m.questions || []).join(" / ")}\nKey reminder: ${m.callout_en || m.callout || "(none)"}`
    )
    .join("\n\n");
  return `You play ${p.name_en || "Yu Jun"} (${p.tagline_en || "former VP of Product at Baidu, author of *Yu Jun on Product Methodology*"}). Answer in first person, strictly based on the methodology below. **Always answer in English.**

# Stance
${p.intro_en || p.intro || ""}

# Review principles
${principles}

# Core models you must use (pick one as the main analytical frame for each answer)
${models}

# Answering rules (strict)
1. **Clarify before you judge.** If the question lacks enough context to fit any model above — e.g. you don't know the *user model* (which user, in what *situation*, what is their *current alternative*), the *profit model*, or the *replacement cost* — ask 1–3 clarifying questions first. **Do not guess.**
2. **Reject competitor benchmarking as an argument.** "Company X does it this way" is never evidence on its own.
3. **Reject "metrics went up" as proof.** Explain the mechanism first, then trust the data.
4. **Justify every judgement.** When you say something is right or wrong, name the model and the specific step it hits or breaks (e.g. "the *replacement cost* term in the user-value formula").
5. **First principles.** Reason from user value, transaction cost, and sustainability — don't pile up jargon.
6. **Style.** Direct, restrained, no pleasantries, never say "great question". Short sentences first. Use \`**bold**\` for key terms; use \`*italics*\` for Yu Jun's signature vocabulary (e.g. *user model*, *replacement cost*, *transaction cost*, *D10*).
7. **Follow-up.** End each reply with 2–3 directions the user might want to ask next, as a single JSON block in this exact format:
\`\`\`followup
["follow-up 1", "follow-up 2", "follow-up 3"]
\`\`\`
   This JSON block is for the frontend; output **only this one JSON block** and no JSON anywhere else.

# Scope
- You only answer questions about product methodology, user value, transaction models, organisation, PM selection / development, and decision rationality.
- For unrelated questions (life, gossip, other industries), refuse briefly and steer back: "I only have real judgement inside product methodology — ask someone else."
- Do not fabricate chapter numbers or page numbers. If you cite, only use the \`sectionRefs\` already listed in the core models above.

# Disclaimer
You are an AI simulation and **do not represent the real Yu Jun's positions**. If the user asks "are you the real Yu Jun?" — say no, you are a simulation based on his public methodology.`;
}

function renderYuChat(panel) {
  const hasPersona = !!(PERSONA && PERSONA.models && PERSONA.models.length);
  if (!hasPersona) {
    panel.innerHTML = `<p class="qa-empty"><strong>${esc(T.noPersona)}</strong></p>`;
    return;
  }
  const hasKey = !!getYuApiKey();
  const samples = T.chatSamples;
  panel.innerHTML = `
    <div class="chat-wrap" id="yuChatWrap">
      <div class="chat-status-bar">
        <span class="chat-status-dot ${hasKey ? "ok" : "warn"}" id="yuStatusDot"></span>
        <span id="yuStatusText" class="muted">${hasKey ? T.chatReady : T.chatNoKey}</span>
        <select class="chat-model-select" id="yuModelSelect">
          ${YUCHAT.models.map((m) => `<option value="${m.id}" ${m.id === getYuModel() ? "selected" : ""}>${esc(m.label)}</option>`).join("")}
        </select>
        <span class="chat-status-spacer"></span>
        <button type="button" class="chat-key-btn" id="yuKeyBtn">${hasKey ? T.chatKeyChange : T.chatKeyConfig}</button>
        <button type="button" class="chat-clear-btn" id="yuClearBtn">${T.chatClear}</button>
      </div>
      <div class="chat-stream" id="yuChatStream">
        ${renderYuEmptyHero(samples)}
      </div>
      <div class="chat-suggest-row" id="yuSuggestRow" style="display:none">
        ${samples.map((s) => `<button type="button" class="chat-suggest-chip" data-q="${esc(s)}">${esc(s)}</button>`).join("")}
      </div>
      <div class="chat-input-row">
        <textarea id="yuChatInput" rows="1" placeholder="${esc(T.chatPlaceholder)}" ></textarea>
        <button type="button" class="chat-send-btn" id="yuSendBtn">${T.chatSend}</button>
      </div>
    </div>
  `;

  const input = document.getElementById("yuChatInput");
  const sendBtn = document.getElementById("yuSendBtn");
  document.getElementById("yuKeyBtn").onclick = () => openYuKeyModal();
  document.getElementById("yuClearBtn").onclick = () => {
    if (YUCHAT.history.length && !confirm(T.chatClearConfirm)) return;
    YUCHAT.history = [];
    document.getElementById("yuChatStream").innerHTML = renderYuEmptyHero(samples);
    document.getElementById("yuSuggestRow").style.display = "none";
    bindYuSampleChips();
  };
  document.getElementById("yuModelSelect").onchange = (e) => setYuModel(e.target.value);

  sendBtn.onclick = () => sendYuChat(input.value);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendYuChat(input.value);
    }
  });
  // auto resize
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  });

  bindYuSampleChips();
}

function renderYuEmptyHero(samples) {
  return `
    <div class="chat-empty-hero">
      <h3>${esc(T.chatTitle)}</h3>
      <p>${T.chatHero}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">
        ${samples.map((s) => `<button type="button" class="chat-suggest-chip" data-q="${esc(s)}">${esc(s)}</button>`).join("")}
      </div>
    </div>`;
}

function bindYuSampleChips() {
  document.querySelectorAll("#bookQaPanel .chat-suggest-chip").forEach((btn) => {
    btn.onclick = () => sendYuChat(btn.dataset.q || btn.textContent);
  });
}

function appendYuMessage(role, html, opts = {}) {
  const stream = document.getElementById("yuChatStream");
  if (!stream) return null;
  // 第一次发送 → 移除 hero
  if (stream.querySelector(".chat-empty-hero")) {
    stream.innerHTML = "";
    document.getElementById("yuSuggestRow").style.display = "flex";
    document.querySelectorAll("#yuSuggestRow .chat-suggest-chip").forEach((btn) => {
      btn.onclick = () => sendYuChat(btn.dataset.q || btn.textContent);
    });
  }
  const wrap = document.createElement("div");
  wrap.className = `chat-msg chat-msg-${role === "user" ? "user" : "yu"}`;
  wrap.innerHTML = `
    <div class="chat-avatar chat-avatar-${role === "user" ? "user" : "yu"}">${role === "user" ? T.chatRoleUser : T.chatRoleAssistant}</div>
    <div class="chat-bubble">${html}</div>
  `;
  if (opts.id) wrap.id = opts.id;
  stream.appendChild(wrap);
  stream.scrollTop = stream.scrollHeight;
  return wrap;
}

function fmtYuMarkdown(text) {
  if (!text) return "";
  // 安全：先 esc，再做有限 markdown
  let s = esc(text);
  // **bold** / *italic*
  s = s.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, "$1<em>$2</em>$3");
  // `code`
  s = s.replace(/`([^`\n]+?)`/g, "<code>$1</code>");
  // 段落 / 列表（极简）
  const lines = s.split(/\n+/);
  const blocks = [];
  let listBuf = null;
  let listType = null;
  for (const ln of lines) {
    const t = ln.trim();
    if (!t) continue;
    if (/^\d+\.\s/.test(t)) {
      if (listType !== "ol") {
        if (listBuf) blocks.push((listType === "ol" ? "<ol>" : "<ul>") + listBuf + (listType === "ol" ? "</ol>" : "</ul>"));
        listBuf = "";
        listType = "ol";
      }
      listBuf += "<li>" + t.replace(/^\d+\.\s/, "") + "</li>";
    } else if (/^[-•·]\s/.test(t)) {
      if (listType !== "ul") {
        if (listBuf) blocks.push((listType === "ol" ? "<ol>" : "<ul>") + listBuf + (listType === "ol" ? "</ol>" : "</ul>"));
        listBuf = "";
        listType = "ul";
      }
      listBuf += "<li>" + t.replace(/^[-•·]\s/, "") + "</li>";
    } else {
      if (listBuf) {
        blocks.push((listType === "ol" ? "<ol>" : "<ul>") + listBuf + (listType === "ol" ? "</ol>" : "</ul>"));
        listBuf = null;
        listType = null;
      }
      blocks.push("<p>" + t + "</p>");
    }
  }
  if (listBuf) blocks.push((listType === "ol" ? "<ol>" : "<ul>") + listBuf + (listType === "ol" ? "</ol>" : "</ul>"));
  return blocks.join("");
}

function parseYuFollowup(raw) {
  // 抽取 ```followup [...] ```
  const m = raw.match(/```followup\s*([\s\S]*?)```/);
  if (!m) return { body: raw, follow: [] };
  const body = raw.replace(m[0], "").trim();
  let arr = [];
  try {
    arr = JSON.parse(m[1].trim());
    if (!Array.isArray(arr)) arr = [];
  } catch (_) {
    arr = [];
  }
  return { body, follow: arr.slice(0, 3) };
}

async function callQwen(messages, model) {
  const proxy = window.YU_CHAT_PROXY_URL || YUCHAT.proxyUrl;
  if (proxy) {
    // 走阿里云 FC 代理（部署后启用）
    const r = await fetch(proxy, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages }),
    });
    if (!r.ok) throw new Error("代理返回 " + r.status);
    return await r.json();
  }
  const key = getYuApiKey();
  if (!key) throw new Error("NO_API_KEY");
  const r = await fetch(YUCHAT.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.5,
      top_p: 0.85,
    }),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    if (r.status === 401) throw new Error(T.chatErrInvalidKey);
    throw new Error(`${T.chatErrApi} ${r.status}: ${txt.slice(0, 200)}`);
  }
  return await r.json();
}

async function sendYuChat(rawQ) {
  const q = (rawQ || "").trim();
  if (!q) return;
  if (YUCHAT.busy) return;
  if (!getYuApiKey() && !window.YU_CHAT_PROXY_URL) {
    openYuKeyModal(true);
    return;
  }
  const input = document.getElementById("yuChatInput");
  if (input) {
    input.value = "";
    input.style.height = "auto";
  }
  appendYuMessage("user", esc(q).replace(/\n/g, "<br/>"));
  YUCHAT.history.push({ role: "user", content: q });

  // typing 占位
  const typingNode = appendYuMessage(
    "yu",
    `<div class="chat-typing"><span></span><span></span><span></span></div>`,
    { id: "yuTyping" }
  );

  YUCHAT.busy = true;
  setYuSendDisabled(true);
  try {
    const messages = [
      { role: "system", content: buildYuSystemPrompt() },
      ...YUCHAT.history.slice(-10), // 只带最近 10 轮，省 token
    ];
    const resp = await callQwen(messages, getYuModel());
    const raw =
      resp?.choices?.[0]?.message?.content ||
      resp?.output?.choices?.[0]?.message?.content ||
      "";
    if (!raw) throw new Error(T.chatErrEmpty);
    const { body, follow } = parseYuFollowup(raw);
    const html =
      fmtYuMarkdown(body) +
      (follow.length
        ? `<div class="chat-followup">
            <div class="chat-followup-head">${esc(T.chatFollowupHead)}</div>
            ${follow.map((f) => `<button type="button" class="chat-followup-chip" data-q="${esc(f)}">${esc(f)}</button>`).join("")}
          </div>`
        : "");
    typingNode.querySelector(".chat-bubble").innerHTML = html;
    typingNode.querySelectorAll(".chat-followup-chip").forEach((btn) => {
      btn.onclick = () => sendYuChat(btn.dataset.q);
    });
    YUCHAT.history.push({ role: "assistant", content: body });
  } catch (e) {
    const msg = e?.message || String(e);
    if (msg === "NO_API_KEY") {
      typingNode.remove();
      openYuKeyModal(true);
    } else {
      typingNode.querySelector(".chat-bubble").innerHTML =
        `<p style="color:#ffa39e">⚠ ${esc(msg)}</p>` +
        `<p class="muted" style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px">${esc(T.chatTryHint)}</p>`;
    }
  } finally {
    YUCHAT.busy = false;
    setYuSendDisabled(false);
  }
}

function setYuSendDisabled(d) {
  const b = document.getElementById("yuSendBtn");
  if (b) b.disabled = d;
}

function openYuKeyModal(forced) {
  const existing = getYuApiKey();
  const bg = document.createElement("div");
  bg.className = "chat-modal-bg";
  bg.innerHTML = `
    <div class="chat-modal" role="dialog">
      <button type="button" class="chat-modal-x" id="yuKeyX" aria-label="${esc(T.chatModalCancel)}" title="${esc(T.chatModalCancel)}">✕</button>
      <h3>${esc(T.chatModalTitle)}</h3>
      <p class="chat-modal-sub">${esc(T.chatModalSub)}</p>
      <input type="password" id="yuKeyInput" placeholder="sk-xxxxxxxxxxxxxxxx" value="${esc(existing)}" autocomplete="off" />
      <div class="chat-modal-actions">
        ${forced ? "" : `<button type="button" class="chat-modal-cancel" id="yuKeyCancel">${esc(T.chatModalCancel)}</button>`}
        ${existing ? `<button type="button" class="chat-modal-cancel" id="yuKeyRemove">${esc(T.chatModalRemove)}</button>` : ""}
        <button type="button" class="chat-modal-save" id="yuKeySave">${esc(T.chatModalSave)}</button>
      </div>
      <div class="chat-modal-help">
        ${T.chatModalHelp}
      </div>
    </div>
  `;
  document.body.appendChild(bg);
  const close = () => {
    bg.remove();
    document.removeEventListener("keydown", onEsc, true);
  };
  function onEsc(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }
  document.addEventListener("keydown", onEsc, true);
  bg.addEventListener("click", (e) => {
    if (e.target === bg) close();
  });
  document.getElementById("yuKeyX")?.addEventListener("click", close);
  document.getElementById("yuKeyCancel")?.addEventListener("click", close);
  document.getElementById("yuKeyRemove")?.addEventListener("click", () => {
    setYuApiKey("");
    close();
    refreshYuStatus();
  });
  document.getElementById("yuKeySave").addEventListener("click", () => {
    const v = document.getElementById("yuKeyInput").value.trim();
    if (!v) return;
    setYuApiKey(v);
    close();
    refreshYuStatus();
  });
  setTimeout(() => document.getElementById("yuKeyInput")?.focus(), 50);
}

function refreshYuStatus() {
  const has = !!getYuApiKey() || !!window.YU_CHAT_PROXY_URL;
  const dot = document.getElementById("yuStatusDot");
  const txt = document.getElementById("yuStatusText");
  const btn = document.getElementById("yuKeyBtn");
  if (dot) dot.className = "chat-status-dot " + (has ? "ok" : "warn");
  if (txt) txt.textContent = has ? (window.YU_CHAT_PROXY_URL ? T.chatReadyProxy : T.chatReady) : T.chatNoKey;
  if (btn) btn.textContent = has ? T.chatKeyChange : T.chatKeyConfig;
}

function esc(s) {
  return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;") : "";
}

/** Escape HTML then render **bold** */
function fmt(s) {
  return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function pill(c) {
  const key = c || "medium";
  const labelMap = { high: T.pillHigh, medium: T.pillMedium, low: T.pillLow, prior: T.pillPrior };
  const titleMap = { high: T.sbConfHigh, medium: T.sbConfMedium, low: T.sbConfLow, prior: T.sbConfPrior };
  const label = labelMap[key] || key;
  const title = titleMap[key] || "";
  return `<span class="pill pill-${key}" title="${esc(title)}">${label}</span>`;
}

function nid(id) {
  return DATA.nodes.find((n) => n.id === id);
}

function ekey(e) {
  const s = typeof e.source === "object" ? e.source.id : e.source;
  const t = typeof e.target === "object" ? e.target.id : e.target;
  return `${s}→${t}`;
}

function incidentEdges(nodeId) {
  return DATA.edges.filter((e) => {
    const s = typeof e.source === "object" ? e.source.id : e.source;
    const t = typeof e.target === "object" ? e.target.id : e.target;
    return s === nodeId || t === nodeId;
  });
}

function renderNav() {
  document.getElementById("navLinks").innerHTML = SECTIONS.map(
    ([id, l]) => `<a href="#${id}">${l}</a>`
  ).join("");
}

function renderOverview() {
  const m = DATA.meta;
  const t = DATA.theory;
  document.title = m.title + T.documentTitleSuffix;
  document.getElementById("hdrTitle").textContent = m.title;
  document.getElementById("hdrDef").textContent = t.oneLiner || t.definition || "";
  document.getElementById("overviewNot").innerHTML = t.notThis
    ? `<strong>${esc(T.notThis)}</strong>${esc(t.notThis)}`
    : "";
  const books = (m.books || [])
    .map((b) => (b.title || b) + (b.author ? `（${b.author}）` : ""))
    .join(" · ");
  document.getElementById("overviewMeta").innerHTML = [
    m.updated && `${T.hdrUpdated}${m.updated}`,
    m.learningDepth && `${T.hdrDepth}${m.learningDepth}`,
    books && `${T.hdrBooks}${books}`,
    (m.contexts || []).length && `${T.hdrContexts}${m.contexts.join("、")}`,
  ]
    .filter(Boolean)
    .join("<br>");
}

function renderMarketComparison(mc) {
  if (!mc) return "";
  let h = `<div class="theory-block"><h3 class="theory-block-title">B5 · ${esc(mc.title || T.theoryB5DefaultTitle)}</h3>`;

  h += `<p class="jump-row"><button type="button" class="tree-jump" data-node="cn-market">${esc(T.mc_jumpCnMarket)}</button>`;
  h += `<button type="button" class="tree-jump" data-node="mis-na-copy">${esc(T.mc_jumpMisCopy)}</button></p>`;
  if (mc.intro) h += `<p class="theory-intro">${fmt(mc.intro)}</p>`;

  if (mc.rows && mc.rows.length) {
    h += `<table class="comparison-table"><thead><tr><th>${esc(T.mc_compDimHead)}</th><th>${esc(T.mc_compNAHead)}</th><th>${esc(T.mc_compCNHead)}</th></tr></thead><tbody>`;
    mc.rows.forEach((row) => {
      const jumps = (row.graphNodeIds || [])
        .map(
          (id) =>
            `<button type="button" class="tree-jump" data-node="${id}">${esc(nid(id)?.label || id)}</button>`
        )
        .join(" ");
      h += `<tr><th>${esc(row.dimension)}</th><td>${fmt(row.na)}${jumps ? `<div class="jump-row">${jumps}</div>` : ""}</td><td>${fmt(row.china)}</td></tr>`;
    });
    h += `</tbody></table>`;
  }

  if ((mc.portable && mc.portable.length) || (mc.notPortable && mc.notPortable.length)) {
    h += `<div class="portable-grid">`;
    if (mc.portable && mc.portable.length) {
      h += `<div class="portable-col"><h4>${esc(T.mc_portable)}</h4><ul class="theory-list">${mc.portable.map((s) => `<li>${fmt(s)}</li>`).join("")}</ul></div>`;
    }
    if (mc.notPortable && mc.notPortable.length) {
      h += `<div class="not-portable-col"><h4>${esc(T.mc_notPortable)}</h4><ul class="theory-list">${mc.notPortable.map((s) => `<li>${fmt(s)}</li>`).join("")}</ul></div>`;
    }
    h += `</div>`;
  }

  if (mc.otaCallout) {
    h += `<div class="ota-callout"><strong>${esc(T.mc_otaPrefix)}</strong> ${fmt(mc.otaCallout)}</div>`;
  }

  h += `</div>`;
  return h;
}

function renderFrameworkChip(p, refSlug, idx) {
  const item = typeof p === "string" ? { label: p, explain: "" } : p;
  const label = esc(item.label || "");
  if (!item.explain && !item.nodeId && !item.search) {
    return `<span class="fw-chip fw-chip-static">${label}</span>`;
  }
  const cid = `chip-${refSlug}-${idx}`;
  let extras = "";
  if (item.nodeId) {
    extras += ` <button type="button" class="fw-chip-go tree-jump" data-node="${item.nodeId}">${esc(T.graphChip)}</button>`;
  }
  if (item.search) {
    extras += ` <button type="button" class="fw-chip-go book-search-trigger" data-query="${esc(item.search)}">${esc(T.bookSearchSuffix)}</button>`;
  }
  return (
    `<button type="button" class="fw-chip fw-chip-toggle" data-target="${cid}">${label}</button>` +
    `<div id="${cid}" class="fw-chip-body hidden">${fmt(item.explain || "")}${extras}</div>`
  );
}

function decorateTerms(text) {
  if (!text) return "";
  const out = fmt(text);
  const terms = (DATA && DATA.glossary) || [];
  if (!terms.length) return out;
  const sorted = terms
    .filter((g) => g.term && g.term.length >= 2 && g.term.length <= 12)
    .slice()
    .sort((a, b) => b.term.length - a.term.length);
  let result = out;
  const placeholders = [];
  sorted.forEach((g) => {
    const re = new RegExp(
      `(?<!data-term="|>)${g.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "g"
    );
    result = result.replace(re, (m) => {
      const idx = placeholders.length;
      placeholders.push(
        `<mark class="fw-term" data-term="${esc(g.term)}" tabindex="0">${esc(m)}</mark>`
      );
      return `\u0000${idx}\u0000`;
    });
  });
  result = result.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
  return result;
}

function renderFrameworkNode(n, depth = 0) {
  const hasKids = n.children && n.children.length;
  const refSlug = sectionReaderId(n.sectionRef || n.label || `n-${depth}`);
  const ref = n.sectionRef
    ? `<span class="fw-ref">${esc(n.sectionRef)}</span>`
    : "";
  const summaryHtml = n.summary ? decorateTerms(n.summary) : "";
  const inlineSummary = summaryHtml
    ? `<span class="fw-inline-summary">${summaryHtml}</span>`
    : "";

  const chips = (n.keyPoints || [])
    .map((p, i) => renderFrameworkChip(p, refSlug, i))
    .join("");
  const chipsRow = chips ? `<div class="fw-chips">${chips}</div>` : "";

  const kidsHtml = hasKids
    ? `<div class="fw-children">${renderFrameworkTree(n.children, depth + 1)}</div>`
    : "";
  const bodyHtml = chipsRow + kidsHtml;

  // Leaf: no children, no chips → render as flat row with summary inline
  if (!hasKids && !chips) {
    return `<div class="fw-leaf fw-depth-${depth}">
      <span class="fw-label">${esc(n.label)}</span>${ref}${inlineSummary}
    </div>`;
  }

  // Container node with body
  const openAttr = depth === 0 ? " open" : "";
  return (
    `<details class="fw-node fw-depth-${depth}"${openAttr}>` +
    `<summary class="fw-summary-row">` +
    `<span class="fw-label">${esc(n.label)}</span>${ref}${inlineSummary}` +
    `</summary>` +
    `<div class="fw-body">${bodyHtml}</div></details>`
  );
}

function closeTermPopover() {
  const pop = document.getElementById("termPopover");
  if (pop) pop.remove();
  document.querySelectorAll(".fw-term.active").forEach((m) =>
    m.classList.remove("active")
  );
}

function openTermPopover(mark, g) {
  closeTermPopover();
  mark.classList.add("active");
  const pop = document.createElement("div");
  pop.id = "termPopover";
  pop.className = "term-popover";
  const chapter = g.chapter ? `<span class="tp-chip">${esc(g.chapter)}</span>` : "";
  const node = g.nodeId
    ? `<button type="button" class="tp-link tree-jump" data-node="${esc(g.nodeId)}">${esc(T.tpJumpGraph)}</button>`
    : "";
  const search = (g.bookSearchTerms && g.bookSearchTerms[0]) || g.term;
  pop.innerHTML = `
    <div class="tp-head">
      <span class="tp-term">${esc(g.term)}</span>
      ${chapter}
      <button type="button" class="tp-close" aria-label="${esc(T.tpClose)}">✕</button>
    </div>
    <p class="tp-def">${fmt(g.definition || T.glossNoDef)}</p>
    <div class="tp-actions">
      ${node}
      <button type="button" class="tp-link book-search-trigger" data-query="${esc(search)}">${esc(T.tpBookSearch)}</button>
    </div>
  `;
  document.body.appendChild(pop);

  // position below the mark (or above if no space)
  const r = mark.getBoundingClientRect();
  const popW = Math.min(360, window.innerWidth - 24);
  pop.style.width = popW + "px";
  const ph = pop.offsetHeight;
  let top = r.bottom + window.scrollY + 8;
  if (r.bottom + ph + 16 > window.innerHeight) {
    top = r.top + window.scrollY - ph - 8;
  }
  let left = r.left + window.scrollX + r.width / 2 - popW / 2;
  left = Math.max(12, Math.min(left, window.scrollX + window.innerWidth - popW - 12));
  pop.style.top = top + "px";
  pop.style.left = left + "px";

  pop.querySelector(".tp-close").onclick = closeTermPopover;
  bindBookSearchTriggers(pop);
  pop.querySelectorAll(".tree-jump").forEach((b) => {
    b.onclick = () => {
      jumpToNode(b.dataset.node);
      closeTermPopover();
    };
  });
}

function bindFrameworkTerms(root) {
  (root || document).querySelectorAll(".fw-term").forEach((m) => {
    m.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const term = m.dataset.term || m.textContent;
      const g = (DATA.glossary || []).find((x) => x.term === term);
      if (!g) return;
      const isActive = m.classList.contains("active");
      if (isActive) {
        closeTermPopover();
      } else {
        openTermPopover(m, g);
      }
    };
  });
}

document.addEventListener("click", (e) => {
  const pop = document.getElementById("termPopover");
  if (!pop) return;
  if (!pop.contains(e.target) && !e.target.classList.contains("fw-term")) {
    closeTermPopover();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTermPopover();
});
window.addEventListener("scroll", () => closeTermPopover(), { passive: true });

/* ============================================================
 *  合规：禁止复制 / 禁右键 / 拦截快捷键
 *  - input/textarea 内允许正常编辑
 *  - 其他位置禁选、禁复制、禁剪切、禁右键
 * ============================================================ */
function installCopyGuard() {
  const isEditable = (el) => {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return true;
    if (el.isContentEditable) return true;
    return false;
  };

  const cfg = Object.assign({}, COMPLIANCE_DEFAULTS, COMPLIANCE || {});
  if (!cfg.enabled || !cfg.noCopy) return;

  const block = (e) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  document.addEventListener("copy", block, true);
  document.addEventListener("cut", block, true);
  document.addEventListener("dragstart", block, true);
  if (cfg.noContextMenu !== false) {
    document.addEventListener("contextmenu", block, true);
  }
  document.addEventListener("selectstart", (e) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    if (isEditable(e.target)) return;
    const meta = e.ctrlKey || e.metaKey;
    if (!meta) return;
    const k = (e.key || "").toLowerCase();
    if (["c", "x", "a", "s", "p", "u"].includes(k)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

function renderFrameworkTree(nodes, depth = 0) {
  if (!nodes || !nodes.length) return "";
  return `<div class="framework-tree depth-${depth}">${nodes
    .map((n) => renderFrameworkNode(n, depth))
    .join("")}</div>`;
}

function bindFrameworkChips(root) {
  (root || document).querySelectorAll(".fw-chip-toggle").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tid = btn.dataset.target;
      const box = document.getElementById(tid);
      if (!box) return;
      const isOpen = !box.classList.contains("hidden");
      if (isOpen) {
        box.classList.add("hidden");
        btn.classList.remove("fw-chip-open");
      } else {
        box.classList.remove("hidden");
        btn.classList.add("fw-chip-open");
      }
    };
  });
}

function renderTheory() {
  const t = DATA.theory;
  let h = "";

  h += `<div class="theory-block"><h3 class="theory-block-title">${esc(T.theoryB0Title)}</h3>`;
  if (t.oneLiner) h += `<p class="one-liner">${esc(t.oneLiner)}</p>`;
  if (t.definition && t.definition !== t.oneLiner)
    h += `<p class="muted">${esc(T.plainPrefix)}${esc(t.definition)}</p>`;
  if (t.notThis) h += `<p class="not-this"><strong>${esc(T.notThis)}</strong>${esc(t.notThis)}</p>`;
  h += `</div>`;

  if (t.frameworkTree && t.frameworkTree.length) {
    h += `<div class="theory-block"><h3 class="theory-block-title">${esc(T.theoryB1Title)}</h3>`;
    h += `<p class="muted">${esc(T.theoryB1Sub)}</p>`;
    h += renderFrameworkTree(t.frameworkTree);
    h += `</div>`;
  }

  if (t.introForBeginners) {
    h += `<div class="theory-block"><h3 class="theory-block-title">${esc(T.theoryB3Title)}</h3><div class="theory-intro">${esc(t.introForBeginners)}</div></div>`;
  }

  if (t.pillars && t.pillars.length) {
    h += `<div class="theory-block"><h3 class="theory-block-title">${esc(T.theoryB3bTitle)}</h3>`;
    t.pillars.forEach((p) => {
      h += `<div class="theory-pillar"><h4>${esc(p.name || "")}</h4>`;
      if (p.definition) h += `<p><strong>${esc(T.pillarLabelDefinition)}</strong> ${fmt(p.definition)}</p>`;
      if (p.mechanism) h += `<p class="muted"><strong>${esc(T.pillarLabelMechanism)}</strong> ${fmt(p.mechanism)}</p>`;
      if (p.boundary) h += `<p class="muted"><strong>${esc(T.pillarLabelBoundary)}</strong> ${fmt(p.boundary)}</p>`;
      h += `<div class="field-grid">`;
      if (p.plainExplain)
        h += `<div class="field-plain"><strong>${esc(T.pillarLabelPlain)}</strong><p>${fmt(p.plainExplain)}</p></div>`;
      if (p.example)
        h += `<div class="field-example"><strong>${esc(T.pillarLabelExample)}</strong><p>${fmt(p.example)}</p></div>`;
      if (p.analogy)
        h += `<div class="field-analogy"><strong>${esc(T.pillarLabelAnalogy)}</strong><p>${fmt(p.analogy)}</p></div>`;
      h += `</div>${renderDeepDiveBlock(p)}</div>`;
    });
    h += `</div>`;
  }

  h += `<div class="theory-block theory-block-b4"><h3 class="theory-block-title">${esc(T.theoryB4Title)}</h3>`;

  if (t.decisionGuide && t.decisionGuide.length) {
    h += `<h4>${esc(T.decisionGuideHeader)}</h4><table class="decision-guide"><thead><tr><th>${esc(T.decisionColJudgement)}</th><th>${esc(T.decisionColAction)}</th><th>${esc(T.decisionColGraph)}</th></tr></thead><tbody>`;
    t.decisionGuide.forEach((row) => {
      const tools = (row.tools || [])
        .map(
          (id) =>
            `<button type="button" class="tree-jump" data-node="${id}">${esc(nid(id)?.label || id)}</button>`
        )
        .join(" ");
      h += `<tr><td>${esc(row.question)}</td><td>${esc(row.then)}</td><td class="jump-row">${tools}</td></tr>`;
    });
    h += `</tbody></table>`;
  }

  if (t.classicModels && t.classicModels.length) {
    h += `<h4>${esc(T.classicModelsHeader)}</h4><table class="models-table"><thead><tr><th>${esc(T.classicColName)}</th><th>${esc(T.classicColOneLine)}</th><th>${esc(T.classicColLesson)}</th></tr></thead><tbody>`;
    t.classicModels.forEach((m) => {
      h += `<tr><td>${esc(m.name)}</td><td>${esc(m.oneLine)}</td><td>${esc(m.lesson)}</td></tr>`;
    });
    h += `</tbody></table>`;
  }

  if (t.coreClaims && t.coreClaims.length) {
    h += `<h4>${esc(T.coreClaimsHeader)}</h4><ol class="theory-list">${t.coreClaims.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>`;
  }

  if (t.learningTracks && t.learningTracks.length) {
    h += `<h4>${esc(T.learningTracksHeader)}</h4><div class="learning-tracks">`;
    t.learningTracks.forEach((tr) => {
      h += `<div class="learning-track"><h5>${esc(tr.title)}</h5><ol class="theory-list">${(tr.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>`;
    });
    h += `</div>`;
  }

  if (t.workedExample) {
    const ex = t.workedExample;
    h += `<div class="worked-example"><h4>${esc(T.workedExampleHeader)}${esc(ex.title)}</h4>`;
    if (ex.setup) h += `<p>${esc(ex.setup)}</p>`;
    if (ex.matrix) {
      const mx = ex.matrix;
      h += `<table class="models-table payoff-matrix"><thead><tr><th></th>${mx.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>`;
      mx.rows.forEach((row, i) => {
        h += `<tr><th>${esc(row)}</th>${mx.cells[i].map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`;
      });
      h += `</tbody></table>`;
    }
    if (ex.steps && ex.steps.length)
      h += `<ol class="theory-list">${ex.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
    if (ex.takeaway) h += `<p class="takeaway"><strong>${esc(T.conclusionPrefix)}</strong>${esc(ex.takeaway)}</p>`;
    h += `</div>`;
  }

  if (t.quickStartSteps && t.quickStartSteps.length) {
    h += `<h4>${esc(T.defaultPathHeader)}</h4><ol class="theory-list">${t.quickStartSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
  }

  h += `</div>`;

  if (t.marketComparison) {
    h += renderMarketComparison(t.marketComparison);
  }

  document.getElementById("theoryBody").innerHTML = h || `<p class='muted'>${esc(T.empty)}</p>`;
  document.querySelectorAll(".tree-jump").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.node;
      if (id) jumpToNode(id);
    };
  });
  bindBookSearchTriggers(document.getElementById("theoryBody"));
  bindReadSectionButtons(document.getElementById("theoryBody"));
  bindFrameworkChips(document.getElementById("theoryBody"));
  bindFrameworkTerms(document.getElementById("theoryBody"));
}

function renderGraphLegend() {
  const el = document.getElementById("edgeLegend");
  if (!el) return;
  const leg = DATA.edgeTypeLegend || [];
  if (!leg.length) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML =
    `<span class="legend-title">${esc(T.legendEdgeTypes)}</span>` +
    leg
      .map(
        (x) =>
          `<span class="legend-item" title="${esc(x.explain)}"><b>${esc(x.label)}</b> ${esc(x.explain)}</span>`
      )
      .join("");
}

function cleanChunkText(text) {
  if (!text) return [];

  const BOOK_TITLE = (DATA && DATA.meta && DATA.meta.title) || "";
  const headerNoise = new RegExp(
    [
      "^俞军产品方法论$",
      "^俞军产$",
      "^品方法论$",
      "^第\\s*[一二三四五六七八九十\\d]+\\s*章$",
      "^第\\s*\\d+\\s*章\\s*[\\d．.]*$",
      "^§\\s*[\\d．.]+$",
      "^[\\d０-９]{1,4}$",
      "^[\\d０-９．.]{2,8}$",
      BOOK_TITLE ? `^${BOOK_TITLE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$` : null,
    ]
      .filter(Boolean)
      .join("|")
  );

  // 1) 行级处理：trim、丢噪声、压缩中文字间空格
  const lines = String(text)
    .split(/\n/)
    .map((l) => {
      let s = l.trim();
      // 中文字符之间的单空格 → 去掉（保留中英之间的）
      s = s.replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "$1");
      // 多空格 → 单空格
      s = s.replace(/\s{2,}/g, " ");
      return s;
    })
    .filter((s) => s && !headerNoise.test(s));

  // 2) 段落组装：短标题行（< 20 字 + 无标点结尾）独立成段
  const blocks = [];
  let buf = "";
  const flush = () => {
    if (buf.trim()) blocks.push({ type: "p", text: buf.trim() });
    buf = "";
  };
  const isHeading = (s) =>
    s.length <= 20 && !/[。，！？,!?；;：:]$/.test(s) && !/^\d/.test(s);

  for (const line of lines) {
    if (isHeading(line)) {
      flush();
      blocks.push({ type: "h", text: line });
      continue;
    }
    buf += line;
    if (/[。！？!?；;]$/.test(line) || buf.length >= 80) flush();
  }
  flush();
  return blocks;
}

function buildReadingTree() {
  const tree = (DATA.theory && DATA.theory.frameworkTree) || [];
  // 若顶级是单根节点（如「书名」）且无 sectionRef，则穿透取 children 作为顶层章
  let roots = tree;
  if (
    tree.length === 1 &&
    !tree[0].sectionRef &&
    Array.isArray(tree[0].children) &&
    tree[0].children.length
  ) {
    roots = tree[0].children;
  }
  const out = [];
  roots.forEach((ch) => {
    if (!ch.sectionRef) return;
    out.push({ level: 0, label: ch.label || "", sectionRef: ch.sectionRef });
    (ch.children || []).forEach((sec) => {
      if (!sec.sectionRef) return;
      out.push({ level: 1, label: sec.label || "", sectionRef: sec.sectionRef });
    });
  });
  return out;
}

function renderReadingPath() {
  const el = document.getElementById("readingPath");
  if (!el) return;
  const items = buildReadingTree();
  if (!items.length) {
    el.innerHTML = `<p class='muted'>${esc(T.empty)}</p>`;
    return;
  }
  const sideHtml = items
    .map(
      (s, i) => `
      <button type="button" class="rp-side-item rp-level-${s.level}${i === 0 ? " active" : ""}" data-idx="${i}">
        <span class="rp-side-ref">${esc(s.sectionRef)}</span>
        <span class="rp-side-label">${esc(stripRefPrefix(s.label, s.sectionRef))}</span>
      </button>`
    )
    .join("");
  el.innerHTML = `
    <div class="rp-twocol">
      <aside class="rp-side">${sideHtml}</aside>
      <main class="rp-main">
        <div class="rp-main-head">
          <span class="rp-main-ref" id="rpMainRef"></span>
          <span class="rp-main-title" id="rpMainTitle"></span>
          <span class="rp-main-meta" id="rpMainMeta"></span>
        </div>
        <div class="rp-main-body" id="rpMainBody"></div>
      </main>
    </div>
  `;

  function showItem(idx) {
    const item = items[idx];
    const chunks = chunksForSection(item.sectionRef);
    document.getElementById("rpMainRef").textContent = item.sectionRef;
    document.getElementById("rpMainTitle").textContent = stripRefPrefix(item.label, item.sectionRef);
    const meta = document.getElementById("rpMainMeta");
    const body = document.getElementById("rpMainBody");
    if (!chunks.length) {
      meta.textContent = T.emptyMatch;
      body.innerHTML = `<p class="muted">${esc(T.emptyNoBookIndex)} <button type="button" class="book-search-trigger" data-query="${esc(item.label)}">${esc(item.label)}</button></p>`;
      bindBookSearchTriggers(body);
      return;
    }
    // 按 chunk.sectionRef 分组（同一小节合并）
    const groups = [];
    const seen = new Map();
    chunks.forEach((c) => {
      const key = c.sectionRef || c.chapter || "";
      if (!seen.has(key)) {
        seen.set(key, groups.length);
        groups.push({ ref: key, label: subsectionLabel(key), parts: [] });
      }
      groups[seen.get(key)].parts.push(c.text);
    });
    const totalLen = groups.reduce(
      (s, g) => s + g.parts.reduce((x, t) => x + t.length, 0),
      0
    );
    meta.textContent = `${chunks.length} ${T.paragraphsSuffix} · ${T.approxCharsPrefix}${totalLen.toLocaleString()}${T.approxCharsSuffix}`;
    body.innerHTML = groups
      .map((g) => {
        const blocks = cleanChunkText(g.parts.join("\n"));
        const head =
          item.level === 0 && g.ref && g.ref !== item.sectionRef
            ? `<h4 class="rp-chunk-ch">${esc(g.ref)} ${esc(g.label || "")}</h4>`
            : "";
        const text = blocks
          .map((b) =>
            b.type === "h"
              ? `<h5 class="rp-chunk-h">${decorateTerms(b.text)}</h5>`
              : `<p>${decorateTerms(b.text)}</p>`
          )
          .join("");
        return `<article class="rp-chunk">${head}<div class="rp-chunk-text">${text}</div></article>`;
      })
      .join("");
    bindFrameworkTerms(body);
    bindBookSearchTriggers(body);
    body.scrollTop = 0;
  }

  el.querySelectorAll(".rp-side-item").forEach((btn) => {
    btn.onclick = () => {
      el.querySelectorAll(".rp-side-item").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      showItem(Number(btn.dataset.idx));
    };
  });
  showItem(0);
}

function stripRefPrefix(label, ref) {
  if (!label) return "";
  const r = String(ref || "").replace(/^§/, "");
  return String(label)
    .replace(new RegExp(`^§?\\s*${r}\\s*`), "")
    .replace(/^第\s*\d+\s*章\s*/, "")
    .trim();
}

function subsectionLabel(ref) {
  if (!ref) return "";
  const r = ref.replace(/^§/, "");
  const tree = (DATA.theory && DATA.theory.frameworkTree) || [];
  let found = "";
  function walk(nodes) {
    for (const n of nodes) {
      if (n.sectionRef && n.sectionRef.replace(/^§/, "") === r) {
        found = stripRefPrefix(n.label, n.sectionRef);
        return true;
      }
      if (n.children && walk(n.children)) return true;
    }
    return false;
  }
  walk(tree);
  return found;
}

function renderExisting() {
  const l = DATA.existingKnowledgeLinks || [];
  document.getElementById("existingLinks").innerHTML = l.length
    ? l.map((x) => `<a href="${x.path || "#"}">${esc(x.label)}</a> (${esc(x.status || "")})`).join("<br>")
    : `<p class='muted'>${esc(T.emptyMerge)}</p>`;
}

function renderSkillBridge() {
  document.getElementById("skillBridge").textContent =
    "Skill: skills/" + DATA.meta.slug + "/SKILL.md";
}

function chapterKey(ch) {
  const m = String(ch || "").match(/[1-5]/);
  if (m) return m[0];
  if (String(ch || "").includes("附")) return "附";
  return "0";
}

function renderMisconceptions() {
  const l = DATA.misconceptions || [];
  const el = document.getElementById("misconceptionList");
  const tbar = document.getElementById("miscToolbar");
  if (!el) return;
  if (!l.length) {
    el.innerHTML = `<p class='muted'>${esc(T.empty)}</p>`;
    return;
  }
  const chapters = Array.from(new Set(l.map((m) => m.chapter || T.miscDefaultChapter))).sort();
  let state = "all";
  if (tbar) {
    tbar.innerHTML =
      `<button type="button" class="misc-filter-chip active" data-ch="all">${esc(T.miscFilterAll)} ${l.length}</button>` +
      chapters
        .map(
          (c) =>
            `<button type="button" class="misc-filter-chip" data-ch="${esc(c)}">${esc(c)} <span class="muted">${l.filter((m) => (m.chapter || T.miscDefaultChapter) === c).length}</span></button>`
        )
        .join("");
  }
  function draw() {
    const items = state === "all" ? l : l.filter((m) => (m.chapter || T.miscDefaultChapter) === state);
    el.innerHTML = items
      .map((m) => {
        const tags = (m.bookSearchTerms || [])
          .slice(0, 3)
          .map(
            (t) =>
              `<button type="button" class="misc-tag book-search-trigger" data-query="${esc(t)}">${esc(t)}</button>`
          )
          .join("");
        const graphBtn = m.nodeId
          ? `<button type="button" class="misc-graph tree-jump" data-node="${m.nodeId}" title="${esc(T.miscJumpGraphTitle)}">${esc(T.miscJumpGraph)}</button>`
          : "";
        return `<article class="misc-card">
  <div class="misc-card-head">
    <span class="misc-card-ch">${esc(m.chapter || T.miscDefaultChapter)}</span>
    <span class="misc-card-title">${esc(m.title)}</span>
  </div>
  <div class="misc-cols">
    <div class="misc-col misc-col-wrong">
      <div class="misc-col-label">${esc(T.miscColMistake)}</div>
      <p>${fmt(m.description || "—")}</p>
    </div>
    <div class="misc-col misc-col-right">
      <div class="misc-col-label">${esc(T.miscColCorrection)}</div>
      <p>${fmt(m.correction || "—")}</p>
    </div>
  </div>
  <div class="misc-card-foot">${tags}${graphBtn}</div>
</article>`;
      })
      .join("");
    el.querySelectorAll(".tree-jump").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        jumpToNode(btn.dataset.node);
      };
    });
    bindBookSearchTriggers(el);
  }
  draw();
  if (tbar) {
    tbar.querySelectorAll(".misc-filter-chip").forEach((c) => {
      c.onclick = () => {
        state = c.dataset.ch;
        tbar.querySelectorAll(".misc-filter-chip").forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        draw();
      };
    });
  }
}

function renderGlossary() {
  const list = DATA.glossary || [];
  const el = document.getElementById("glossaryList");
  const detailEl = document.getElementById("glossaryDetail");
  const inp = document.getElementById("glossarySearch");
  const filterEl = document.getElementById("glossChapterFilter");
  if (!el) return;
  const chapters = Array.from(new Set(list.map((g) => g.chapter || T.glossDefaultChapter))).sort();
  let activeCh = "all";
  let activeTerm = null;

  function renderFilter() {
    if (!filterEl) return;
    filterEl.innerHTML =
      `<button type="button" class="gloss-filter-chip ${activeCh === "all" ? "active" : ""}" data-ch="all">${esc(T.miscFilterAll)} ${list.length}</button>` +
      chapters
        .map((c) => {
          const n = list.filter((g) => (g.chapter || T.glossDefaultChapter) === c).length;
          return `<button type="button" class="gloss-filter-chip ${activeCh === c ? "active" : ""}" data-ch="${esc(c)}">${esc(c)} ${n}</button>`;
        })
        .join("");
    filterEl.querySelectorAll(".gloss-filter-chip").forEach((c) => {
      c.onclick = () => {
        activeCh = c.dataset.ch;
        renderFilter();
        renderCloud();
      };
    });
  }

  function renderDetail(term) {
    if (!detailEl) return;
    const g = list.find((x) => x.term === term);
    if (!g) {
      detailEl.classList.add("hidden");
      return;
    }
    const search = (g.bookSearchTerms || [])
      .slice(0, 4)
      .map(
        (t) =>
          `<button type="button" class="misc-tag book-search-trigger" data-query="${esc(t)}">${esc(t)}</button>`
      )
      .join("");
    const graphBtn = g.nodeId
      ? `<button type="button" class="misc-graph tree-jump" data-node="${g.nodeId}">${esc(T.glossJumpGraph)}</button>`
      : "";
    detailEl.innerHTML = `
      <div class="gloss-detail-head">
        <span class="gloss-detail-term">${esc(g.term)}</span>
        <span class="gloss-detail-ch">${esc(g.chapter || T.glossDefaultChapter)}</span>
        <button type="button" class="gloss-detail-close" aria-label="${esc(T.glossClose)}">×</button>
      </div>
      <p class="gloss-detail-def">${fmt(g.definition || "")}</p>
      <div class="gloss-detail-actions">${search}${graphBtn}</div>
    `;
    detailEl.classList.remove("hidden");
    detailEl.querySelector(".gloss-detail-close").onclick = () => {
      activeTerm = null;
      detailEl.classList.add("hidden");
      renderCloud();
    };
    detailEl.querySelectorAll(".tree-jump").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        jumpToNode(b.dataset.node);
      };
    });
    bindBookSearchTriggers(detailEl);
  }

  function renderCloud() {
    const q = ((inp && inp.value) || "").toLowerCase().trim();
    let filtered = list;
    if (activeCh !== "all") filtered = filtered.filter((g) => (g.chapter || T.glossDefaultChapter) === activeCh);
    if (q)
      filtered = filtered.filter((g) =>
        (g.term + g.definition + (g.chapter || "")).toLowerCase().includes(q)
      );
    if (!filtered.length) {
      el.innerHTML = `<div class="gloss-empty">${esc(T.glossEmpty)}</div>`;
      return;
    }
    el.innerHTML = filtered
      .map((g) => {
        const ch = chapterKey(g.chapter);
        const active = activeTerm === g.term ? "active" : "";
        return `<button type="button" class="gloss-chip ${active}" data-ch="${esc(ch)}" data-term="${esc(g.term)}">${esc(g.term)}<span class="gloss-chip-ch">${esc(g.chapter || "")}</span></button>`;
      })
      .join("");
    el.querySelectorAll(".gloss-chip").forEach((c) => {
      c.onclick = () => {
        activeTerm = c.dataset.term;
        renderCloud();
        renderDetail(activeTerm);
        if (detailEl) detailEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
    });
  }

  renderFilter();
  renderCloud();
  if (inp) inp.oninput = () => renderCloud();
}

function nodeClass(d) {
  if (d.type === "misconception") return "node-misconception";
  if (d.type === "your-position") return "node-your-position";
  if (d.group === "external") return "node-external";
  return "node-internal";
}

function filteredGraph() {
  const ids = new Set();
  if (filterMode === "internal") {
    DATA.nodes.forEach((n) => {
      if (n.group !== "external") ids.add(n.id);
    });
  } else if (filterMode === "external") {
    DATA.nodes.forEach((n) => {
      if (n.group === "external") ids.add(n.id);
    });
  } else if (filterMode === "controversy") {
    (DATA.controversies || []).forEach((c) =>
      (c.nodeIds || []).forEach((id) => ids.add(id))
    );
    DATA.edges.forEach((e) => {
      if (e.type === "contradicts") {
        ids.add(e.source);
        ids.add(e.target);
      }
    });
  } else {
    DATA.nodes.forEach((n) => ids.add(n.id));
  }
  return {
    nodes: DATA.nodes.filter((n) => ids.has(n.id)),
    edges: DATA.edges.filter((e) => ids.has(e.source) && ids.has(e.target)),
  };
}

function applyHighlight() {
  if (!nodeSel) return;
  const selId = selNode ? selNode.id : null;
  const edgeKey = selEdge ? ekey(selEdge) : null;

  nodeSel
    .attr("r", (d) => (d.id === selId ? 14 : 10))
    .classed("node-selected", (d) => d.id === selId)
    .classed("node-dim", (d) => selId && d.id !== selId && !isNeighbor(d.id, selId));

  if (linkVisSel) {
    linkVisSel
      .classed("link-selected", (d) => ekey(d) === edgeKey)
      .classed("link-dim", (d) => {
        if (edgeKey) return ekey(d) !== edgeKey;
        if (selId) return !isIncident(d, selId);
        return false;
      });
  }
  if (linkHitSel) {
    linkHitSel.classed("link-selected", (d) => ekey(d) === edgeKey);
  }
  if (linkLabelSel) {
    linkLabelSel.classed("link-label-selected", (d) => ekey(d) === edgeKey);
  }
}

function isNeighbor(nodeId, centerId) {
  return DATA.edges.some((e) => {
    const s = e.source;
    const t = e.target;
    return (
      (s === centerId && t === nodeId) ||
      (t === centerId && s === nodeId)
    );
  });
}

function isIncident(edge, nodeId) {
  const s = typeof edge.source === "object" ? edge.source.id : edge.source;
  const t = typeof edge.target === "object" ? edge.target.id : edge.target;
  return s === nodeId || t === nodeId;
}

function initGraph() {
  const wrap = document.getElementById("graph-wrap");
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  svg = d3.select("#graph-svg").attr("viewBox", [0, 0, w, h]);
  svg.selectAll("*").remove();
  g = svg.append("g");
  svg.call(
    d3.zoom().scaleExtent([0.2, 4]).on("zoom", (ev) => {
      g.attr("transform", ev.transform);
    })
  );
  updateGraph();
}

function updateGraph() {
  const { nodes, edges } = filteredGraph();
  const w = document.getElementById("graph-wrap").clientWidth;
  const h = document.getElementById("graph-wrap").clientHeight;
  if (simulation) simulation.stop();
  g.selectAll("*").remove();
  selNode = null;
  selEdge = null;

  linkVisSel = g
    .append("g")
    .attr("class", "links-vis")
    .selectAll("line")
    .data(edges)
    .join("line")
    .attr("class", (d) => "link" + (d.type === "contradicts" ? " link-contradicts" : ""));

  linkHitSel = g
    .append("g")
    .attr("class", "links-hit")
    .selectAll("line")
    .data(edges)
    .join("line")
    .attr("class", "link-hit")
    .on("click", (ev, d) => {
      ev.stopPropagation();
      openEdgeSidebar(d);
    });

  linkLabelSel = g
    .append("g")
    .attr("class", "link-labels")
    .selectAll("text")
    .data(edges)
    .join("text")
    .attr("class", "link-label")
    .attr("font-size", 9)
    .attr("text-anchor", "middle")
    .text((d) => d.label || EDGE_CN[d.type] || d.type)
    .style("pointer-events", "none");

  nodeSel = g
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("class", (d) => nodeClass(d))
    .attr("r", 10)
    .call(
      d3
        .drag()
        .on("start", (ev, d) => {
          if (!ev.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (ev, d) => {
          d.fx = ev.x;
          d.fy = ev.y;
        })
        .on("end", (ev, d) => {
          if (!ev.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    )
    .on("click", (ev, d) => {
      ev.stopPropagation();
      openNodeSidebar(d);
    });

  nodeLabelSel = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("class", "node-label")
    .text((d) => d.label)
    .attr("font-size", 11)
    .attr("dx", 14)
    .attr("dy", 4)
    .style("pointer-events", "none");

  simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(edges).id((d) => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-320))
    .force("center", d3.forceCenter(w / 2, h / 2))
    .on("tick", () => {
      linkVisSel
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      linkHitSel
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      linkLabelSel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);
      nodeSel.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      nodeLabelSel.attr("x", (d) => d.x).attr("y", (d) => d.y);
      applyHighlight();
    });
}

function section(title, html) {
  return html ? `<div class="sidebar-section"><h4>${title}</h4>${html}</div>` : "";
}

function openNodeSidebar(n) {
  selNode = n;
  selEdge = null;
  document.getElementById("sidebarTitle").textContent = n.label;
  let h = section(T.sbType, `<p>${esc(n.type)} ${pill(n.confidence)}</p>`);
  if (n.explain) h += section(T.sbOneLiner, `<p class="sidebar-lead">${fmt(n.explain)}</p>`);
  if (n.plainExplain) h += section(T.sbPlain, `<p>${fmt(n.plainExplain)}</p>`);
  if (n.mechanism) h += section(T.sbMechanism, `<div class="sidebar-block">${fmt(n.mechanism)}</div>`);
  if (n.boundary) h += section(T.sbBoundary, `<p class="sidebar-muted">${fmt(n.boundary)}</p>`);
  if (n.pmApplication) h += section(T.sbHowToUse, `<p><strong>${esc(T.sbPmPrefix)}</strong>${fmt(n.pmApplication)}</p>`);
  if (n.example) h += section(T.sbExample, `<p>${fmt(n.example)}</p>`);
  if (n.analogy) h += section(T.sbAnalogy, `<p>${fmt(n.analogy)}</p>`);
  if (n.deepDive) h += section(T.sbDeepRead, `<div class="deep-dive-text sidebar-deep">${fmt(n.deepDive)}</div>`);
  if (n.quotes && n.quotes.length) {
    h += section(
      T.sbQuotes,
      `<ul class="quote-list sidebar-quotes">${n.quotes
        .map(
          (q) =>
            `<li><blockquote>${fmt(q.text)}</blockquote><cite>${esc(q.ref || q.chapter || "")}</cite></li>`
        )
        .join("")}</ul>`
    );
  }
  if (n.sources && n.sources.length) {
    h += section(
      T.sbSources,
      "<ul>" +
        n.sources.map((s) => `<li>${esc(s.book || "")} ${esc(s.chapter || "")}</li>`).join("") +
        "</ul>"
    );
  }
  if (n.sectionRef) {
    const ref = String(n.sectionRef).replace(/^§/, "");
    const rid = sectionReaderId(ref) + "-sb";
    h += section(
      T.sbReadOriginal,
      `<p class="jump-row"><button type="button" class="read-section-btn" data-section="${esc(ref)}" data-reader="${esc(rid)}">${esc(T.sbExpandSection(ref))}</button></p><div id="${esc(rid)}" class="section-reader hidden"></div>`
    );
  }
  if (n.context && n.context.length) h += section(T.sbContext, `<p>${esc(n.context.join("、"))}</p>`);
  if (n.skillRef) h += section("Skill", `<p>${esc(n.skillRef)}</p>`);
  if (n.bookSearchTerms && n.bookSearchTerms.length) {
    h += section(
      T.sbBookSearch,
      `<p class="jump-row">${n.bookSearchTerms
        .map(
          (t) =>
            `<button type="button" class="book-search-trigger" data-query="${esc(t)}">${esc(t)}</button>`
        )
        .join(" ")}</p>`
    );
  }
  const edges = incidentEdges(n.id);
  if (edges.length) {
    h += section(
      T.sbRelated,
      "<ul class='edge-list'>" +
        edges
          .map((e) => {
            const s = typeof e.source === "object" ? e.source.id : e.source;
            const other = s === n.id ? (typeof e.target === "object" ? e.target.id : e.target) : s;
            const otherN = nid(other);
            return `<li><button type="button" class="sidebar-edge" data-edge="${ekey(e)}">${esc(EDGE_CN[e.type] || e.type)} → ${esc(otherN?.label || other)}</button></li>`;
          })
          .join("") +
        "</ul>"
    );
  }

  document.getElementById("sidebarBody").innerHTML = h;
  document.getElementById("sidebar").classList.add("open");
  applyHighlight();

  document.querySelectorAll(".sidebar-edge").forEach((btn) => {
    btn.onclick = () => {
      const key = btn.dataset.edge;
      const e = DATA.edges.find((x) => ekey(x) === key);
      if (e) openEdgeSidebar(e);
    };
  });
  bindBookSearchTriggers(document.getElementById("sidebarBody"));
  bindReadSectionButtons(document.getElementById("sidebarBody"));
}

function openEdgeSidebar(e) {
  selEdge = e;
  selNode = null;
  const sId = typeof e.source === "object" ? e.source.id : e.source;
  const tId = typeof e.target === "object" ? e.target.id : e.target;
  const sN = nid(sId);
  const tN = nid(tId);
  const rel = EDGE_CN[e.type] || e.type;

  document.getElementById("sidebarTitle").textContent = `${sN?.label || sId} → ${tN?.label || tId}`;

  let h = section(T.sbRelType, `<p><strong>${esc(rel)}</strong>${e.label ? ` · ${esc(e.label)}` : ""}</p>`);
  if (e.explain) h += section(T.sbMeaning, `<p>${fmt(e.explain)}</p>`);
  h += section(
    T.sbStartConcept,
    `<p>${esc(sN?.label || sId)}</p><p class="muted">${esc(sN?.explain || "").slice(0, 120)}${(sN?.explain || "").length > 120 ? "…" : ""}</p><button type="button" class="sidebar-node" data-node="${sId}">${esc(T.sbViewPrefix)}${esc(sN?.label || sId)}</button>`
  );
  h += section(
    T.sbEndConcept,
    `<p>${esc(tN?.label || tId)}</p><p class="muted">${esc(tN?.explain || "").slice(0, 120)}${(tN?.explain || "").length > 120 ? "…" : ""}</p><button type="button" class="sidebar-node" data-node="${tId}">${esc(T.sbViewPrefix)}${esc(tN?.label || tId)}</button>`
  );
  if (e.confidence) h += section(T.sbConfidence, pill(e.confidence));

  document.getElementById("sidebarBody").innerHTML = h;
  document.getElementById("sidebar").classList.add("open");
  applyHighlight();

  document.querySelectorAll(".sidebar-node").forEach((btn) => {
    btn.onclick = () => {
      const n = nid(btn.dataset.node);
      if (n) openNodeSidebar(n);
    };
  });
}

function jumpToNode(nodeId) {
  const n = nid(nodeId);
  if (!n) return;
  document.getElementById("graph").scrollIntoView({ behavior: "smooth" });
  if (!nodeSel) {
    initGraph();
    setTimeout(() => jumpToNode(nodeId), 300);
    return;
  }
  const d = nodeSel.data().find((x) => x.id === nodeId);
  if (d) openNodeSidebar(d);
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

document.getElementById("sidebarClose").onclick = closeSidebar;

document.querySelectorAll(".graph-toolbar button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".graph-toolbar button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterMode = btn.dataset.filter;
    updateGraph();
  };
});

(async () => {
  DATA = await loadData();
  if (!DATA) {
    document.getElementById("hdrTitle").textContent = "Failed to load graph data";
    return;
  }
  BOOK_INDEX = await loadBookIndex();
  PERSONA = await loadPersona();
  COMPLIANCE = await loadCompliance();
  applyCompliance();
  installCopyGuard();
  renderNav();
  renderOverview();
  renderTheory();
  renderGraphLegend();
  renderReadingPath();
  renderBookQA();
  renderExisting();
  renderSkillBridge();
  renderMisconceptions();
  renderGlossary();
  bindBookSearchTriggers(document);
  initGraph();
})();
