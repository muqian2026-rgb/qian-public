/* public web curriculum: 8 chapters + rich media course pages */

let CURRICULUM = null;
let APP_MODE = "course";
let courseDepth = "standard";
let courseView = "home";
let courseChapterId = null;
let coursePageId = null;
let lightboxUrl = null;

function loadCourseExtras() {
  if (window.CURRICULUM) CURRICULUM = window.CURRICULUM;
}

function hasCurriculum() {
  return !!(CURRICULUM && CURRICULUM.chapters && CURRICULUM.chapters.length);
}

function chapterById(id) {
  return (CURRICULUM.chapters || []).find((c) => c.id === id);
}

function pageById(id) {
  return CURRICULUM.pages && CURRICULUM.pages[id];
}

const DEPTH_LABELS = {
  skim: "速览 L0",
  standard: "标准 L1",
  scholar: "学者 L2",
};

function setupCourseMode() {
  if (!isScienceProfile() || !hasCurriculum()) return;
  loadCourseExtras();
  const bar = document.getElementById("courseModeBar");
  if (bar) bar.classList.remove("hidden");
  renderCourseModeBar();
  setAppMode("course", { skipCourseView: true });
  renderCourseView();
}

// 必须用函数表达式保存原实现：function 声明会提升，导致 const _x = fn 捕获到包装函数自身 → 栈溢出
const _scienceSetupScienceMode = setupScienceMode;
setupScienceMode = function scienceModeWithCourse() {
  _scienceSetupScienceMode();
  setupCourseMode();
};

const _scienceGetNavSections = getNavSections;
getNavSections = function getNavSectionsWithCourse() {
  if (APP_MODE === "course" && hasCurriculum()) {
    return [["course", "网络课程"]];
  }
  return _scienceGetNavSections();
};

function setAppMode(mode, opts = {}) {
  APP_MODE = mode;
  document.body.classList.toggle("app-mode-course", mode === "course");
  document.body.classList.toggle("app-mode-book", mode === "book");
  document.querySelectorAll(".book-panel").forEach((el) => {
    el.classList.toggle("hidden", mode === "course");
  });
  const courseSec = document.getElementById("course");
  if (courseSec) courseSec.classList.toggle("hidden", mode === "book");
  const rail = document.getElementById("explorerRail");
  if (rail) rail.classList.toggle("hidden", mode === "course");
  document.querySelectorAll(".course-mode-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
  renderNav();
  if (mode === "course" && !opts.skipCourseView) {
    const c = document.getElementById("course");
    if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
    renderCourseView();
  }
}

function renderCourseModeBar() {
  const el = document.getElementById("courseModeBar");
  if (!el || !hasCurriculum()) return;
  const meta = CURRICULUM.meta || {};
  el.innerHTML = `<div class="course-mode-inner">
    <span class="course-mode-title">${esc(meta.title || "网络课程")}</span>
    <div class="course-mode-btns">
      <button type="button" class="course-mode-btn" data-mode="course">网络课程 · 8 章</button>
      <button type="button" class="course-mode-btn" data-mode="book">教材精读 · Foote</button>
    </div>
    <div class="course-depth-btns" id="courseDepthBtns"></div>
  </div>`;
  el.querySelectorAll(".course-mode-btn").forEach((btn) => {
    btn.onclick = () => setAppMode(btn.dataset.mode);
  });
  renderDepthToggle();
}

function renderDepthToggle() {
  const wrap = document.getElementById("courseDepthBtns");
  if (!wrap) return;
  wrap.innerHTML = Object.keys(DEPTH_LABELS)
    .map(
      (d) =>
        `<button type="button" class="depth-btn${courseDepth === d ? " active" : ""}" data-depth="${d}">${esc(
          DEPTH_LABELS[d]
        )}</button>`
    )
    .join("");
  wrap.querySelectorAll(".depth-btn").forEach((btn) => {
    btn.onclick = () => {
      courseDepth = btn.dataset.depth;
      renderDepthToggle();
      renderCourseView();
    };
  });
}

function setCourseView(view, opts = {}) {
  courseView = view;
  courseChapterId = opts.chapterId || null;
  coursePageId = opts.pageId || null;
  renderCourseView();
  const root = document.getElementById("course");
  if (root) root.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCourseView() {
  const root = document.getElementById("courseRoot");
  if (!root || !hasCurriculum()) return;
  if (courseView === "page" && coursePageId) {
    root.innerHTML = renderCoursePage(coursePageId);
  } else if (courseView === "chapter" && courseChapterId) {
    root.innerHTML = renderCourseChapter(courseChapterId);
  } else {
    root.innerHTML = renderCourseHome();
  }
  bindCourseActions(root);
  bindLightbox(root);
}

function renderCourseHome() {
  const meta = CURRICULUM.meta || {};
  const tpl = pageById(meta.templatePageId);
  const cards = (CURRICULUM.chapters || [])
    .map((ch) => {
      const hero = (ch.media || []).find((m) => m.role === "hero");
      const thumb = hero ? hero.url : "";
      return `<article class="course-ch-card" data-ch="${esc(ch.id)}">
        <div class="course-ch-thumb">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer"/>` : `<span class="ch-num">${ch.num}</span>`}</div>
        <div class="course-ch-body">
          <span class="course-ch-duration muted">${esc(ch.duration || "")}</span>
          <h3 class="course-ch-title">${esc(ch.titleZh)}</h3>
          <p class="course-ch-en muted">${esc(ch.titleEn || "")}</p>
          <ul class="course-ch-skim">${(ch.skim || [])
            .slice(0, courseDepth === "skim" ? 3 : 2)
            .map((s) => `<li>${esc(s)}</li>`)
            .join("")}</ul>
        </div>
      </article>`;
    })
    .join("");
  const featured =
    tpl &&
    `<div class="course-featured">
      <p class="course-featured-label">样板课 · 富媒体深挖</p>
      <button type="button" class="course-featured-btn" data-action="page" data-page-id="${esc(tpl.id)}">
        <strong>${esc(tpl.titleZh)}</strong>
        <span class="muted">${esc(tpl.subtitle || "")}</span>
      </button>
    </div>`;
  return `<div class="course-home">
    <header class="course-hero">
      <h2>${esc(meta.title || "古生物学网络课程")}</h2>
      <p class="muted">${esc(meta.subtitle || "")}</p>
      <p class="course-credits muted">${esc(CURRICULUM.mediaCredits || "")}</p>
    </header>
    ${featured || ""}
    <div class="course-ch-grid">${cards}</div>
  </div>`;
}

function renderCourseChapter(chId) {
  const ch = chapterById(chId);
  if (!ch) return "<p>章节未找到</p>";
  const story = depthBlocks(ch.story, ch.skim);
  const concepts =
    courseDepth !== "skim" && ch.concepts && ch.concepts.length
      ? `<div class="course-concepts">${ch.concepts
          .map(
            (c) =>
              `<div class="course-concept"><strong>${esc(c.label)}</strong><span>${esc(c.oneLine)}</span></div>`
          )
          .join("")}</div>`
      : "";
  const mediaHtml = renderMediaBlock(ch.media || []);
  const links = (ch.links || [])
    .map((l) => courseLinkButton(l))
    .join("");
  const cases =
    ch.cases &&
    ch.cases
      .map((c) => {
        const cls = c.featured ? " course-case featured" : " course-case";
        if (c.pageId) {
          return `<button type="button" class="${cls.trim()}" data-action="page" data-page-id="${esc(
            c.pageId
          )}">${esc(c.title)}${c.featured ? " ★" : ""}</button>`;
        }
        return `<button type="button" class="${cls.trim()}" data-action="period" data-period-id="${esc(
          c.periodId || ""
        )}">${esc(c.title)}</button>`;
      })
      .join("");
  const timelineJump = (ch.timelineIds || [])
    .map(
      (id) =>
        `<button type="button" class="course-jump-btn" data-action="period" data-period-id="${esc(id)}">${esc(
          (periodById(id) || {}).titleZh || id
        )}</button>`
    )
    .join("");
  return `<div class="course-chapter">
    <button type="button" class="course-back" data-action="home">← 课程首页</button>
    <header class="course-ch-head">
      <span class="course-ch-badge">第 ${ch.num} 章</span>
      <h2>${esc(ch.titleZh)}</h2>
      <p class="muted">${esc(ch.titleEn || "")} · ${esc(ch.duration || "")}</p>
    </header>
    <div class="course-story">${story}</div>
    ${mediaHtml}
    ${concepts}
    ${cases ? `<div class="course-cases"><p class="course-subhead">案例</p>${cases}</div>` : ""}
    ${timelineJump ? `<div class="course-jumps"><p class="course-subhead">跳入时间轴</p>${timelineJump}</div>` : ""}
    ${links ? `<div class="course-links">${links}</div>` : ""}
    ${courseDepth === "scholar" ? renderScholarExtras(ch) : ""}
  </div>`;
}

function depthBlocks(story, skim) {
  if (courseDepth === "skim") {
    return `<ul class="course-skim-list">${(skim || [])
      .map((s) => `<li>${esc(s)}</li>`)
      .join("")}</ul>`;
  }
  const paras = (story || []).map((p) => `<p>${formatCourseMd(p)}</p>`).join("");
  if (courseDepth === "standard") return paras;
  return paras + (skim || []).map((s) => `<p class="course-skim-extra"><em>${esc(s)}</em></p>`).join("");
}

function renderScholarExtras(ch) {
  const refs = (ch.bookSections || []).map((r) => `Foote ${esc(r)}`).join(" · ");
  return `<details class="course-scholar"><summary>学者延伸</summary>
    <p>教材对照：${refs || "—"}</p>
    <p class="muted">L2：配合 K 区检索原始段落与统计方法讨论。</p>
  </details>`;
}

function renderCoursePage(pageId) {
  const page = pageById(pageId);
  if (!page) return "<p>页面未找到</p>";
  const period = page.periodId ? periodById(page.periodId) : null;
  const taxaHtml = (page.taxonIds || [])
    .map((id) => renderTaxonCard(taxonById(id)))
    .join("");
  const timeline = (page.timeline || [])
    .map(
      (t) =>
        `<div class="course-page-tl-item"><span class="tl-ma">${esc(t.ma)} Ma</span><strong>${esc(
          t.label
        )}</strong><p>${esc(t.text)}</p></div>`
    )
    .join("");
  const sections = (page.sections || [])
    .map((sec) => {
      const blocks = (sec.blocks || []).map((b) => renderPageBlock(b)).join("");
      return `<section class="course-page-sec"><h3>${esc(sec.titleZh)}</h3>${blocks}</section>`;
    })
    .join("");
  const skim = `<ul class="course-skim-list">${(page.skim || [])
    .map((s) => `<li>${esc(s)}</li>`)
    .join("")}</ul>`;
  return `<div class="course-page">
    <button type="button" class="course-back" data-action="home">← 课程首页</button>
    <header class="course-page-head">
      <p class="course-page-badge">课程样板</p>
      <h2>${esc(page.titleZh)}</h2>
      <p class="muted">${esc(page.subtitle || "")}</p>
      ${period ? `<p class="course-period-ref">${esc(period.timeRange || "")} · ${esc(period.titleZh || "")}</p>` : ""}
    </header>
    ${skim}
    ${timeline ? `<div class="course-page-timeline">${timeline}</div>` : ""}
    ${taxaHtml ? `<div class="taxon-strip">${taxaHtml}</div>` : ""}
    ${sections}
    <p class="course-credits muted">${esc(CURRICULUM.mediaCredits || "")}</p>
  </div>`;
}

function formatCourseMd(text) {
  const s = esc(text || "");
  return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderPageBlock(block) {
  if (!block) return "";
  switch (block.type) {
    case "text":
      return `<div class="course-block-text">${formatCourseMd(block.content)}</div>`;
    case "gallery":
      return renderMediaGallery(block.items || []);
    case "compare":
      return `<div class="course-compare">
        <div><span class="compare-label">${esc(block.left.label)}</span><p>${esc(block.left.text)}</p></div>
        <div><span class="compare-label">${esc(block.right.label)}</span><p>${esc(block.right.text)}</p></div>
      </div>`;
    case "anim":
      return renderAnimFrames(block);
    case "video":
      return `<div class="course-video-block"><p class="course-subhead">${esc(block.label || "视频")}</p>${(block.items || [])
        .map(
          (v) =>
            `<a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" class="course-ext-link">${esc(
              v.title
            )}</a><span class="muted">${esc(v.note || "")}</span>`
        )
        .join("")}</div>`;
    case "cta":
      return `<div class="course-cta-row">${(block.items || []).map((i) => courseLinkButton(i)).join("")}</div>`;
    default:
      return "";
  }
}

function renderAnimFrames(block) {
  const frames = (block.frames || [])
    .map((f, i) => {
      const src = f.image ? assetUrl(f.image) : f.sketch ? assetUrl(f.sketch) : "";
      return `<figure class="anim-frame${i === 0 ? " active" : ""}" data-frame="${i}">
        ${src ? `<img src="${esc(src)}" alt="" loading="lazy"/>` : ""}
        <figcaption>${esc(f.caption || "")}</figcaption>
      </figure>`;
    })
    .join("");
  return `<div class="course-anim" data-anim>
    <p class="course-subhead">${esc(block.title || "分步")}</p>
    <div class="anim-stage">${frames}</div>
    <div class="anim-controls">
      <button type="button" class="anim-prev">上一步</button>
      <button type="button" class="anim-next">下一步</button>
    </div>
  </div>`;
}

function renderMediaBlock(media) {
  const items = media.map((m) => ({
    url: m.url,
    caption: m.caption,
    credit: m.credit,
  }));
  return renderMediaGallery(items);
}

function renderMediaGallery(items) {
  if (!items || !items.length) return "";
  const cards = items
    .map(
      (m, i) =>
        `<figure class="course-media-card" data-lightbox="${esc(m.url)}">
          <img src="${esc(m.url)}" alt="${esc(m.caption || "")}" loading="lazy" referrerpolicy="no-referrer"/>
          <figcaption>${esc(m.caption || "")}<span class="media-credit">${esc(m.credit || "")}</span></figcaption>
        </figure>`
    )
    .join("");
  return `<div class="course-gallery">${cards}</div>`;
}

function courseLinkButton(link) {
  if (!link) return "";
  const attrs = [`data-action="${esc(link.action)}"`];
  if (link.pageId) attrs.push(`data-page-id="${esc(link.pageId)}"`);
  if (link.sectionRef) attrs.push(`data-section="${esc(link.sectionRef)}"`);
  if (link.query) attrs.push(`data-query="${esc(link.query)}"`);
  return `<button type="button" class="course-link-btn" ${attrs.join(" ")}>${esc(link.label)}</button>`;
}

function bindCourseActions(root) {
  root.querySelectorAll(".course-ch-card").forEach((card) => {
    card.onclick = () => setCourseView("chapter", { chapterId: card.dataset.ch });
  });
  root.querySelectorAll(".course-back[data-action='home']").forEach((btn) => {
    btn.onclick = () => setCourseView("home");
  });
  root.querySelectorAll("[data-action]").forEach((el) => {
    if (el.classList.contains("course-ch-card")) return;
    el.onclick = (e) => {
      const action = el.dataset.action;
      if (action === "page") {
        e.preventDefault();
        setCourseView("page", { pageId: el.dataset.pageId });
      } else if (action === "book") {
        setAppMode("book");
        jumpToBookSection(el.dataset.section);
      } else if (action === "search") {
        setAppMode("book");
        openBookSearch(el.dataset.query);
      } else if (action === "period") {
        setAppMode("book");
        selectedPeriodId = el.dataset.periodId;
        renderGeotimePanel();
        const geo = document.getElementById("geotime");
        if (geo) {
          geo.classList.remove("hidden");
          geo.scrollIntoView({ behavior: "smooth" });
        }
      } else if (action === "home") {
        setCourseView("home");
      }
    };
  });
  root.querySelectorAll("[data-anim]").forEach((anim) => {
    const frames = anim.querySelectorAll(".anim-frame");
    let idx = 0;
    const show = (i) => {
      idx = (i + frames.length) % frames.length;
      frames.forEach((f, j) => f.classList.toggle("active", j === idx));
    };
    anim.querySelector(".anim-prev").onclick = () => show(idx - 1);
    anim.querySelector(".anim-next").onclick = () => show(idx + 1);
  });
}

function jumpToBookSection(sectionRef) {
  const ref = String(sectionRef || "").replace("§", "");
  const rp = document.getElementById("reading-path");
  if (rp) rp.scrollIntoView({ behavior: "smooth" });
  const btn = document.querySelector(`.rp-side-item[data-chapter="${ref}"], .rp-side-item[data-section="${sectionRef}"]`);
  if (btn) btn.click();
}

function openBookSearch(query) {
  const qa = document.getElementById("book-qa");
  if (qa) qa.scrollIntoView({ behavior: "smooth" });
  const input = document.getElementById("bookQaInput");
  if (input) input.value = query;
  if (typeof runBookSearch === "function") runBookSearch(query);
}

function bindLightbox(root) {
  let overlay = document.getElementById("courseLightbox");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "courseLightbox";
    overlay.className = "course-lightbox hidden";
    overlay.innerHTML = `<div class="lightbox-backdrop"></div><figure class="lightbox-inner"><img alt=""/><figcaption></figcaption><button type="button" class="lightbox-close">×</button></figure>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".lightbox-backdrop").onclick = closeLightbox;
    overlay.querySelector(".lightbox-close").onclick = closeLightbox;
  }
  root.querySelectorAll("[data-lightbox]").forEach((fig) => {
    fig.onclick = () => {
      const url = fig.dataset.lightbox;
      const cap = fig.querySelector("figcaption");
      openLightbox(url, cap ? cap.textContent : "");
    };
  });
}

function openLightbox(url, caption) {
  const overlay = document.getElementById("courseLightbox");
  if (!overlay) return;
  const img = overlay.querySelector("img");
  const cap = overlay.querySelector("figcaption");
  img.src = url;
  cap.textContent = caption || "";
  overlay.classList.remove("hidden");
}

function closeLightbox() {
  const overlay = document.getElementById("courseLightbox");
  if (overlay) overlay.classList.add("hidden");
}
