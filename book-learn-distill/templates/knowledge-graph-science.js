/* natural-science profile: geotime, phylogeny, taxa, bilingual reading */

let GEOTIME = null;
let PHYLOGENY = null;
let TAXA = null;
let BOOK_TRANSLATION = null;
let ASSETS_BASE = "";
let READ_LANG = "zh";
let selectedPeriodId = "devonian";

function isScienceProfile() {
  return DATA && DATA.meta && DATA.meta.bookProfile === "natural-science";
}

function getNavSections() {
  const base = [
    ["overview", "A 总览"],
    ["theory", "B 理论"],
    ["geotime", "T 地质时期"],
    ["graph", "C 图谱"],
    ["reading-path", "E 路径阅读"],
    ["book-qa", "K 书内问答"],
    ["misconceptions", "I 误区"],
    ["glossary", "J 术语"],
  ];
  if (!isScienceProfile()) {
    return SECTIONS;
  }
  return base;
}

function loadScienceExtras() {
  if (window.GEOTIME) GEOTIME = window.GEOTIME;
  if (window.PHYLOGENY) PHYLOGENY = window.PHYLOGENY;
  if (window.TAXA) TAXA = window.TAXA;
  if (window.BOOK_TRANSLATION) BOOK_TRANSLATION = window.BOOK_TRANSLATION;
  ASSETS_BASE = (DATA.meta && DATA.meta.assetsBase) || "paleontology_assets/";
  if (location.href.includes("/learn/") && ASSETS_BASE.includes("paleontology")) {
    ASSETS_BASE = "assets/";
  }
}

function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return ASSETS_BASE + path.replace(/^\//, "");
}

function chapterSummaryZh(sectionRef) {
  if (!BOOK_TRANSLATION || !BOOK_TRANSLATION.chapters) return "";
  const m = String(sectionRef || "").match(/§(\d+)/);
  if (!m) return "";
  const ch = BOOK_TRANSLATION.chapters[m[1]];
  return ch ? ch.summary || "" : "";
}

function chunkTranslation(chunk) {
  if (!BOOK_TRANSLATION || !chunk) return null;
  const byId = BOOK_TRANSLATION.chunks || {};
  return byId[chunk.id] || null;
}

function applyScienceChrome() {
  document.body.classList.add("profile-natural-science");
  const header = document.querySelector(".header");
  if (header) {
    header.style.background =
      "linear-gradient(135deg, #0f172a 0%, #14532d 45%, #1890ff 100%)";
  }
  document.querySelectorAll(".profile-business-only").forEach((el) => {
    el.style.display = "none";
  });
  const rail = document.getElementById("explorerRail");
  if (rail) rail.classList.remove("hidden");
  const main = document.getElementById("mainLayout");
  if (main) main.classList.add("science-main");
}

function taxonById(id) {
  return (TAXA && TAXA.taxa || []).find((t) => t.id === id);
}

function periodById(id) {
  return (GEOTIME && GEOTIME.periods || []).find((p) => p.id === id);
}

function renderTaxonCard(t) {
  if (!t) return "";
  const sketch = t.images && t.images.sketch ? assetUrl(t.images.sketch) : "";
  return `<article class="taxon-card">
    <div class="taxon-sketch">${sketch ? `<img src="${esc(sketch)}" alt="${esc(t.nameZh)}" loading="lazy"/>` : ""}</div>
    <div class="taxon-body">
      <h4 class="taxon-name">${esc(t.nameZh)} <span class="taxon-latin">${esc(t.nameLatin || "")}</span></h4>
      <p class="taxon-meta muted">${esc(t.group || "")} · ${esc(t.sizeZh || "")}</p>
      <p class="taxon-appearance">${esc(t.appearanceZh || "")}</p>
      <p class="taxon-hook"><strong>${esc(t.storyHook || "")}</strong></p>
      <div class="taxon-actions">
        <button type="button" class="book-search-trigger" data-query="${esc((t.bookSearchTerms || [])[0] || t.nameLatin)}">在书中检索</button>
      </div>
    </div>
  </article>`;
}

function renderPeriodStory(period) {
  if (!period) return "<p class='muted'>请选择地质时期</p>";
  const hero = period.heroImage ? assetUrl(period.heroImage) : "";
  const beats = (period.beats || []).map((b) => `<p class="period-beat">${esc(b)}</p>`).join("");
  const taxaHtml = (period.iconicTaxa || [])
    .map((id) => renderTaxonCard(taxonById(id)))
    .join("");
  const ctas = (period.linkedSections || [])
    .map(
      (r) =>
        `<button type="button" class="period-cta-read" data-section="${esc(r)}">读 ${esc(r)}</button>`
    )
    .join("");
  return `<div class="period-story">
    <div class="period-head">
      <span class="period-era">${esc(period.era || "")}</span>
      <span class="period-range">${esc(period.timeRange || "")}</span>
    </div>
    <h3 class="period-title">${esc(period.titleZh || period.nameZh)}</h3>
    ${hero ? `<div class="period-hero"><img src="${esc(hero)}" alt="" loading="lazy"/></div>` : ""}
    <div class="period-beats">${beats}</div>
    <p class="period-note muted">拓展阅读 · 与 Foote《Principles of Paleontology》章节交叉引用，非教材逐字替代。</p>
    ${taxaHtml ? `<div class="taxon-strip-head">这一纪的明星生物</div><div class="taxon-strip">${taxaHtml}</div>` : ""}
    <div class="period-ctas">${ctas}
      <button type="button" class="book-search-trigger" data-query="${esc((period.bookSearchTerms || [])[0] || period.nameEn)}">K 区追问</button>
    </div>
  </div>`;
}

function renderGeotimePanel() {
  const el = document.getElementById("geotimePanel");
  if (!el || !GEOTIME) return;
  const period = periodById(selectedPeriodId) || GEOTIME.periods[0];
  if (period) selectedPeriodId = period.id;
  el.innerHTML = renderPeriodStory(period);
  bindBookSearchTriggers(el);
  el.querySelectorAll(".period-cta-read").forEach((btn) => {
    btn.onclick = () => {
      const ref = btn.dataset.section;
      document.getElementById("reading-path").scrollIntoView({ behavior: "smooth" });
      const items = buildReadingTree();
      const idx = items.findIndex((x) => x.sectionRef === ref);
      if (idx >= 0) {
        const rp = document.getElementById("readingPath");
        const sideBtn = rp && rp.querySelector(`.rp-side-item[data-idx="${idx}"]`);
        if (sideBtn) sideBtn.click();
      }
    };
  });
}

function renderGeoTimeline() {
  const el = document.getElementById("geoTimeline");
  if (!el || !GEOTIME) return;
  el.innerHTML = (GEOTIME.periods || [])
    .map(
      (p) =>
        `<button type="button" class="geo-period-btn${p.id === selectedPeriodId ? " active" : ""}${p.status === "stub" ? " stub" : ""}" data-id="${esc(p.id)}" title="${esc(p.timeRange || "")}">${esc(p.nameZh)}</button>`
    )
    .join("");
  el.querySelectorAll(".geo-period-btn").forEach((btn) => {
    btn.onclick = () => {
      selectedPeriodId = btn.dataset.id;
      el.querySelectorAll(".geo-period-btn").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      renderGeotimePanel();
      document.getElementById("geotime").scrollIntoView({ behavior: "smooth" });
    };
  });
}

function renderPhylogenyTree() {
  const el = document.getElementById("phylogenyTree");
  if (!el || !PHYLOGENY) return;
  const svgPath = PHYLOGENY.meta && PHYLOGENY.meta.svg ? assetUrl(PHYLOGENY.meta.svg) : "";
  const img = svgPath
    ? `<img src="${esc(svgPath)}" class="phylo-svg-img" alt="生命树" />`
    : "";
  const btns = (PHYLOGENY.nodes || [])
    .map(
      (pn) =>
        `<button type="button" class="phylo-node-btn" data-phylo="${esc(pn.id)}">${esc(pn.label)}</button>`
    )
    .join("");
  el.innerHTML = `${img}<div class="phylo-btns">${btns}</div>`;
  el.querySelectorAll(".phylo-node-btn").forEach((btn) => {
    btn.onclick = () => {
      const pn = (PHYLOGENY.nodes || []).find((n) => n.id === btn.dataset.phylo);
      if (!pn) return;
      if (pn.periodIds && pn.periodIds[0]) {
        selectedPeriodId = pn.periodIds[0];
        renderGeoTimeline();
        renderGeotimePanel();
        document.getElementById("explorerTabGeo").click();
        document.getElementById("geotime").scrollIntoView({ behavior: "smooth" });
      }
      if (pn.graphNodeIds && pn.graphNodeIds[0] && typeof openNodeSidebar === "function") {
        const n = nid(pn.graphNodeIds[0]);
        if (n) {
          document.getElementById("graph").scrollIntoView({ behavior: "smooth" });
          openNodeSidebar(n);
        }
      }
    };
  });
}

function renderExplorerRail() {
  const rail = document.getElementById("explorerRail");
  if (!rail) return;
  rail.innerHTML = `
    <div class="explorer-tabs">
      <button type="button" class="explorer-tab active" id="explorerTabGeo">地质年表</button>
      <button type="button" class="explorer-tab" id="explorerTabPhylo">生命树</button>
    </div>
    <div class="explorer-pane" id="explorerPaneGeo">
      <p class="explorer-hint muted">点击纪 → 右侧 T 区看故事与明星生物</p>
      <div class="geo-timeline" id="geoTimeline"></div>
    </div>
    <div class="explorer-pane hidden" id="explorerPanePhylo">
      <div id="phylogenyTree" class="phylogeny-wrap"></div>
    </div>
  `;
  document.getElementById("explorerTabGeo").onclick = () => {
    document.getElementById("explorerTabGeo").classList.add("active");
    document.getElementById("explorerTabPhylo").classList.remove("active");
    document.getElementById("explorerPaneGeo").classList.remove("hidden");
    document.getElementById("explorerPanePhylo").classList.add("hidden");
  };
  document.getElementById("explorerTabPhylo").onclick = () => {
    document.getElementById("explorerTabPhylo").classList.add("active");
    document.getElementById("explorerTabGeo").classList.remove("active");
    document.getElementById("explorerPanePhylo").classList.remove("hidden");
    document.getElementById("explorerPaneGeo").classList.add("hidden");
    renderPhylogenyTree();
  };
  renderGeoTimeline();
  renderGeotimePanel();
}

function bindReadLangToggle(container) {
  if (!container || !isScienceProfile()) return;
  container.querySelectorAll("[data-read-lang]").forEach((btn) => {
    btn.onclick = () => {
      READ_LANG = btn.dataset.readLang;
      container.querySelectorAll("[data-read-lang]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const active = container.querySelector(".rp-side-item.active");
      if (active) active.click();
    };
  });
}

function renderChunkBlocks(text, chunk) {
  const blocks = cleanChunkText(text);
  const tr = chunk ? chunkTranslation(chunk) : null;
  const chSum = chapterSummaryZh(chunk && chunk.sectionRef);

  if (READ_LANG === "zh") {
    const zhBody = (tr && tr.summaryZh) || chSum;
    if (zhBody) {
      return `<div class="rp-zh-block"><p class="rp-zh-label">中文导读</p>${zhBody.split(/\n\n+/).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <details class="rp-en-fold"><summary>展开英文原文</summary><div class="rp-chunk-text en">${blocks
          .map((b) => (b.type === "h" ? `<h5 class="rp-chunk-h">${decorateTerms(b.text)}</h5>` : `<p>${decorateTerms(b.text)}</p>`))
          .join("")}</div></details>`;
    }
  }
  if (READ_LANG === "both" && ((tr && tr.summaryZh) || chSum)) {
    const zh = (tr && tr.summaryZh) || chSum;
    return `<div class="rp-zh-block"><p class="rp-zh-label">中文</p><p>${esc(zh.slice(0, 800))}</p></div>
      <div class="rp-chunk-text en"><p class="rp-zh-label">English</p>${blocks
        .map((b) => (b.type === "h" ? `<h5 class="rp-chunk-h">${decorateTerms(b.text)}</h5>` : `<p>${decorateTerms(b.text)}</p>`))
        .join("")}</div>`;
  }
  return blocks
    .map((b) =>
      b.type === "h"
        ? `<h5 class="rp-chunk-h">${decorateTerms(b.text)}</h5>`
        : `<p>${decorateTerms(b.text)}</p>`
    )
    .join("");
}

function scienceBookAnswerIntro(query, hits) {
  if (!BOOK_TRANSLATION || !hits.length) return "";
  const m = String(query).match(/§?(\d+)/);
  const ch = m ? m[1] : chapterNumFromHits(hits);
  if (!ch || !BOOK_TRANSLATION.chapters[ch]) return "";
  const chMeta = BOOK_TRANSLATION.chapters[ch];
  return `<p class="qa-zh-summary"><strong>中文归纳：</strong>${esc(chMeta.summary)}</p>`;
}

function chapterNumFromHits(hits) {
  for (const { chunk } of hits) {
    const cn = (chunk.chapterNum || "").split(".")[0];
    if (cn) return cn;
    const m = (chunk.sectionRef || "").match(/§(\d+)/);
    if (m) return m[1];
  }
  return "";
}

function setupScienceMode() {
  if (!isScienceProfile()) return;
  loadScienceExtras();
  applyScienceChrome();
  renderExplorerRail();
  renderGeotimePanel();
  const geosec = document.getElementById("geotime");
  if (geosec) geosec.classList.remove("hidden");
}
