const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const VOCABULARY_FILE = path.join(DATA_DIR, "vocabulary.json");
const GRAMMAR_FILE = path.join(DATA_DIR, "grammar.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const defaultDb = {
  users: [
    {
      id: "demo-user",
      email: "demo@nihongo.loop",
      displayName: "演示用户",
      passwordHash: hashPassword("demo123456"),
      createdAt: new Date().toISOString(),
      lastLoginAt: "",
    },
  ],
  progress: {
    "demo-user": {
      level: "N2",
      activeModule: "单词",
      completedModule: "",
      checkedIn: false,
      streakDays: 0,
      quiz: {},
      vocabulary: {},
      grammar: {},
      updatedAt: new Date().toISOString(),
    },
  },
  passwordResets: {},
};

const quizAnswers = {
  grammarN2Q04: {
    correct: "ようだ",
    explanation: "回答正确：这里表达“看起来似乎有时间”，ようだ 更自然。",
    hint: "这个选项不太合适。提示：句子在根据事实推测对方似乎有时间。",
  },
};

const vocabularyByLevel = {
  N5: [
    { id: "n5-asa", word: "朝", kana: "あさ", meaning: "早晨", type: "名词", example: "朝、コーヒーを飲みます。", exampleMeaning: "早上喝咖啡。" },
    { id: "n5-iku", word: "行く", kana: "いく", meaning: "去", type: "动词", example: "学校へ行きます。", exampleMeaning: "去学校。" },
    { id: "n5-takai", word: "高い", kana: "たかい", meaning: "高的、贵的", type: "形容词", example: "この本は少し高いです。", exampleMeaning: "这本书有点贵。" },
  ],
  N4: [
    { id: "n4-yoyaku", word: "予約", kana: "よやく", meaning: "预约", type: "名词", example: "ホテルを予約しました。", exampleMeaning: "预约了酒店。" },
    { id: "n4-tsutaeru", word: "伝える", kana: "つたえる", meaning: "传达、告诉", type: "动词", example: "先生に予定を伝えます。", exampleMeaning: "把计划告诉老师。" },
    { id: "n4-benri", word: "便利", kana: "べんり", meaning: "方便", type: "形容动词", example: "このアプリは便利です。", exampleMeaning: "这个应用很方便。" },
  ],
  N3: [
    { id: "n3-kakunin", word: "確認", kana: "かくにん", meaning: "确认", type: "名词/サ变", example: "メールの内容を確認します。", exampleMeaning: "确认邮件内容。" },
    { id: "n3-sasaeru", word: "支える", kana: "ささえる", meaning: "支撑、支持", type: "动词", example: "家族が私を支えてくれます。", exampleMeaning: "家人支持着我。" },
    { id: "n3-kawari", word: "代わり", kana: "かわり", meaning: "代替、替换", type: "名词", example: "友達の代わりに行きます。", exampleMeaning: "代替朋友去。" },
  ],
  N2: [
    { id: "n2-atsukau", word: "扱う", kana: "あつかう", meaning: "处理、操作、对待", type: "动词", example: "このアプリは学習計画を自動で扱います。", exampleMeaning: "这个应用会自动处理学习计划。" },
    { id: "n2-oginau", word: "補う", kana: "おぎなう", meaning: "补充、弥补", type: "动词", example: "弱点を練習で補います。", exampleMeaning: "通过练习弥补弱点。" },
    { id: "n2-kaizen", word: "改善", kana: "かいぜん", meaning: "改善", type: "名词/サ变", example: "勉強方法を改善しました。", exampleMeaning: "改善了学习方法。" },
    { id: "n2-seigen", word: "制限", kana: "せいげん", meaning: "限制", type: "名词/サ变", example: "時間を制限して問題を解きます。", exampleMeaning: "限制时间做题。" },
    { id: "n2-hindo", word: "頻度", kana: "ひんど", meaning: "频率", type: "名词", example: "復習の頻度を上げます。", exampleMeaning: "提高复习频率。" },
  ],
  N1: [
    { id: "n1-gainen", word: "概念", kana: "がいねん", meaning: "概念", type: "名词", example: "抽象的な概念を理解します。", exampleMeaning: "理解抽象概念。" },
    { id: "n1-shisa", word: "示唆", kana: "しさ", meaning: "暗示、启发", type: "名词/サ变", example: "この結果は重要な点を示唆しています。", exampleMeaning: "这个结果暗示了重要之处。" },
    { id: "n1-chusho", word: "抽象", kana: "ちゅうしょう", meaning: "抽象", type: "名词/サ变", example: "抽象的な文章を読む練習をします。", exampleMeaning: "练习阅读抽象文章。" },
  ],
};

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const db = JSON.parse(raw);
  if (!db.passwordResets) db.passwordResets = {};
  return db;
}

async function writeDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName || user.email,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || "",
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createDisplayName(email) {
  return email.split("@")[0] || "学习者";
}

function getProgress(db, userId = "demo-user") {
  if (!db.progress[userId]) {
    db.progress[userId] = {
      level: "N2",
      activeModule: "单词",
      completedModule: "",
      checkedIn: false,
      streakDays: 0,
      quiz: {},
      vocabulary: {},
      updatedAt: new Date().toISOString(),
    };
  }
  if (!db.progress[userId].quiz) db.progress[userId].quiz = {};
  if (!db.progress[userId].vocabulary) db.progress[userId].vocabulary = {};
  if (!db.progress[userId].grammar) db.progress[userId].grammar = {};
  if (
    userId !== "demo-user" &&
    !db.progress[userId].checkedIn &&
    Number(db.progress[userId].streakDays || 0) > 0 &&
    Object.keys(db.progress[userId].quiz).length === 0 &&
    Object.keys(db.progress[userId].vocabulary).length === 0 &&
    Object.keys(db.progress[userId].grammar).length === 0
  ) {
    db.progress[userId].streakDays = 0;
  }
  return db.progress[userId];
}

async function readVocabulary() {
  try {
    const raw = await fs.readFile(VOCABULARY_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return vocabularyByLevel;
  }
}

async function readGrammar() {
  try {
    const raw = await fs.readFile(GRAMMAR_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function vocabularyPayload(db, userId, level) {
  const progress = getProgress(db, userId);
  const vocabulary = await readVocabulary();
  const words = vocabulary[level] || vocabulary.N2 || [];
  const decorated = words.map((word) => {
    const record = progress.vocabulary[word.id] || {};
    return {
      ...word,
      mastered: Boolean(record.mastered),
      attempts: Number(record.attempts || 0),
      correct: Number(record.correct || 0),
      lastAnsweredAt: record.lastAnsweredAt || "",
    };
  });
  const masteredCount = decorated.filter((word) => word.mastered).length;
  return {
    level,
    words: decorated,
    stats: {
      total: decorated.length,
      mastered: masteredCount,
      remaining: decorated.length - masteredCount,
    },
  };
}

async function grammarPayload(db, userId, level) {
  const progress = getProgress(db, userId);
  const grammar = await readGrammar();
  const points = grammar[level] || grammar.N5 || [];
  const decorated = points.map((point) => {
    const record = progress.grammar[point.id] || {};
    return {
      ...point,
      completed: Boolean(record.completed),
      attempts: Number(record.attempts || 0),
      correct: Number(record.correct || 0),
      lastAnsweredAt: record.lastAnsweredAt || "",
    };
  });
  const completedCount = decorated.filter((point) => point.completed).length;
  return {
    level,
    points: decorated,
    categories: [...new Set(decorated.map((point) => point.category))],
    stats: {
      total: decorated.length,
      completed: completedCount,
      remaining: decorated.length - completedCount,
    },
  };
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "nihongo-loop", time: new Date().toISOString() });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) {
      sendJson(res, 400, { ok: false, message: "邮箱和密码不能为空。" });
      return true;
    }
    if (!isValidEmail(email)) {
      sendJson(res, 400, { ok: false, message: "邮箱格式不正确。" });
      return true;
    }
    if (password.length < 6) {
      sendJson(res, 400, { ok: false, message: "密码至少需要 6 位。" });
      return true;
    }

    const db = await readDb();
    let user = db.users.find((item) => item.email === email);
    const passwordHash = hashPassword(password);
    if (user) {
      sendJson(res, 409, { ok: false, message: "这个邮箱已经注册，请直接登录。" });
      return true;
    }
    user = {
      id: crypto.randomUUID(),
      email,
      displayName: String(body.displayName || "").trim() || createDisplayName(email),
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.progress[user.id] = {
      level: "N2",
      activeModule: "单词",
      checkedIn: false,
      streakDays: 0,
      completedModule: "",
      quiz: {},
      vocabulary: {},
      grammar: {},
      updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    sendJson(res, 200, { ok: true, user: publicUser(user), progress: getProgress(db, user.id) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const passwordHash = hashPassword(body.password || "");
    const db = await readDb();
    const user = db.users.find((item) => item.email === email && item.passwordHash === passwordHash);
    if (!user) {
      sendJson(res, 401, { ok: false, message: "邮箱或密码不正确，可以使用 demo@nihongo.loop / demo123456。" });
      return true;
    }
    user.lastLoginAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { ok: true, user: publicUser(user), progress: getProgress(db, user.id) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/forgot-password") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) {
      sendJson(res, 400, { ok: false, message: "请先填写注册邮箱。" });
      return true;
    }
    if (!isValidEmail(email)) {
      sendJson(res, 400, { ok: false, message: "邮箱格式不正确。" });
      return true;
    }
    const db = await readDb();
    const user = db.users.find((item) => item.email === email);
    if (!user) {
      sendJson(res, 404, { ok: false, message: "没有找到这个邮箱对应的账号。" });
      return true;
    }
    const resetCode = String(crypto.randomInt(100000, 1000000));
    db.passwordResets[email] = {
      code: hashPassword(resetCode),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
    await writeDb(db);
    sendJson(res, 200, {
      ok: true,
      message: "找回验证码已生成，15 分钟内有效。",
      resetCode,
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/reset-password") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();
    const password = String(body.password || "");
    if (!email || !code || !password) {
      sendJson(res, 400, { ok: false, message: "邮箱、验证码和新密码不能为空。" });
      return true;
    }
    if (password.length < 6) {
      sendJson(res, 400, { ok: false, message: "新密码至少需要 6 位。" });
      return true;
    }
    const db = await readDb();
    const user = db.users.find((item) => item.email === email);
    const reset = db.passwordResets[email];
    if (!user || !reset) {
      sendJson(res, 404, { ok: false, message: "验证码不存在，请重新获取。" });
      return true;
    }
    if (Date.parse(reset.expiresAt) < Date.now()) {
      delete db.passwordResets[email];
      await writeDb(db);
      sendJson(res, 400, { ok: false, message: "验证码已过期，请重新获取。" });
      return true;
    }
    if (hashPassword(code) !== reset.code) {
      sendJson(res, 400, { ok: false, message: "验证码不正确。" });
      return true;
    }
    user.passwordHash = hashPassword(password);
    user.lastLoginAt = new Date().toISOString();
    delete db.passwordResets[email];
    await writeDb(db);
    sendJson(res, 200, {
      ok: true,
      user: publicUser(user),
      progress: getProgress(db, user.id),
      message: "密码已重置，已为你登录。",
    });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/me") {
    const userId = url.searchParams.get("userId") || "demo-user";
    const db = await readDb();
    const user = db.users.find((item) => item.id === userId);
    if (!user) {
      sendJson(res, 404, { ok: false, message: "用户不存在。" });
      return true;
    }
    sendJson(res, 200, { ok: true, user: publicUser(user), progress: getProgress(db, user.id) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/progress") {
    const userId = url.searchParams.get("userId") || "demo-user";
    const db = await readDb();
    sendJson(res, 200, { ok: true, progress: getProgress(db, userId) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/vocabulary") {
    const userId = url.searchParams.get("userId") || "demo-user";
    const level = url.searchParams.get("level") || "N2";
    const db = await readDb();
    sendJson(res, 200, { ok: true, vocabulary: await vocabularyPayload(db, userId, level) });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/grammar") {
    const userId = url.searchParams.get("userId") || "demo-user";
    const level = url.searchParams.get("level") || "N5";
    const db = await readDb();
    sendJson(res, 200, { ok: true, grammar: await grammarPayload(db, userId, level) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/grammar/answer") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const grammarId = String(body.grammarId || "");
    const correct = Boolean(body.correct);
    const completed = body.completed !== false && correct;
    const db = await readDb();
    const progress = getProgress(db, userId);
    const record = progress.grammar[grammarId] || { attempts: 0, correct: 0, completed: false };
    record.attempts += 1;
    if (correct) record.correct += 1;
    if (completed || record.correct >= 1) record.completed = true;
    record.lastAnsweredAt = new Date().toISOString();
    progress.grammar[grammarId] = record;
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, {
      ok: true,
      grammarId,
      record,
      progress,
      message: correct ? "答对了，这个语法点已标记为学会。" : "还差一点，先看接续和例句再试。",
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/vocabulary/answer") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const wordId = String(body.wordId || "");
    const correct = Boolean(body.correct);
    const db = await readDb();
    const progress = getProgress(db, userId);
    const record = progress.vocabulary[wordId] || { attempts: 0, correct: 0, mastered: false };
    record.attempts += 1;
    if (correct) record.correct += 1;
    if (correct && record.correct >= 2) record.mastered = true;
    record.lastAnsweredAt = new Date().toISOString();
    progress.vocabulary[wordId] = record;
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, {
      ok: true,
      wordId,
      record,
      progress,
      message: correct ? "答对了，连续答对两次会自动标记掌握。" : "再复习一下读音和例句。",
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/vocabulary/master") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const wordId = String(body.wordId || "");
    const mastered = body.mastered !== false;
    const db = await readDb();
    const progress = getProgress(db, userId);
    const record = progress.vocabulary[wordId] || { attempts: 0, correct: 0, mastered: false };
    record.mastered = mastered;
    record.lastAnsweredAt = new Date().toISOString();
    progress.vocabulary[wordId] = record;
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { ok: true, wordId, record, progress, message: mastered ? "已标记掌握。" : "已放回复习。" });
    return true;
  }

  if (req.method === "PATCH" && url.pathname === "/api/progress") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const db = await readDb();
    const progress = getProgress(db, userId);
    for (const key of ["level", "activeModule", "completedModule"]) {
      if (typeof body[key] === "string") progress[key] = body[key];
    }
    if (typeof body.checkedIn === "boolean") progress.checkedIn = body.checkedIn;
    if (typeof body.streakDays === "number") progress.streakDays = body.streakDays;
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { ok: true, progress });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/progress/reset") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const db = await readDb();
    db.progress[userId] = {
      level: "N2",
      activeModule: "单词",
      completedModule: "",
      checkedIn: false,
      streakDays: 0,
      quiz: {},
      vocabulary: {},
      grammar: {},
      updatedAt: new Date().toISOString(),
    };
    await writeDb(db);
    sendJson(res, 200, { ok: true, progress: db.progress[userId], message: "进度已重置。" });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/checkin") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const db = await readDb();
    const progress = getProgress(db, userId);
    if (!progress.checkedIn) progress.streakDays = Number(progress.streakDays || 0) + 1;
    progress.checkedIn = true;
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { ok: true, progress, message: "打卡成功，连续天数 +1" });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/quiz/answer") {
    const body = await readBody(req);
    const userId = body.userId || "demo-user";
    const quizId = body.quizId || "grammarN2Q04";
    const answer = String(body.answer || "");
    const quiz = quizAnswers[quizId];
    if (!quiz) {
      sendJson(res, 404, { ok: false, message: "题目不存在。" });
      return true;
    }
    const correct = answer === quiz.correct;
    const db = await readDb();
    const progress = getProgress(db, userId);
    progress.quiz[quizId] = { answer, correct, answeredAt: new Date().toISOString() };
    progress.updatedAt = new Date().toISOString();
    await writeDb(db);
    sendJson(res, 200, { ok: true, correct, message: correct ? quiz.explanation : quiz.hint, progress });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/stats") {
    const db = await readDb();
    const progressValues = Object.values(db.progress);
    const checkedInCount = progressValues.filter((item) => item.checkedIn).length;
    sendJson(res, 200, {
      ok: true,
      users: db.users.length,
      progressRecords: progressValues.length,
      checkedInCount,
    });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/debug/vocabulary") {
    const vocabulary = await readVocabulary();
    sendJson(res, 200, {
      ok: true,
      cwd: process.cwd(),
      vocabularyFile: VOCABULARY_FILE,
      n5Count: (vocabulary.N5 || []).length,
    });
    return true;
  }

  return false;
}

async function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const safePath = path.normalize(path.join(ROOT, pathname));
  if (!safePath.startsWith(ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(safePath);
    const filePath = stat.isDirectory() ? path.join(safePath, "index.html") : safePath;
    const ext = path.extname(filePath).toLowerCase();
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    sendText(res, 404, "Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) sendJson(res, 404, { ok: false, message: "API 不存在。" });
      return;
    }
    await serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message });
  }
});

ensureDb().then(() => {
  server.listen(PORT, HOST, () => {
    process.stdout.write(`Nihongo Loop running at http://${HOST}:${PORT}\n`);
  });
});
