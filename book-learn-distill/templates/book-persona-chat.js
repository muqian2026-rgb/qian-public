/* K 区：有 PERSONA 时走千问对话。Key 与问俞老师 / 问毛爷爷共用。 */
(function (global) {
  const KEYS = ["book_chat_apikey_v1", "yujun_chat_apikey_v1", "mao_chat_apikey_v1"];
  const MODEL_KEY = "book_chat_model_v1";
  const ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
  const MODELS = [
    { id: "qwen-plus", label: "qwen-plus" },
    { id: "qwen-max", label: "qwen-max" },
    { id: "qwen-turbo", label: "qwen-turbo" },
  ];

  const state = { history: [], busy: false, mounted: false };

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function who() {
    const p = (global.PERSONA && global.PERSONA.persona) || {};
    return p.name || "作者";
  }

  function avatarChar() {
    return String(who()).slice(0, 1);
  }

  function getApiKey() {
    for (let i = 0; i < KEYS.length; i++) {
      const v = localStorage.getItem(KEYS[i]);
      if (v) return v;
    }
    return "";
  }

  function setApiKey(k) {
    if (k) {
      KEYS.forEach((key) => localStorage.setItem(key, k));
    } else {
      KEYS.forEach((key) => localStorage.removeItem(key));
    }
  }

  function getModel() {
    return localStorage.getItem(MODEL_KEY) || MODELS[0].id;
  }

  function setModel(m) {
    localStorage.setItem(MODEL_KEY, m);
  }

  function buildSystemPrompt() {
    const P = global.PERSONA || {};
    const p = P.persona || {};
    const principles = (p.principles || []).map((x) => "- " + x).join("\n");
    const models = (P.models || [])
      .map(
        (m) =>
          "### " +
          m.title +
          "\n核心：" +
          m.core +
          "\n先问：" +
          (m.questions || []).join(" / ") +
          "\n金句：" +
          (m.callout || "") +
          "\n书内：" +
          (m.sectionRefs || []).join("、")
      )
      .join("\n\n");
    return (
      "你扮演「" +
      (p.name || "作者") +
      "」（" +
      (p.tagline || "") +
      "），用第一人称，严格基于下列系统思考回答。你是 AI 模拟，不代表本人。\n\n" +
      "# 立场\n" +
      (p.intro || "") +
      "\n\n# 原则\n" +
      principles +
      "\n\n# 核心模型（每轮用其中之一作主框架）\n" +
      models +
      "\n\n# 回答规则\n" +
      "1. 先结构，再怪人。信息不够就先反问 1–3 句，不要猜。\n" +
      "2. 优先使用本轮提供的原文摘录；没有摘录就用核心模型，并明说材料不够。\n" +
      "3. 不要编页码。引用只写章名（第1章 / 引言 / 附录）。\n" +
      "4. 风格：直接、克制、不寒暄、不说「非常好的问题」。短句。可用 **加粗**。\n" +
      "5. 只回答系统思考、结构、陷阱、杠杆、与系统共舞。无关问题简短拒，引回书。\n" +
      "6. 每轮末尾只输出一个 JSON 块：\n```followup\n[\"追问1\",\"追问2\",\"追问3\"]\n```"
    );
  }

  function packContext(query) {
    const search = global.searchBookChunks;
    if (typeof search !== "function" || !global.BOOK_INDEX || !global.BOOK_INDEX.chunks) {
      return { ctx: "【本轮无原文索引】可按核心模型回答，并说明没有原文摘录。", hits: [] };
    }
    const hits = search(query, 6) || [];
    if (!hits.length) {
      return { ctx: "【本轮检索】没有高分摘录。可按核心模型答，并说明材料不够。", hits: [] };
    }
    let ctx = "【本轮检索到的原文摘录。引用只能用这些章名】\n";
    hits.forEach((h, i) => {
      const c = h.chunk || {};
      ctx +=
        i +
        1 +
        ". " +
        (c.chapter || "") +
        " " +
        (c.sectionRef || "") +
        "\n" +
        String(c.text || "").slice(0, 480) +
        "\n\n";
    });
    return { ctx: ctx, hits: hits };
  }

  function fmtMarkdown(text) {
    if (!text) return "";
    let s = esc(text);
    s = s.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, "$1<em>$2</em>$3");
    s = s.replace(/`([^`\n]+?)`/g, "<code>$1</code>");
    const lines = s.split(/\n/);
    const blocks = [];
    let listBuf = null;
    let listType = null;
    function flush() {
      if (!listBuf) return;
      blocks.push((listType === "ol" ? "<ol>" : "<ul>") + listBuf + (listType === "ol" ? "</ol>" : "</ul>"));
      listBuf = null;
      listType = null;
    }
    lines.forEach((ln) => {
      const t = ln.trim();
      if (!t) {
        flush();
        return;
      }
      if (/^\d+\.\s/.test(t)) {
        if (listType !== "ol") {
          flush();
          listBuf = "";
          listType = "ol";
        }
        listBuf += "<li>" + t.replace(/^\d+\.\s/, "") + "</li>";
      } else if (/^[-•·]\s/.test(t)) {
        if (listType !== "ul") {
          flush();
          listBuf = "";
          listType = "ul";
        }
        listBuf += "<li>" + t.replace(/^[-•·]\s/, "") + "</li>";
      } else {
        flush();
        blocks.push("<p>" + t + "</p>");
      }
    });
    flush();
    return blocks.join("");
  }

  function parseFollowup(raw) {
    const m = String(raw || "").match(/```followup\s*([\s\S]*?)```/);
    if (!m) return { body: String(raw || "").trim(), follow: [] };
    const body = raw.replace(m[0], "").trim();
    let arr = [];
    try {
      arr = JSON.parse(m[1].trim());
      if (!Array.isArray(arr)) arr = [];
    } catch (e) {
      arr = [];
    }
    return { body: body, follow: arr.slice(0, 3) };
  }

  function renderHits(hits) {
    if (!hits || !hits.length) return "";
    let html = '<div class="bk-refs"><div class="bk-refs-h">原文摘录</div>';
    hits.slice(0, 3).forEach((h) => {
      const c = h.chunk || {};
      html +=
        '<article class="bk-ref"><header>' +
        esc(c.chapter || c.sectionRef || "") +
        "</header><p>" +
        esc(String(c.text || "").replace(/\s+/g, " ").slice(0, 180)) +
        "…</p></article>";
    });
    html += "</div>";
    return html;
  }

  function samples() {
    const P = global.PERSONA || {};
    return (
      P.qaSamples ||
      (global.DATA && global.DATA.theory && global.DATA.theory.bookQaSamples) ||
      ["什么是系统", "为什么越治越顽", "杠杆点在哪"]
    );
  }

  function hasKey() {
    return !!(getApiKey() || global.YU_CHAT_PROXY_URL || global.BOOK_CHAT_PROXY_URL);
  }

  function syncStatus() {
    const dot = document.getElementById("bkStatusDot");
    const txt = document.getElementById("bkStatusText");
    const btn = document.getElementById("bkKeyBtn");
    const ok = hasKey();
    if (dot) dot.className = "chat-status-dot " + (ok ? "ok" : "warn");
    if (txt) txt.textContent = ok ? "已就绪 · 千问 API" : "未配置 API Key";
    if (btn) btn.textContent = ok ? "更换 Key" : "配置 Key";
  }

  function openKeyModal(forced) {
    const existing = getApiKey();
    const fromShared = !localStorage.getItem("book_chat_apikey_v1") && !!(localStorage.getItem("yujun_chat_apikey_v1") || localStorage.getItem("mao_chat_apikey_v1"));
    const bg = document.createElement("div");
    bg.className = "chat-modal-bg";
    bg.innerHTML =
      '<div class="chat-modal" role="dialog">' +
      '<button type="button" class="chat-modal-x" id="bkKeyX">✕</button>' +
      "<h3>配置千问 API Key</h3>" +
      '<p class="chat-modal-sub">Key 只存在本机浏览器。和「问俞老师」「问毛爷爷」同一套百炼 Key 也能用。' +
      (fromShared ? "已带入已有 Key。" : "") +
      "</p>" +
      '<input type="password" id="bkKeyInput" placeholder="sk-xxxxxxxx" value="' +
      esc(existing) +
      '" autocomplete="off" />' +
      '<div class="chat-modal-actions">' +
      (forced ? "" : '<button type="button" class="chat-modal-cancel" id="bkKeyCancel">取消</button>') +
      (existing ? '<button type="button" class="chat-modal-cancel" id="bkKeyRemove">清除</button>' : "") +
      '<button type="button" class="chat-modal-save" id="bkKeySave">保存</button>' +
      "</div>" +
      '<div class="chat-modal-help">在阿里云 <a href="https://bailian.console.aliyun.com/?apiKey=1" target="_blank" rel="noopener">百炼控制台</a> 拿 API Key（DashScope）。按 token 计费。请用本地服务打开页面，file:// 可能被跨域拦住。</div>' +
      "</div>";
    document.body.appendChild(bg);
    const close = () => bg.remove();
    bg.addEventListener("click", (e) => {
      if (e.target === bg) close();
    });
    document.getElementById("bkKeyX").onclick = close;
    const cancel = document.getElementById("bkKeyCancel");
    if (cancel) cancel.onclick = close;
    const remove = document.getElementById("bkKeyRemove");
    if (remove)
      remove.onclick = () => {
        setApiKey("");
        syncStatus();
        close();
      };
    document.getElementById("bkKeySave").onclick = () => {
      const v = (document.getElementById("bkKeyInput").value || "").trim();
      if (!v) return;
      setApiKey(v);
      syncStatus();
      close();
    };
    setTimeout(() => {
      const el = document.getElementById("bkKeyInput");
      if (el) el.focus();
    }, 0);
  }

  async function callQwen(messages, model) {
    const proxy = global.BOOK_CHAT_PROXY_URL || global.YU_CHAT_PROXY_URL;
    if (proxy) {
      const r = await fetch(proxy, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model, messages: messages }),
      });
      if (!r.ok) throw new Error("代理返回 " + r.status);
      return r.json();
    }
    const key = getApiKey();
    if (!key) throw new Error("NO_API_KEY");
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.45,
        top_p: 0.85,
        max_tokens: 1800,
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      if (r.status === 401) throw new Error("Key 无效，请重新配置");
      throw new Error("千问 " + r.status + "：" + txt.slice(0, 180));
    }
    return r.json();
  }

  function appendMsg(role, html) {
    const stream = document.getElementById("bkChatStream");
    if (!stream) return null;
    const samplesEl = stream.querySelector(".chat-compact-samples");
    if (samplesEl) samplesEl.remove();
    const row = document.getElementById("bkSuggestRow");
    if (row) row.style.display = "flex";
    const wrap = document.createElement("div");
    wrap.className = "chat-msg chat-msg-" + (role === "user" ? "user" : "yu");
    wrap.innerHTML =
      '<div class="chat-avatar chat-avatar-' +
      (role === "user" ? "user" : "yu") +
      '">' +
      (role === "user" ? "我" : avatarChar()) +
      '</div><div class="chat-bubble">' +
      html +
      "</div>";
    stream.appendChild(wrap);
    stream.scrollTop = stream.scrollHeight;
    return wrap;
  }

  async function send(raw) {
    const q = String(raw || "").trim();
    if (!q || state.busy) return;
    if (!hasKey()) {
      openKeyModal(true);
      return;
    }
    const input = document.getElementById("bkChatInput");
    if (input) {
      input.value = "";
      input.style.height = "auto";
    }
    appendMsg("user", esc(q).replace(/\n/g, "<br/>"));
    state.history.push({ role: "user", content: q });
    const typing = appendMsg("yu", '<div class="chat-typing"><span></span><span></span><span></span></div>');
    state.busy = true;
    const sendBtn = document.getElementById("bkSendBtn");
    if (sendBtn) sendBtn.disabled = true;
    try {
      const packed = packContext(q);
      const messages = [
        { role: "system", content: buildSystemPrompt() },
        { role: "system", content: packed.ctx },
        ...state.history.slice(-10),
      ];
      const resp = await callQwen(messages, getModel());
      const rawOut =
        (resp && resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content) ||
        (resp && resp.output && resp.output.choices && resp.output.choices[0] && resp.output.choices[0].message && resp.output.choices[0].message.content) ||
        "";
      if (!rawOut) throw new Error("模型空回复");
      const parsed = parseFollowup(rawOut);
      let html = fmtMarkdown(parsed.body) + renderHits(packed.hits);
      if (parsed.follow.length) {
        html +=
          '<div class="chat-followup"><div class="chat-followup-head">可以接着问</div>' +
          parsed.follow
            .map((f) => '<button type="button" class="chat-followup-chip" data-q="' + esc(f) + '">' + esc(f) + "</button>")
            .join("") +
          "</div>";
      }
      typing.querySelector(".chat-bubble").innerHTML = html;
      typing.querySelectorAll(".chat-followup-chip").forEach((btn) => {
        btn.onclick = () => send(btn.getAttribute("data-q"));
      });
      state.history.push({ role: "assistant", content: parsed.body });
    } catch (e) {
      const msg = (e && e.message) || String(e);
      if (msg === "NO_API_KEY") {
        typing.remove();
        openKeyModal(true);
      } else {
        typing.querySelector(".chat-bubble").innerHTML =
          '<p style="color:#ffa39e">⚠ ' + esc(msg) + "</p><p class='muted' style='color:rgba(255,255,255,0.7);font-size:12px'>可换 Key / 换模型，并确认不是用 file:// 打开。</p>";
      }
    } finally {
      state.busy = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function render(panel) {
    if (!panel) return;
    const P = global.PERSONA || {};
    if (!P.models || !P.models.length) return;
    const name = who();
    const qs = samples();
    panel.innerHTML =
      '<div class="chat-wrap is-expanded" id="bkChatWrap">' +
      '<div class="chat-status-bar">' +
      '<span class="chat-status-dot warn" id="bkStatusDot"></span>' +
      '<span id="bkStatusText" class="muted">未配置 API Key</span>' +
      '<select class="chat-model-select" id="bkModelSelect">' +
      MODELS.map(
        (m) =>
          '<option value="' + m.id + '"' + (m.id === getModel() ? " selected" : "") + ">" + m.label + "</option>"
      ).join("") +
      "</select>" +
      '<span class="chat-status-spacer"></span>' +
      '<button type="button" class="chat-key-btn" id="bkKeyBtn">配置 Key</button>' +
      '<button type="button" class="chat-clear-btn" id="bkClearBtn">清空</button>' +
      "</div>" +
      '<div class="chat-stream" id="bkChatStream">' +
      '<div class="chat-empty-hero">' +
      "<h3>问" +
      esc(name) +
      "</h3>" +
      "<p>用千问，按《系统之美》框架回答。信息不够会先反问。不是作者本人。</p>" +
      '<div class="chat-compact-samples">' +
      qs
        .slice(0, 5)
        .map((s) => '<button type="button" class="chat-suggest-chip" data-q="' + esc(s) + '">' + esc(s) + "</button>")
        .join("") +
      "</div></div></div>" +
      '<div class="chat-suggest-row" id="bkSuggestRow" style="display:none">' +
      qs.map((s) => '<button type="button" class="chat-suggest-chip" data-q="' + esc(s) + '">' + esc(s) + "</button>").join("") +
      "</div>" +
      '<div class="chat-input-row">' +
      '<textarea id="bkChatInput" rows="1" placeholder="问' +
      esc(name) +
      '：为什么越治越顽？"></textarea>' +
      '<button type="button" class="chat-send-btn" id="bkSendBtn">发送</button>' +
      "</div></div>";

    state.mounted = true;
    syncStatus();
    document.getElementById("bkKeyBtn").onclick = () => openKeyModal(false);
    document.getElementById("bkClearBtn").onclick = () => {
      if (state.history.length && !confirm("清空对话？")) return;
      state.history = [];
      render(panel);
    };
    document.getElementById("bkModelSelect").onchange = (e) => setModel(e.target.value);
    document.getElementById("bkSendBtn").onclick = () => send(document.getElementById("bkChatInput").value);
    const input = document.getElementById("bkChatInput");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send(input.value);
      }
    });
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 140) + "px";
    });
    panel.querySelectorAll(".chat-suggest-chip").forEach((btn) => {
      btn.onclick = () => send(btn.getAttribute("data-q"));
    });
  }

  global.BOOK_PERSONA_CHAT = { render: render, send: send, openKeyModal: openKeyModal, getApiKey: getApiKey };
})(window);
