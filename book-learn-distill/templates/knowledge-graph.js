const SECTIONS = [
  ["overview", "A 总览"],
  ["theory", "B 理论"],
  ["graph", "C 图谱"],
  ["reading-path", "E 路径阅读"],
  ["book-qa", "K 书内问答"],
  ["existing", "G 已有"],
  ["skill-bridge", "H 应用"],
  ["misconceptions", "I 误区"],
  ["glossary", "J 术语"],
];
const EDGE_CN = {
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

function loadBookIndexFromScript(src) {
  if (window.BOOK_INDEX) return Promise.resolve(window.BOOK_INDEX);
  if (!src) return Promise.resolve(null);
  const existing = document.querySelector(`script[data-book-index-src="${src}"]`);
  if (existing) {
    return Promise.resolve(window.BOOK_INDEX || null);
  }
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = src;
    s.dataset.bookIndexSrc = src;
    s.onload = () => resolve(window.BOOK_INDEX || null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}

async function loadBookIndex() {
  if (window.BOOK_INDEX) return window.BOOK_INDEX;
  if (window.__BOOK_INDEX_SCRIPT) {
    return loadBookIndexFromScript(window.__BOOK_INDEX_SCRIPT);
  }
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
  let h = `<details class="deep-dive"><summary>${esc(label || "展开精读 · 书摘与机制")}</summary><div class="deep-dive-body">`;
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
    h += `<p class="jump-row">书内检索：${item.bookSearchTerms
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
      '<p class="muted">未匹配到该节正文。可点「书内检索」或到 K 区搜索关键词。</p>';
    container.classList.remove("hidden");
    return;
  }
  const full = chunks.map((c) => c.text).join("\n\n");
  container.innerHTML = `<p class="muted">§${esc(sectionRef.replace(/^§/, ""))} · ${chunks.length} 段 · 约 ${full.length} 字</p><pre class="book-pre section-full">${esc(full)}</pre>`;
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
        btn.textContent = "阅读本节正文";
        return;
      }
      btn.textContent = "收起正文";
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

function renderPersonaCard(query, model) {
  if (!model) return "";
  const refsBtn = (model.sectionRefs || [])
    .map(
      (r) =>
        `<button type="button" class="persona-ref-btn book-search-trigger" data-query="${esc(r.replace(/^§/, ""))}">${esc(r)}</button>`
    )
    .join("");
  const callout = model.callout
    ? `<p class="persona-callout">「${fmt(model.callout)}」</p>`
    : "";
  const questions = (model.questions || [])
    .map((q) => `<li>${esc(q)}</li>`)
    .join("");
  return `<div class="qa-card persona-card">
    <div class="persona-head">
      <div class="persona-avatar">俞</div>
      <div class="persona-meta">
        <div class="persona-name">
          ${esc(PERSONA.persona.name)}
          <span class="persona-model-tag">${esc(model.title)}</span>
          <span class="persona-ai-tag" title="本回答由 AI 基于公开方法论模拟，不代表俞军本人立场">AI 模拟 · 非俞军本人</span>
        </div>
        <div class="persona-tagline">${esc(PERSONA.persona.tagline)}</div>
      </div>
    </div>
    <div class="persona-body">
      <p class="persona-core">${fmt(model.core)}</p>
      ${callout}
      ${questions ? `<div class="persona-qblock"><div class="persona-qhead">俞老师会先反问你</div><ol class="persona-qlist">${questions}</ol></div>` : ""}
      ${refsBtn ? `<div class="persona-refs"><span class="muted">在书内对应章节：</span>${refsBtn}</div>` : ""}
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
    // 没命中 persona 模型 → fallback：传统提取式答案卡
    const terms = tokenizeQuery(query);
    const top = hits.slice(0, 3);
    const answerText = top
      .map(({ chunk }) => extractAnswerSentences(chunk.text, terms, 280))
      .filter(Boolean)
      .slice(0, 2)
      .join(" ");
    const zhIntro =
      typeof scienceBookAnswerIntro === "function"
        ? scienceBookAnswerIntro(query, hits)
        : "";
    const hint =
      typeof isScienceProfile === "function" && isScienceProfile()
        ? "以下为书内相关原文摘录（英文）。"
        : "未命中作者核心模型，以下是相关原文摘录。";
    h += `<div class="qa-card">
      <div class="qa-card-head">
        <span class="qa-tag">摘录</span>
        <span class="qa-question">${esc(query)}</span>
      </div>
      ${zhIntro}
      <p class="qa-answer-text">${highlightTerms(answerText, terms)}</p>
      <p class="qa-source-hint">${hint}</p>
    </div>`;
  } else {
    return `<div class="qa-empty">
      <p>没找到与 <strong>「${esc(query)}」</strong> 直接相关的段落。</p>
      <p class="muted">可以试试：用户价值公式、好产品、交易成本、用户模型、PM 选拔。</p>
    </div>`;
  }

  // 2) 原文引用卡（巩固阅读）
  if (hits.length) {
    const terms = expandQueryTerms(query);
    const top = hits.slice(0, 3);
    h += `<div class="qa-refs">
      <div class="qa-refs-head">
        <span class="qa-refs-title">书中原文 · 巩固阅读</span>
        <span class="muted">${model ? "俞老师指向这几段" : "按相关度"} · 共 ${BOOK_INDEX.meta?.chunkCount || "?"} 段索引</span>
      </div>`;
    top.forEach(({ chunk, score }, i) => {
      const excerpt = chunk.text.slice(0, 480).replace(/\s+/g, " ");
      const truncated = chunk.text.length > 480;
      h += `<article class="qa-ref" data-id="${chunk.id}">
        <header class="qa-ref-head">
          <span class="qa-ref-rank">${i + 1}</span>
          <span class="qa-ref-ch">${esc(chunk.chapter || chunk.sectionRef || "")}</span>
          <span class="qa-ref-score" title="相关度">★ ${score}</span>
        </header>
        <p class="qa-ref-excerpt">${highlightTerms(excerpt + (truncated ? "…" : ""), terms)}</p>
        ${truncated ? `<button type="button" class="qa-ref-expand" data-id="${chunk.id}">展开完整段落</button><div class="qa-ref-full hidden" id="qaFull-${chunk.id}"><pre class="book-pre">${highlightTerms(chunk.text.slice(0, 8000), terms)}</pre></div>` : ""}
      </article>`;
    });
    h += `</div>`;
  } else if (model) {
    h += `<p class="muted" style="margin-top:12px">本次未在书内匹配到段落，可点上面章节按钮 (${(model.sectionRefs || []).join(", ")}) 直接阅读。</p>`;
  }

  return h;
}

function bindBookSearchTriggers(root) {
  (root || document).querySelectorAll(".book-search-trigger").forEach((btn) => {
    btn.onclick = () => {
      const q = btn.dataset.query || "";
      document.getElementById("book-qa").scrollIntoView({ behavior: "smooth" });
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
      "<p class='muted'>未加载书内索引。请打开 <code>作业输出/yujun-product-methodology_知识图谱.html</code>（预览已内联），或在本目录用本地服务打开并确保有 book-index.json。</p>";
    return;
  }
  if (!q) {
    answerEl.innerHTML = "<p class='muted'>输入问题或关键词后检索。</p>";
    listEl.innerHTML = "";
    return;
  }
  const hits = searchBookChunks(q, 12);
  answerEl.innerHTML = renderBookAnswer(q, hits);
  bindBookSearchTriggers(answerEl);
  const terms = expandQueryTerms(q);
  const more = hits.slice(3);
  listEl.innerHTML = more.length
    ? `<details class="qa-more"><summary>另有 ${more.length} 段匹配（展开）</summary>${more
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
      btn.textContent = full.classList.contains("hidden") ? "展开完整段落" : "收起";
    };
  });
}

function renderBookQA() {
  const panel = document.getElementById("bookQaPanel");
  if (!panel) return;
  const count = BOOK_INDEX && BOOK_INDEX.meta ? BOOK_INDEX.meta.chunkCount : 0;
  const loaded = BOOK_INDEX && BOOK_INDEX.chunks && BOOK_INDEX.chunks.length > 0;
  const hasPersona = !!(PERSONA && PERSONA.models && PERSONA.models.length);
  const hint = hasPersona
    ? `用自然语言问俞老师 · 命中核心模型则用俞老师视角回答 + 推荐章节巩固。`
    : "输入关键词在全书检索。";
  const samples = hasPersona
    ? [
        "什么是好产品？",
        "用户价值怎么算？",
        "怎么降低交易成本？",
        "PM 该怎么选？",
        "数据涨了就是产品做对了吗？",
      ]
    : (DATA.theory && DATA.theory.bookQaSamples) ||
      (typeof isScienceProfile === "function" && isScienceProfile()
        ? [
            "fossil record completeness",
            "mass extinction",
            "evolutionary stasis",
            "taphonomy",
            "Cambrian explosion",
          ]
        : ["用户价值公式", "交易模型", "交易成本", "组织效率"]);
  panel.innerHTML = `
    <div class="qa-form">
      <input type="search" id="bookQaInput" placeholder="${hasPersona ? "问俞老师：什么是好产品？为什么数据好不等于价值好？" : "问个问题或输入关键词"}" />
      <button type="button" id="bookQaBtn">${hasPersona ? "问俞老师" : "询问"}</button>
    </div>
    <p class="qa-meta muted">${esc(hint)}${loaded ? ` 已索引 <strong>${count}</strong> 段书内原文${hasPersona ? `，俞老师 ${PERSONA.models.length} 个核心模型` : ""}。` : " <strong style='color:#ff4d4f'>索引未加载</strong>。"}</p>
    <div class="qa-suggest"><span class="muted">试试：</span>${samples
      .map(
        (s) =>
          `<button type="button" class="qa-suggest-chip book-search-trigger" data-query="${esc(s)}">${esc(s)}</button>`
      )
      .join("")}</div>
    <div id="bookQaAnswer" class="qa-answer-area"><p class="qa-hint muted">用自然语言问个问题，回车或点按钮。</p></div>
    <div id="bookQaList" class="qa-list"></div>
  `;
  const input = document.getElementById("bookQaInput");
  const btn = document.getElementById("bookQaBtn");
  btn.addEventListener("click", () => runBookSearch(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runBookSearch(input.value);
  });
  bindBookSearchTriggers(panel);
}

function esc(s) {
  return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;") : "";
}

/** Escape HTML then render **bold** */
function fmt(s) {
  return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

const PILL_CN = { high: "高", medium: "中", low: "低", prior: "待证" };
const PILL_TITLE = {
  high: "置信度高：有章节/证据支撑",
  medium: "置信度中：体系常识或部分 ingest",
  low: "置信度低：待辅书 PDF 或人工确认",
  prior: "待证据",
};

function pill(c) {
  const key = c || "medium";
  const label = PILL_CN[key] || key;
  const title = PILL_TITLE[key] || "";
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
  const sections =
    typeof getNavSections === "function" ? getNavSections() : SECTIONS;
  document.getElementById("navLinks").innerHTML = sections
    .map(([id, l]) => `<a href="#${id}">${l}</a>`)
    .join("");
}

function renderOverview() {
  const m = DATA.meta;
  const t = DATA.theory;
  document.title = m.title + " · 知识图谱";
  document.getElementById("hdrTitle").textContent = m.title;
  document.getElementById("hdrDef").textContent = t.oneLiner || t.definition || "";
  document.getElementById("overviewNot").innerHTML = t.notThis
    ? `<strong>不是什么：</strong>${esc(t.notThis)}`
    : "";
  const books = (m.books || [])
    .map((b) => (b.title || b) + (b.author ? `（${b.author}）` : ""))
    .join(" · ");
  document.getElementById("overviewMeta").innerHTML = [
    m.updated && `更新：${m.updated}`,
    m.learningDepth && `深度：${m.learningDepth}`,
    books && `书目：${books}`,
    (m.contexts || []).length && `场景：${m.contexts.join("、")}`,
  ]
    .filter(Boolean)
    .join("<br>");
}

function renderMarketComparison(mc) {
  if (!mc) return "";
  let h = `<div class="theory-block"><h3 class="theory-block-title">B5 · ${esc(mc.title || "中国对齐 / 勿误用")}</h3>`;
  h += `<p class="jump-row"><button type="button" class="tree-jump" data-node="cn-market">→ 中国市场落地</button>`;
  h += `<button type="button" class="tree-jump" data-node="mis-na-copy">→ 勿照搬误区</button></p>`;
  if (mc.intro) h += `<p class="theory-intro">${fmt(mc.intro)}</p>`;

  if (mc.rows && mc.rows.length) {
    h += `<table class="comparison-table"><thead><tr><th>维度</th><th>北美本课</th><th>中国落地注意</th></tr></thead><tbody>`;
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
      h += `<div class="portable-col"><h4>可迁移</h4><ul class="theory-list">${mc.portable.map((s) => `<li>${fmt(s)}</li>`).join("")}</ul></div>`;
    }
    if (mc.notPortable && mc.notPortable.length) {
      h += `<div class="not-portable-col"><h4>勿误用</h4><ul class="theory-list">${mc.notPortable.map((s) => `<li>${fmt(s)}</li>`).join("")}</ul></div>`;
    }
    h += `</div>`;
  }

  if (mc.otaCallout) {
    h += `<div class="ota-callout"><strong>机酒火</strong> ${fmt(mc.otaCallout)}</div>`;
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
    extras += ` <button type="button" class="fw-chip-go tree-jump" data-node="${item.nodeId}">→图谱</button>`;
  }
  if (item.search) {
    extras += ` <button type="button" class="fw-chip-go book-search-trigger" data-query="${esc(item.search)}">书内</button>`;
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
    ? `<button type="button" class="tp-link tree-jump" data-node="${esc(g.nodeId)}">→ 概念图谱</button>`
    : "";
  const search = (g.bookSearchTerms && g.bookSearchTerms[0]) || g.term;
  pop.innerHTML = `
    <div class="tp-head">
      <span class="tp-term">${esc(g.term)}</span>
      ${chapter}
      <button type="button" class="tp-close" aria-label="关闭">✕</button>
    </div>
    <p class="tp-def">${fmt(g.definition || "（未填写定义）")}</p>
    <div class="tp-actions">
      ${node}
      <button type="button" class="tp-link book-search-trigger" data-query="${esc(search)}">→ 书内检索</button>
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

  h += `<div class="theory-block"><h3 class="theory-block-title">B0 · 一句话</h3>`;
  if (t.oneLiner) h += `<p class="one-liner">${esc(t.oneLiner)}</p>`;
  if (t.definition && t.definition !== t.oneLiner)
    h += `<p class="muted">白话：${esc(t.definition)}</p>`;
  if (t.notThis) h += `<p class="not-this"><strong>不是什么：</strong>${esc(t.notThis)}</p>`;
  h += `</div>`;

  if (t.frameworkTree && t.frameworkTree.length) {
    h += `<div class="theory-block"><h3 class="theory-block-title">B1 · 全书理论框架（按章展开）</h3>`;
    h += `<p class="muted">与书本目录一致：点击章/节逐层展开；每节可书内检索、跳转概念图谱。</p>`;
    h += renderFrameworkTree(t.frameworkTree);
    h += `</div>`;
  }

  if (t.introForBeginners) {
    h += `<div class="theory-block"><h3 class="theory-block-title">B3 · 入门导引</h3><div class="theory-intro">${esc(t.introForBeginners)}</div></div>`;
  }

  if (t.pillars && t.pillars.length) {
    h += `<div class="theory-block"><h3 class="theory-block-title">B3b · 核心概念精读</h3>`;
    t.pillars.forEach((p) => {
      h += `<div class="theory-pillar"><h4>${esc(p.name || "")}</h4>`;
      if (p.definition) h += `<p><strong>定义</strong> ${fmt(p.definition)}</p>`;
      if (p.mechanism) h += `<p class="muted"><strong>机制</strong> ${fmt(p.mechanism)}</p>`;
      if (p.boundary) h += `<p class="muted"><strong>边界</strong> ${fmt(p.boundary)}</p>`;
      h += `<div class="field-grid">`;
      if (p.plainExplain)
        h += `<div class="field-plain"><strong>白话</strong><p>${fmt(p.plainExplain)}</p></div>`;
      if (p.example)
        h += `<div class="field-example"><strong>例子</strong><p>${fmt(p.example)}</p></div>`;
      if (p.analogy)
        h += `<div class="field-analogy"><strong>类比</strong><p>${fmt(p.analogy)}</p></div>`;
      h += `</div>${renderDeepDiveBlock(p)}</div>`;
    });
    h += `</div>`;
  }

  h += `<div class="theory-block theory-block-b4"><h3 class="theory-block-title">B4 · 快速学习</h3>`;

  if (t.decisionGuide && t.decisionGuide.length) {
    h += `<h4>决策指南</h4><table class="decision-guide"><thead><tr><th>判断</th><th>做法</th><th>图谱</th></tr></thead><tbody>`;
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
    h += `<h4>经典模型</h4><table class="models-table"><thead><tr><th>模型</th><th>一句话</th><th>学到什么</th></tr></thead><tbody>`;
    t.classicModels.forEach((m) => {
      h += `<tr><td>${esc(m.name)}</td><td>${esc(m.oneLine)}</td><td>${esc(m.lesson)}</td></tr>`;
    });
    h += `</tbody></table>`;
  }

  if (t.coreClaims && t.coreClaims.length) {
    h += `<h4>核心观点（可执行）</h4><ol class="theory-list">${t.coreClaims.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>`;
  }

  if (t.learningTracks && t.learningTracks.length) {
    h += `<h4>学习轨道</h4><div class="learning-tracks">`;
    t.learningTracks.forEach((tr) => {
      h += `<div class="learning-track"><h5>${esc(tr.title)}</h5><ol class="theory-list">${(tr.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>`;
    });
    h += `</div>`;
  }

  if (t.workedExample) {
    const ex = t.workedExample;
    h += `<div class="worked-example"><h4>迷你例题：${esc(ex.title)}</h4>`;
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
    if (ex.takeaway) h += `<p class="takeaway"><strong>结论：</strong>${esc(ex.takeaway)}</p>`;
    h += `</div>`;
  }

  if (t.quickStartSteps && t.quickStartSteps.length) {
    h += `<h4>默认路径</h4><ol class="theory-list">${t.quickStartSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
  }

  h += `</div>`;

  if (t.marketComparison) {
    h += renderMarketComparison(t.marketComparison);
  }

  document.getElementById("theoryBody").innerHTML = h || "<p class='muted'>待填</p>";
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
    `<span class="legend-title">连线类型：</span>` +
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
    el.innerHTML = "<p class='muted'>待填</p>";
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
  const langBar =
    typeof isScienceProfile === "function" && isScienceProfile()
      ? `<div class="rp-lang-bar graph-toolbar">
          <button type="button" data-read-lang="zh" class="active">中文</button>
          <button type="button" data-read-lang="en">英文</button>
          <button type="button" data-read-lang="both">对照</button>
        </div>`
      : "";
  el.innerHTML = `
    <div class="rp-twocol">
      <aside class="rp-side">${sideHtml}</aside>
      <main class="rp-main">
        ${langBar}
        <div class="rp-main-head">
          <span class="rp-main-ref" id="rpMainRef"></span>
          <span class="rp-main-title" id="rpMainTitle"></span>
          <span class="rp-main-meta" id="rpMainMeta"></span>
        </div>
        <div class="rp-main-body" id="rpMainBody"></div>
      </main>
    </div>
  `;
  if (langBar) bindReadLangToggle(el);

  function showItem(idx) {
    const item = items[idx];
    const chunks = chunksForSection(item.sectionRef);
    document.getElementById("rpMainRef").textContent = item.sectionRef;
    document.getElementById("rpMainTitle").textContent = stripRefPrefix(item.label, item.sectionRef);
    const meta = document.getElementById("rpMainMeta");
    const body = document.getElementById("rpMainBody");
    if (!chunks.length) {
      meta.textContent = "未匹配到正文";
      body.innerHTML = `<p class="muted">无 book-index 数据。可在 K 区检索：<button type="button" class="book-search-trigger" data-query="${esc(item.label)}">${esc(item.label)}</button></p>`;
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
    const chIntro =
      typeof chapterSummaryZh === "function" ? chapterSummaryZh(item.sectionRef) : "";
    meta.textContent = `${chunks.length} 段 · 约 ${totalLen.toLocaleString()} 字`;
    const introBlock = chIntro
      ? `<div class="rp-chapter-intro"><strong>本章导读</strong><p>${esc(chIntro)}</p></div>`
      : "";
    body.innerHTML =
      introBlock +
      groups
        .map((g) => {
          const joined = g.parts.join("\n");
          const firstChunk = chunks.find(
            (c) => (c.sectionRef || c.chapter || "") === g.ref
          );
          const head =
            item.level === 0 && g.ref && g.ref !== item.sectionRef
              ? `<h4 class="rp-chunk-ch">${esc(g.ref)} ${esc(g.label || "")}</h4>`
              : "";
          const text =
            typeof renderChunkBlocks === "function"
              ? renderChunkBlocks(joined, firstChunk)
              : cleanChunkText(joined)
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
    : "<p class='muted'>Merge 后填入</p>";
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
    el.innerHTML = "<p class='muted'>待填</p>";
    return;
  }
  const chapters = Array.from(new Set(l.map((m) => m.chapter || "全书"))).sort();
  let state = "all";
  if (tbar) {
    tbar.innerHTML =
      `<button type="button" class="misc-filter-chip active" data-ch="all">全部 ${l.length}</button>` +
      chapters
        .map(
          (c) =>
            `<button type="button" class="misc-filter-chip" data-ch="${esc(c)}">${esc(c)} <span class="muted">${l.filter((m) => (m.chapter || "全书") === c).length}</span></button>`
        )
        .join("");
  }
  function draw() {
    const items = state === "all" ? l : l.filter((m) => (m.chapter || "全书") === state);
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
          ? `<button type="button" class="misc-graph tree-jump" data-node="${m.nodeId}" title="跳转概念图谱">● 图谱</button>`
          : "";
        return `<article class="misc-card">
  <div class="misc-card-head">
    <span class="misc-card-ch">${esc(m.chapter || "全书")}</span>
    <span class="misc-card-title">${esc(m.title)}</span>
  </div>
  <div class="misc-cols">
    <div class="misc-col misc-col-wrong">
      <div class="misc-col-label">✕ 常见想法</div>
      <p>${fmt(m.description || "—")}</p>
    </div>
    <div class="misc-col misc-col-right">
      <div class="misc-col-label">✓ 书内更正</div>
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
  const chapters = Array.from(new Set(list.map((g) => g.chapter || "其他"))).sort();
  let activeCh = "all";
  let activeTerm = null;

  function renderFilter() {
    if (!filterEl) return;
    filterEl.innerHTML =
      `<button type="button" class="gloss-filter-chip ${activeCh === "all" ? "active" : ""}" data-ch="all">全部 ${list.length}</button>` +
      chapters
        .map((c) => {
          const n = list.filter((g) => (g.chapter || "其他") === c).length;
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
      ? `<button type="button" class="misc-graph tree-jump" data-node="${g.nodeId}">● 概念图谱</button>`
      : "";
    detailEl.innerHTML = `
      <div class="gloss-detail-head">
        <span class="gloss-detail-term">${esc(g.term)}</span>
        <span class="gloss-detail-ch">${esc(g.chapter || "其他")}</span>
        <button type="button" class="gloss-detail-close" aria-label="关闭">×</button>
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
    if (activeCh !== "all") filtered = filtered.filter((g) => (g.chapter || "其他") === activeCh);
    if (q)
      filtered = filtered.filter((g) =>
        (g.term + g.definition + (g.chapter || "")).toLowerCase().includes(q)
      );
    if (!filtered.length) {
      el.innerHTML = '<div class="gloss-empty">无匹配术语</div>';
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
  let h = section("类型", `<p>${esc(n.type)} ${pill(n.confidence)}</p>`);
  if (n.explain) h += section("一句话", `<p class="sidebar-lead">${fmt(n.explain)}</p>`);
  if (n.plainExplain) h += section("白话", `<p>${fmt(n.plainExplain)}</p>`);
  if (n.mechanism) h += section("机制", `<div class="sidebar-block">${fmt(n.mechanism)}</div>`);
  if (n.boundary) h += section("边界", `<p class="sidebar-muted">${fmt(n.boundary)}</p>`);
  if (n.pmApplication) h += section("怎么用", `<p><strong>PM：</strong>${fmt(n.pmApplication)}</p>`);
  if (n.example) h += section("例子", `<p>${fmt(n.example)}</p>`);
  if (n.analogy) h += section("类比", `<p>${fmt(n.analogy)}</p>`);
  if (n.deepDive) h += section("精读", `<div class="deep-dive-text sidebar-deep">${fmt(n.deepDive)}</div>`);
  if (n.quotes && n.quotes.length) {
    h += section(
      "书摘",
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
      "来源",
      "<ul>" +
        n.sources.map((s) => `<li>${esc(s.book || "")} ${esc(s.chapter || "")}</li>`).join("") +
        "</ul>"
    );
  }
  if (n.sectionRef) {
    const ref = String(n.sectionRef).replace(/^§/, "");
    const rid = sectionReaderId(ref) + "-sb";
    h += section(
      "阅读原文",
      `<p class="jump-row"><button type="button" class="read-section-btn" data-section="${esc(ref)}" data-reader="${esc(rid)}">展开 §${esc(ref)} 正文</button></p><div id="${esc(rid)}" class="section-reader hidden"></div>`
    );
  }
  if (n.context && n.context.length) h += section("场景", `<p>${esc(n.context.join("、"))}</p>`);
  if (n.skillRef) h += section("Skill", `<p>${esc(n.skillRef)}</p>`);
  if (n.bookSearchTerms && n.bookSearchTerms.length) {
    h += section(
      "书内检索",
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
      "相关关系",
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

  let h = section("关系类型", `<p><strong>${esc(rel)}</strong>${e.label ? ` · ${esc(e.label)}` : ""}</p>`);
  if (e.explain) h += section("含义", `<p>${fmt(e.explain)}</p>`);
  h += section(
    "起点概念",
    `<p>${esc(sN?.label || sId)}</p><p class="muted">${esc(sN?.explain || "").slice(0, 120)}${(sN?.explain || "").length > 120 ? "…" : ""}</p><button type="button" class="sidebar-node" data-node="${sId}">查看 ${esc(sN?.label || sId)}</button>`
  );
  h += section(
    "终点概念",
    `<p>${esc(tN?.label || tId)}</p><p class="muted">${esc(tN?.explain || "").slice(0, 120)}${(tN?.explain || "").length > 120 ? "…" : ""}</p><button type="button" class="sidebar-node" data-node="${tId}">查看 ${esc(tN?.label || tId)}</button>`
  );
  if (e.confidence) h += section("置信度", pill(e.confidence));

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

function setBootMessage(msg) {
  const el = document.getElementById("bootMessage");
  if (el) el.textContent = msg;
}

function showBootError(msg) {
  const err = document.getElementById("bootError");
  if (err) {
    err.textContent = msg;
    err.classList.remove("hidden");
  }
  const ov = document.getElementById("bootOverlay");
  if (ov) ov.classList.remove("hidden");
}

function hideBootOverlay() {
  const ov = document.getElementById("bootOverlay");
  if (ov) ov.classList.add("hidden");
}

(async () => {
  try {
    setBootMessage("正在加载图谱数据…");
    DATA = await loadData();
    if (!DATA) {
      showBootError("未加载 GRAPH_DATA。请用 build-preview-html.sh 重新生成，或确认 06-graph-data.json 可访问。");
      document.getElementById("hdrTitle").textContent = "未加载图谱数据";
      return;
    }
    PERSONA = await loadPersona();
    COMPLIANCE = await loadCompliance();
    applyCompliance();
    installCopyGuard();
    if (typeof setupScienceMode === "function") setupScienceMode();
    renderNav();
    renderOverview();
    renderTheory();
    renderGraphLegend();
    renderReadingPath();
    renderBookQA();
    if (!isScienceProfile || !isScienceProfile()) {
      renderExisting();
      renderSkillBridge();
    }
    renderMisconceptions();
    renderGlossary();
    bindBookSearchTriggers(document);
    initGraph();
    hideBootOverlay();

    setBootMessage("正在后台加载书内索引（约 3MB，E/K 区稍后可用）…");
    loadBookIndex().then((idx) => {
      BOOK_INDEX = idx;
      if (!BOOK_INDEX || !BOOK_INDEX.chunks || !BOOK_INDEX.chunks.length) {
        const qa = document.getElementById("bookQaPanel");
        if (qa) {
          qa.insertAdjacentHTML(
            "afterbegin",
            "<p class='qa-hint' style='color:#ff4d4f'>书内索引未加载：请确认 <code>" +
              esc(window.__BOOK_INDEX_SCRIPT || "book-index.js") +
              "</code> 与本 HTML 在同一文件夹。</p>"
          );
        }
        return;
      }
      renderReadingPath();
      renderBookQA();
      bindBookSearchTriggers(document);
      hideBootOverlay();
    });
  } catch (e) {
    console.error(e);
    showBootError("页面初始化失败：" + (e && e.message ? e.message : String(e)));
  }
})();
