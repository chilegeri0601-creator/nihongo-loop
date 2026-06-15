const levelData = {
  N5: {
    copyKey: "roadmap.N5",
  },
  N4: {
    copyKey: "roadmap.N4",
  },
  N3: {
    copyKey: "roadmap.N3",
  },
  N2: {
    copyKey: "roadmap.N2",
  },
  N1: {
    copyKey: "roadmap.N1",
  },
};

const moduleConfig = {
  单词: { key: "vocabulary", href: "vocabulary.html", color: "red", nameKey: "module.vocabulary", completedLabelKey: "module.vocabularyDone" },
  语法: { key: "grammar", href: "grammar.html", color: "blue", nameKey: "module.grammar", completedLabelKey: "module.grammarDone" },
  阅读: { key: "reading", href: "reading.html", color: "green", nameKey: "module.reading", completedLabelKey: "module.readingDone" },
  听力: { key: "listening", href: "listening.html", color: "amber", nameKey: "module.listening", completedLabelKey: "module.listeningDone" },
};

const moduleOrder = ["单词", "语法", "阅读", "听力"];
const contentIndex = {
  vocabulary: {},
  grammar: {},
  reading: {},
  listening: {},
};

window.addEventListener("load", () => {
  window.setTimeout(() => document.body.classList.remove("is-loading"), 650);
});

const toast = document.querySelector("#toast");
const serviceBadges = [document.querySelector("#serviceStatus"), document.querySelector("#mobileServiceStatus")].filter(Boolean);
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");
let currentUserId = localStorage.getItem("nihongoLoopUserId") || "demo-user";
let currentUserEmail = localStorage.getItem("nihongoLoopUserEmail") || "演示用户";
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";
let toastTimer;

function t(key, params = {}) {
  return window.NihongoI18n?.t(key, params) || key;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setServiceStatus(isOnline) {
  serviceBadges.forEach((badge) => {
    badge.textContent = isOnline ? t("common.online") : t("common.offline");
    badge.classList.toggle("online", isOnline);
    badge.classList.toggle("offline", !isOnline);
  });
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
  localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
}

function localTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function refreshLocalCheckinState() {
  if (!savedState.lastCheckinDate) savedState.lastCheckinDate = "";
  if (savedState.lastCheckinDate !== localTodayKey()) savedState.checkedIn = false;
  savedState.streakDays = Number(savedState.streakDays || 0);
}

function currentLevel() {
  return savedState.level || "N2";
}

function indexItems(moduleKey, level, items) {
  contentIndex[moduleKey][level] = new Set((items || []).map((item) => item.id).filter(Boolean));
}

async function loadContentIndex() {
  try {
    const [vocabularyResponse, grammarResponse, featureResponse] = await Promise.all([
      fetch("data/vocabulary.json"),
      fetch("data/grammar.json"),
      fetch("data/features.json"),
    ]);
    const [vocabulary, grammar, features] = await Promise.all([vocabularyResponse.json(), grammarResponse.json(), featureResponse.json()]);
    Object.keys(levelData).forEach((level) => {
      indexItems("vocabulary", level, vocabulary[level] || []);
      indexItems("grammar", level, grammar[level] || []);
      indexItems("reading", level, features.reading?.levels?.[level] || []);
      indexItems("listening", level, features.listening?.levels?.[level] || []);
    });
  } catch {
    // 题库统计失败时，首页仍保留已完成数量，不阻塞学习。
  }
  applyDashboard();
}

function featureRecords(moduleKey) {
  return savedState.featureRecords?.[currentUserId]?.[moduleKey] || savedState.features?.[moduleKey] || {};
}

function progressSnapshot(moduleName, level) {
  const config = moduleConfig[moduleName];
  const ids = contentIndex[config.key]?.[level] || new Set();
  let records = {};
  let isComplete = () => false;
  if (config.key === "vocabulary") {
    records = savedState.vocabulary || {};
    isComplete = (record) => Boolean(record.mastered);
  } else if (config.key === "grammar") {
    records = savedState.grammar || {};
    isComplete = (record) => Boolean(record.completed);
  } else {
    records = featureRecords(config.key);
    isComplete = (record) => Boolean(record.completed);
  }
  const completed = Object.entries(records).filter(([id, record]) => ids.has(id) && isComplete(record)).length;
  const total = ids.size;
  const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const completedLabel = t(config.completedLabelKey);
  const detail = total ? `${completed}/${total} ${completedLabel}` : `${completed} ${completedLabel}`;
  return { ...config, completed, total, percent, detail };
}

function renderProgress(level) {
  const data = levelData[level] || levelData.N2;
  const roadmapLevel = document.querySelector("#roadmapLevel");
  if (roadmapLevel) roadmapLevel.textContent = level;
  document.querySelector("#currentLevelText").textContent = level;
  document.querySelector("#roadmapCopy").textContent = t(data.copyKey);
  document.querySelector("#roadmapTitle").textContent = t("index.progressTitle", { level });
  const rows = moduleOrder.map((name) => [name, progressSnapshot(name, level)]);
  document.querySelector("#progressList").innerHTML = rows
    .map(
      ([name, progress]) => `
        <a class="progress-row dashboard-progress-row" href="${progress.href}">
          <b>${t(progress.nameKey)}</b>
          <small>${progress.detail}</small>
          <div class="progress-track"><span class="${progress.color}" style="width: ${progress.percent}%"></span></div>
          <em>${progress.percent}%</em>
        </a>
      `,
    )
    .join("");
  document.querySelectorAll(".module-card").forEach((card) => {
    const module = card.dataset.module;
    const row = rows.find(([name]) => name === module);
    if (!row) return;
    const progress = card.querySelector(".card-progress span");
    if (progress) progress.style.width = `${row[1].percent}%`;
  });
}

function applyCheckinState() {
  refreshLocalCheckinState();
  const button = document.querySelector("#checkinButton");
  const checkedIn = Boolean(savedState.checkedIn);
  document.querySelector("#streakDays").textContent = String(Number(savedState.streakDays || 0));
  document.querySelector("#checkinHint").textContent = checkedIn ? t("index.checkedIn") : t("index.notCheckedIn");
  button.textContent = checkedIn ? t("index.checkedButton") : t("index.checkin");
  button.disabled = checkedIn;
}

function applyDashboard() {
  document.querySelector("#accountLabel").textContent = currentUserEmail === "演示用户" ? t("common.demoUser") : currentUserEmail;
  const level = currentLevel();
  document.querySelectorAll("[data-level]").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === level);
  });
  renderProgress(level);
  applyCheckinState();
}

window.addEventListener("nihongo:languagechange", applyDashboard);

document.querySelectorAll("[data-level]").forEach((button) => {
  button.addEventListener("click", async () => {
    savedState.level = button.dataset.level;
    saveLocalState();
    applyDashboard();
    try {
      const data = await apiRequest("/api/progress", {
        method: "PATCH",
        body: JSON.stringify({ userId: currentUserId, level: button.dataset.level }),
      });
      Object.assign(savedState, data.progress);
      saveLocalState();
      setServiceStatus(true);
    } catch {
      setServiceStatus(false);
    }
    showToast(`已切换到 ${button.dataset.level}`);
  });
});

document.querySelector("#checkinButton").addEventListener("click", async () => {
  try {
    const data = await apiRequest("/api/checkin", {
      method: "POST",
      body: JSON.stringify({ userId: currentUserId }),
    });
    Object.assign(savedState, data.progress);
    setServiceStatus(true);
  } catch {
    savedState.checkedIn = true;
    savedState.streakDays = Number(savedState.streakDays || 0) + 1;
    savedState.lastCheckinDate = localTodayKey();
    setServiceStatus(false);
  }
  saveLocalState();
  applyDashboard();
  showToast("打卡成功，连续天数 +1");
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

window.addEventListener("scroll", () => {
  document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 8);
});

async function loadServerProgress() {
  try {
    const data = await apiRequest(`/api/me?userId=${encodeURIComponent(currentUserId)}`);
    currentUserEmail = data.user.displayName || data.user.email || currentUserEmail;
    localStorage.setItem("nihongoLoopUserEmail", currentUserEmail);
    Object.assign(savedState, data.progress);
    saveLocalState();
    setServiceStatus(true);
  } catch {
    setServiceStatus(false);
  }
  applyDashboard();
}

applyDashboard();
loadContentIndex();
loadServerProgress();
