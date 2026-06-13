const levelData = {
  N5: {
    copy: "6 周建立假名、基础单词、入门语法和慢速听力的学习节奏。",
    progress: [
      ["单词", "800 入门词", 72, "red"],
      ["语法", "55 个基础句型", 62, "blue"],
      ["阅读", "18 篇短文", 48, "green"],
      ["听力", "32 个慢速场景", 58, "amber"],
    ],
  },
  N4: {
    copy: "7 周巩固日常表达，提升短文阅读和基础听力反应速度。",
    progress: [
      ["单词", "1200 常用词", 66, "red"],
      ["语法", "78 个句型", 57, "blue"],
      ["阅读", "24 篇生活短文", 52, "green"],
      ["听力", "40 个会话场景", 64, "amber"],
    ],
  },
  N3: {
    copy: "8 周连接基础到中级，强化长句理解、文章结构和听力关键词。",
    progress: [
      ["单词", "1600 高频词", 61, "red"],
      ["语法", "96 个中级句型", 55, "blue"],
      ["阅读", "28 篇综合文章", 44, "green"],
      ["听力", "48 个真实场景", 69, "amber"],
    ],
  },
  N2: {
    copy: "8 周完成高频词、核心语法、真题阅读与听力场景训练。",
    progress: [
      ["单词", "1800 高频词", 68, "red"],
      ["语法", "128 个句型", 54, "blue"],
      ["阅读", "32 篇真题文章", 46, "green"],
      ["听力", "54 个场景", 71, "amber"],
    ],
  },
  N1: {
    copy: "10 周面向高阶词汇、抽象阅读、复杂语法和考试节奏冲刺。",
    progress: [
      ["单词", "2400 高阶词", 52, "red"],
      ["语法", "156 个高阶句型", 49, "blue"],
      ["阅读", "42 篇长文训练", 38, "green"],
      ["听力", "68 个高阶场景", 57, "amber"],
    ],
  },
};

const moduleLinks = {
  单词: "vocabulary.html",
  语法: "grammar.html",
  阅读: "reading.html",
  听力: "listening.html",
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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function setServiceStatus(isOnline) {
  serviceBadges.forEach((badge) => {
    badge.textContent = isOnline ? "后端已连接" : "离线演示";
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

function renderProgress(level) {
  const data = levelData[level] || levelData.N2;
  document.querySelector("#roadmapLevel").textContent = level;
  document.querySelector("#currentLevelText").textContent = level;
  document.querySelector("#roadmapCopy").textContent = data.copy;
  document.querySelector("#progressList").innerHTML = data.progress
    .map(
      ([name, detail, percent, color]) => `
        <a class="progress-row dashboard-progress-row" href="${moduleLinks[name]}">
          <b>${name}</b>
          <small>${detail}</small>
          <div class="progress-track"><span class="${color}" style="width: ${percent}%"></span></div>
          <em>${percent}%</em>
        </a>
      `,
    )
    .join("");
  document.querySelectorAll(".module-card").forEach((card) => {
    const module = card.dataset.module;
    const row = data.progress.find(([name]) => name === module);
    if (!row) return;
    const progress = card.querySelector(".card-progress span");
    if (progress) progress.style.width = `${row[2]}%`;
  });
}

function applyCheckinState() {
  refreshLocalCheckinState();
  const button = document.querySelector("#checkinButton");
  const checkedIn = Boolean(savedState.checkedIn);
  document.querySelector("#streakDays").textContent = String(Number(savedState.streakDays || 0));
  document.querySelector("#checkinHint").textContent = checkedIn ? "今日打卡完成，明天继续保持节奏" : "今天还没有完成打卡";
  button.textContent = checkedIn ? "已打卡" : "打卡";
  button.disabled = checkedIn;
}

function applyDashboard() {
  document.querySelector("#accountLabel").textContent = currentUserEmail;
  const level = currentLevel();
  document.querySelectorAll("[data-level]").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === level);
  });
  renderProgress(level);
  applyCheckinState();
}

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

loadServerProgress();
