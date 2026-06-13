const toast = document.querySelector("#toast");
const statusBadge = document.querySelector("#grammarServiceStatus");
const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
let toastTimer;
const initialGrammarResume = savedState.grammarResume?.[currentUserId] || {};
const initialGrammarLevel = initialGrammarResume.level || savedState.grammarLevel || "N5";
const initialGrammarLevelResume = initialGrammarResume.levels?.[initialGrammarLevel] || {};

const fallbackGrammar = {
  N5: [
    {
      id: "n5-wa",
      level: "N5",
      category: "助词",
      title: "は：提示主题",
      pattern: "A は B です",
      meaning: "A 是 B / 关于 A",
      whenToUse: "想介绍一个人、物或话题时使用。",
      structure: "名词 + は + 说明内容",
      example: "わたしは学生です。",
      exampleMeaning: "我是学生。",
      beginnerTip: "は 在这里读作 wa，不读 ha。先把它理解成“接下来我要说 A 的事情”。",
      commonMistake: "不要把 は 和 が 完全等同。は 更像提出话题，が 更像指出主语。",
      miniQuestion: { question: "「私は学生です」里的 は 表示什么？", options: ["主题", "过去", "否定"], correct: "主题", explanation: "这里的 は 用来提示“我”这个话题。" },
    },
  ],
};

const session = {
  level: initialGrammarLevel,
  category: initialGrammarLevelResume.category || savedState.grammarCategory || "全部",
  points: [],
  categories: [],
  index: Number(initialGrammarLevelResume.index || 0),
  stats: { total: 0, completed: 0, remaining: 0 },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setServiceStatus(isOnline) {
  statusBadge.textContent = isOnline ? "后端已连接" : "离线演示";
  statusBadge.classList.toggle("online", isOnline);
  statusBadge.classList.toggle("offline", !isOnline);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.message || "请求失败");
  return data;
}

function grammarResumeStore() {
  savedState.grammarResume = savedState.grammarResume || {};
  savedState.grammarResume[currentUserId] = savedState.grammarResume[currentUserId] || { level: session.level, levels: {} };
  savedState.grammarResume[currentUserId].levels = savedState.grammarResume[currentUserId].levels || {};
  return savedState.grammarResume[currentUserId];
}

function saveResume() {
  const store = grammarResumeStore();
  store.level = session.level;
  store.levels[session.level] = {
    category: session.category,
    index: session.index,
    updatedAt: new Date().toISOString(),
  };
}

function applyResumeForLevel(level, options = {}) {
  const resume = savedState.grammarResume?.[currentUserId]?.levels?.[level];
  session.category = options.reset ? "全部" : resume?.category || "全部";
  session.index = options.reset ? 0 : Number(resume?.index || 0);
}

function saveLocalState() {
  savedState.grammarLevel = session.level;
  savedState.grammarCategory = session.category;
  saveResume();
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
}

function decorateLocal(points) {
  const records = savedState.grammar || {};
  const decorated = points.map((point) => {
    const record = records[point.id] || {};
    return {
      ...point,
      completed: Boolean(record.completed),
      attempts: Number(record.attempts || 0),
      correct: Number(record.correct || 0),
      lastAnsweredAt: record.lastAnsweredAt || "",
    };
  });
  const completed = decorated.filter((point) => point.completed).length;
  return {
    points: decorated,
    categories: [...new Set(decorated.map((point) => point.category))],
    stats: { total: decorated.length, completed, remaining: decorated.length - completed },
  };
}

async function loadGrammar(level) {
  document.querySelector("#grammarPageTitle").textContent = `${level} 语法学习`;
  document.querySelector("#grammarPageContent").innerHTML = `<div class="vocab-loading"><strong>正在载入 ${level} 语法</strong><span>整理分类、接续和小测。</span></div>`;
  try {
    const data = await apiRequest(`/api/grammar?userId=${encodeURIComponent(currentUserId)}&level=${encodeURIComponent(level)}`);
    setServiceStatus(true);
    return data.grammar;
  } catch {
    setServiceStatus(false);
    try {
      const response = await fetch("data/grammar.json");
      const grammar = await response.json();
      const local = decorateLocal(grammar[level] || grammar.N5 || []);
      return { level, ...local };
    } catch {
      const local = decorateLocal(fallbackGrammar[level] || fallbackGrammar.N5);
      return { level, ...local };
    }
  }
}

function filteredPoints() {
  if (session.category === "全部") return session.points;
  return session.points.filter((point) => point.category === session.category);
}

function currentPoint() {
  const points = filteredPoints();
  return points[Math.min(session.index, Math.max(0, points.length - 1))] || points[0];
}

function clampSessionIndex() {
  if (session.category !== "全部" && !session.categories.includes(session.category)) {
    session.category = "全部";
  }
  const points = filteredPoints();
  const maxIndex = Math.max(0, points.length - 1);
  if (!Number.isInteger(session.index) || session.index < 0) session.index = 0;
  if (session.index > maxIndex) session.index = maxIndex;
}

function renderCategoryOptions() {
  return ["全部", ...session.categories]
    .map((category) => `<option value="${escapeHtml(category)}" ${session.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`)
    .join("");
}

function renderPointOptions() {
  return filteredPoints()
    .map(
      (point, index) => `<option value="${index}" ${index === session.index ? "selected" : ""}>${point.completed ? "✓ " : ""}${escapeHtml(point.title)}</option>`,
    )
    .join("");
}

function visiblePosition() {
  const points = filteredPoints();
  return {
    total: points.length,
    current: points.length ? Math.min(session.index + 1, points.length) : 0,
  };
}

function renderDetail(point) {
  const position = visiblePosition();
  return `
    <section class="grammar-detail">
      <div class="grammar-detail-top">
        <span>${escapeHtml(point.level)} · ${escapeHtml(point.category)}</span>
        <strong>${position.current}/${position.total}</strong>
      </div>
      <div class="grammar-focus">
        <div>
          <h3>${escapeHtml(point.title)}</h3>
          <p>${escapeHtml(point.meaning)}</p>
        </div>
        <span class="${point.completed ? "learned" : ""}">${point.completed ? "已学会" : "学习中"}</span>
      </div>
      <p class="grammar-pattern">${escapeHtml(point.pattern)}</p>
      <div class="grammar-example">
        <b>${escapeHtml(point.example)}</b>
        <span>${escapeHtml(point.exampleMeaning)}</span>
      </div>
      <div class="grammar-explain-grid">
        <article>
          <span>什么时候用</span>
          <p>${escapeHtml(point.whenToUse)}</p>
        </article>
        <article>
          <span>怎么接</span>
          <p>${escapeHtml(point.structure)}</p>
        </article>
      </div>
      <div class="grammar-note-strip">
        <span>${escapeHtml(point.beginnerTip)}</span>
        <small>${escapeHtml(point.commonMistake)}</small>
      </div>
      <div class="grammar-actions">
        <button class="btn btn-light" type="button" data-grammar-prev>上一条</button>
        <button class="btn btn-red" type="button" data-grammar-complete>${point.completed ? "已完成" : "标记学会"}</button>
        <button class="btn btn-dark" type="button" data-grammar-next>下一条</button>
        <a class="btn btn-light" href="test.html?type=grammar&level=${encodeURIComponent(point.level)}">去测验</a>
      </div>
    </section>
  `;
}

function draw() {
  clampSessionIndex();
  const point = currentPoint();
  const percent = session.stats.total ? Math.round((session.stats.completed / session.stats.total) * 100) : 0;
  const visible = visiblePosition();
  if (!point) {
    document.querySelector("#grammarPageContent").innerHTML = `<div class="vocab-loading"><strong>暂无语法点</strong><span>请切换其他等级。</span></div>`;
    return;
  }
  saveLocalState();
  document.querySelector("#grammarPageContent").innerHTML = `
    <div class="grammar-shell" id="grammarMap">
      <section class="grammar-sidebar">
        <div class="grammar-stats">
          <div><strong>${session.stats.completed}/${session.stats.total}</strong><span>全等级进度</span></div>
          <div><strong>${visible.current}/${visible.total}</strong><span>当前分类</span></div>
          <div><strong>${session.categories.length}</strong><span>分类</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <div class="grammar-select-row">
          <label>
            分类
            <select data-grammar-category-select>${renderCategoryOptions()}</select>
          </label>
          <label>
            语法点
            <select data-grammar-picker>${renderPointOptions()}</select>
          </label>
        </div>
      </section>
      ${renderDetail(point)}
    </div>
  `;
  bind();
}

async function setLevel(level) {
  session.level = level;
  applyResumeForLevel(level);
  const testLink = document.querySelector("#grammarTestLink");
  if (testLink) testLink.href = `test.html?type=grammar&level=${encodeURIComponent(level)}`;
  document.querySelectorAll("[data-grammar-level]").forEach((button) => button.classList.toggle("active", button.dataset.grammarLevel === level));
  const payload = await loadGrammar(level);
  session.points = payload.points;
  session.categories = payload.categories;
  session.stats = payload.stats;
  clampSessionIndex();
  saveLocalState();
  draw();
}

function bind() {
  document.querySelector("[data-grammar-category-select]")?.addEventListener("change", (event) => {
    session.category = event.target.value;
    session.index = 0;
    saveLocalState();
    draw();
  });
  document.querySelector("[data-grammar-picker]")?.addEventListener("change", (event) => {
    session.index = Number(event.target.value);
    saveLocalState();
    draw();
  });
  document.querySelector("[data-grammar-prev]")?.addEventListener("click", () => moveGrammar(-1));
  document.querySelector("[data-grammar-next]")?.addEventListener("click", () => moveGrammar(1));
  document.querySelector("[data-grammar-complete]")?.addEventListener("click", () => markCurrentComplete());
}

function moveGrammar(step) {
  const points = filteredPoints();
  if (!points.length) return;
  session.index = (session.index + step + points.length) % points.length;
  saveLocalState();
  draw();
}

async function markCurrentComplete() {
  const point = currentPoint();
  if (!point) return;
  if (!point.completed) {
    point.completed = true;
    session.stats.completed += 1;
    session.stats.remaining = Math.max(0, session.stats.total - session.stats.completed);
    savedState.grammar = savedState.grammar || {};
    const record = savedState.grammar[point.id] || { attempts: 0, correct: 0, completed: false };
    record.attempts += 1;
    record.correct += 1;
    record.completed = true;
    record.lastAnsweredAt = new Date().toISOString();
    savedState.grammar[point.id] = record;
    saveLocalState();
    try {
      await apiRequest("/api/grammar/answer", { method: "POST", body: JSON.stringify({ userId: currentUserId, grammarId: point.id, correct: true }) });
      setServiceStatus(true);
    } catch {
      setServiceStatus(false);
    }
  }
  showToast("已标记学会，继续下一条。");
  moveGrammar(1);
}

document.querySelectorAll("[data-grammar-level]").forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.grammarLevel));
});

setLevel(session.level);
