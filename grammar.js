const toast = document.querySelector("#toast");
const statusBadge = document.querySelector("#grammarServiceStatus");
const currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
let toastTimer;

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
  level: savedState.grammarLevel || "N5",
  category: "全部",
  points: [],
  categories: [],
  index: 0,
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

function saveLocalState() {
  savedState.grammarLevel = session.level;
  savedState.grammarCategory = session.category;
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

function renderCategoryButtons() {
  return ["全部", ...session.categories]
    .map((category) => `<button type="button" class="${session.category === category ? "active" : ""}" data-grammar-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
    .join("");
}

function renderPointList() {
  return filteredPoints()
    .map(
      (point, index) => `
        <button type="button" class="grammar-list-item ${index === session.index ? "current" : ""} ${point.completed ? "completed" : ""}" data-grammar-index="${index}">
          <span>${escapeHtml(point.pattern)}</span>
          <strong>${escapeHtml(point.title)}</strong>
          <em>${point.completed ? "已学会" : point.category}</em>
        </button>
      `,
    )
    .join("");
}

function renderDetail(point) {
  return `
    <section class="grammar-detail">
      <div class="grammar-detail-top">
        <span>${escapeHtml(point.level)} · ${escapeHtml(point.category)}</span>
        <strong>${point.completed ? "已学会" : "学习中"}</strong>
      </div>
      <h3>${escapeHtml(point.title)}</h3>
      <p class="grammar-pattern">${escapeHtml(point.pattern)}</p>
      <div class="grammar-meaning">${escapeHtml(point.meaning)}</div>
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
      <div class="grammar-example">
        <b>${escapeHtml(point.example)}</b>
        <span>${escapeHtml(point.exampleMeaning)}</span>
      </div>
      <div class="grammar-notes">
        <article>
          <span>初学者提示</span>
          <p>${escapeHtml(point.beginnerTip)}</p>
        </article>
        <article>
          <span>易错点</span>
          <p>${escapeHtml(point.commonMistake)}</p>
        </article>
      </div>
      <div class="study-link-panel grammar-study-link">
        <span>学习模式</span>
        <h4>这里只讲清楚语法点</h4>
        <p>掌握用法、接续和例句后，再进入独立测验页答题。</p>
        <a class="btn btn-dark" href="test.html?type=grammar&level=${encodeURIComponent(point.level)}">进入 ${escapeHtml(point.level)} 语法测验</a>
      </div>
    </section>
  `;
}

function draw() {
  const point = currentPoint();
  const percent = session.stats.total ? Math.round((session.stats.completed / session.stats.total) * 100) : 0;
  if (!point) {
    document.querySelector("#grammarPageContent").innerHTML = `<div class="vocab-loading"><strong>暂无语法点</strong><span>请切换其他等级。</span></div>`;
    return;
  }
  document.querySelector("#grammarPageContent").innerHTML = `
    <div class="grammar-shell" id="grammarMap">
      <aside class="grammar-sidebar">
        <div class="grammar-stats">
          <div><strong>${session.stats.completed}/${session.stats.total}</strong><span>已学会</span></div>
          <div><strong>${session.categories.length}</strong><span>分类</span></div>
        </div>
        <div class="vocab-progress"><span style="width: ${percent}%"></span></div>
        <div class="grammar-categories" aria-label="语法分类">${renderCategoryButtons()}</div>
        <div class="grammar-list">${renderPointList()}</div>
      </aside>
      ${renderDetail(point)}
    </div>
  `;
  bind();
}

async function setLevel(level) {
  session.level = level;
  session.category = "全部";
  session.index = 0;
  const testLink = document.querySelector("#grammarTestLink");
  if (testLink) testLink.href = `test.html?type=grammar&level=${encodeURIComponent(level)}`;
  document.querySelectorAll("[data-grammar-level]").forEach((button) => button.classList.toggle("active", button.dataset.grammarLevel === level));
  const payload = await loadGrammar(level);
  session.points = payload.points;
  session.categories = payload.categories;
  session.stats = payload.stats;
  saveLocalState();
  draw();
}

function bind() {
  document.querySelectorAll("[data-grammar-category]").forEach((button) => {
    button.addEventListener("click", () => {
      session.category = button.dataset.grammarCategory;
      session.index = 0;
      saveLocalState();
      draw();
    });
  });
  document.querySelectorAll("[data-grammar-index]").forEach((button) => {
    button.addEventListener("click", () => {
      session.index = Number(button.dataset.grammarIndex);
      draw();
    });
  });
}

document.querySelectorAll("[data-grammar-level]").forEach((button) => {
  button.addEventListener("click", () => setLevel(button.dataset.grammarLevel));
});

setLevel(session.level);
