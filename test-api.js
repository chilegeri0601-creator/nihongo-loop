const assert = require("node:assert/strict");

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8787";
const email = `test-${Date.now()}@nihongo.loop`;
const password = "test123456";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  assert.equal(response.ok, true, `${path} returned ${response.status}: ${text}`);
  assert.notEqual(data.ok, false, `${path} returned ok=false: ${text}`);
  return data;
}

async function requestExpect(path, status, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  assert.equal(response.status, status, `${path} expected ${status}, got ${response.status}: ${text}`);
  return data;
}

async function main() {
  const health = await request("/api/health");
  assert.equal(health.service, "nihongo-loop");

  const html = await fetch(`${BASE_URL}/`);
  assert.equal(html.status, 200);
  const htmlText = await html.text();
  assert.match(htmlText, /Nihongo Loop/);
  assert.match(htmlText, /script\.js/);
  assert.match(htmlText, /login\.html\?mode=login/);
  assert.doesNotMatch(htmlText, /class="auth-panel" aria-label="账号表单"/);
  assert.match(htmlText, /reading\.html/);
  assert.match(htmlText, /listening\.html/);
  assert.match(htmlText, /exam\.html/);

  const loginPage = await fetch(`${BASE_URL}/login.html`);
  assert.equal(loginPage.status, 200);
  const loginPageText = await loginPage.text();
  assert.match(loginPageText, /登录/);
  assert.match(loginPageText, /忘记密码/);
  assert.match(loginPageText, /找回验证码/);
  assert.match(loginPageText, /login\.js/);
  assert.match(loginPageText, /desk-dog/);

  const loginScript = await fetch(`${BASE_URL}/login.js`);
  assert.equal(loginScript.status, 200);
  const loginScriptText = await loginScript.text();
  assert.ok(loginScriptText.includes("/api/auth/login"));
  assert.ok(loginScriptText.includes("/api/auth/register"));
  assert.ok(loginScriptText.includes("/api/auth/forgot-password"));
  assert.ok(loginScriptText.includes("/api/auth/reset-password"));

  const vocabPage = await fetch(`${BASE_URL}/vocabulary.html`);
  assert.equal(vocabPage.status, 200);
  const vocabPageText = await vocabPage.text();
  assert.match(vocabPageText, /单词学习/);
  assert.match(vocabPageText, /错题本/);
  assert.match(vocabPageText, /vocabulary\.js/);
  assert.match(vocabPageText, /test\.html\?type=vocabulary/);

  const vocabScript = await fetch(`${BASE_URL}/vocabulary.js`);
  assert.equal(vocabScript.status, 200);
  const vocabScriptText = await vocabScript.text();
  assert.match(vocabScriptText, /speechSynthesis/);
  assert.doesNotMatch(vocabScriptText, /data-quiz-mode/);
  assert.doesNotMatch(vocabScriptText, /data-answer/);
  assert.match(vocabScriptText, /vocab-list-panel/);
  assert.match(vocabScriptText, /vocabMistakes/);
  assert.match(vocabScriptText, /wrongCount/);
  assert.match(vocabScriptText, /unitTestHref/);
  assert.match(vocabScriptText, /学习完啦/);
  assert.match(vocabScriptText, /本单元待复习/);
  assert.match(vocabScriptText, /本单元单词学习完成/);

  const grammarPage = await fetch(`${BASE_URL}/grammar.html`);
  assert.equal(grammarPage.status, 200);
  const grammarPageText = await grammarPage.text();
  assert.match(grammarPageText, /语法学习/);
  assert.match(grammarPageText, /grammar\.js/);
  assert.match(grammarPageText, /test\.html\?type=grammar/);

  const grammarScript = await fetch(`${BASE_URL}/grammar.js`);
  assert.equal(grammarScript.status, 200);
  const grammarScriptText = await grammarScript.text();
  assert.match(grammarScriptText, /data-grammar-level/);
  assert.match(grammarScriptText, /data-grammar-category/);
  assert.doesNotMatch(grammarScriptText, /data-grammar-answer/);

  for (const [page, title] of [
    ["reading.html", "阅读学习"],
    ["listening.html", "听力学习"],
    ["exam.html", "等级考试模拟"],
  ]) {
    const featurePage = await fetch(`${BASE_URL}/${page}`);
    assert.equal(featurePage.status, 200);
    const featurePageText = await featurePage.text();
    assert.match(featurePageText, new RegExp(title));
    assert.match(featurePageText, /feature\.js/);
    assert.match(featurePageText, /data-feature-level/);
    assert.match(featurePageText, /进入测验/);
  }

  const featureScript = await fetch(`${BASE_URL}/feature.js`);
  assert.equal(featureScript.status, 200);
  const featureScriptText = await featureScript.text();
  assert.match(featureScriptText, /data\/features\.json/);
  assert.match(featureScriptText, /test\.html\?type=/);
  assert.match(featureScriptText, /speechSynthesis/);
  assert.match(featureScriptText, /data-feature-audio/);
  assert.doesNotMatch(featureScriptText, /data-feature-answer/);

  const testPage = await fetch(`${BASE_URL}/test.html?type=vocabulary&level=N5`);
  assert.equal(testPage.status, 200);
  const testPageText = await testPage.text();
  assert.match(testPageText, /test\.js/);
  assert.match(testPageText, /这里只做测验/);

  const testScript = await fetch(`${BASE_URL}/test.js`);
  assert.equal(testScript.status, 200);
  const testScriptText = await testScript.text();
  assert.match(testScriptText, /typeMeta/);
  assert.match(testScriptText, /data-test-answer/);
  assert.match(testScriptText, /speechSynthesis/);
  assert.match(testScriptText, /data-play-audio/);
  assert.match(testScriptText, /\/api\/vocabulary\/answer/);
  assert.match(testScriptText, /\/api\/grammar\/answer/);
  assert.match(testScriptText, /data\/features\.json/);
  assert.match(testScriptText, /vocabularyUnitRange/);
  assert.match(testScriptText, /本单元背会/);
  assert.match(testScriptText, /查看错题本/);

  const featureData = await fetch(`${BASE_URL}/data/features.json`);
  assert.equal(featureData.status, 200);
  const featureDataJson = await featureData.json();
  assert.ok(featureDataJson.reading.levels.N5.length >= 1);
  assert.ok(featureDataJson.listening.levels.N5.length >= 1);
  assert.ok(featureDataJson.exam.levels.N5.length >= 1);

  const registered = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName: "测试用户" }),
  });
  assert.equal(registered.user.email, email);
  assert.equal(registered.user.displayName, "测试用户");
  assert.equal(registered.progress.checkedIn, false);
  assert.equal(registered.progress.streakDays, 0);
  assert.equal(registered.progress.lastCheckinDate, "");
  const userId = registered.user.id;

  const duplicateWrongPassword = await requestExpect("/api/auth/register", 409, {
    method: "POST",
    body: JSON.stringify({ email, password: "wrong-password" }),
  });
  assert.match(duplicateWrongPassword.message, /已经注册/);

  const duplicateSamePassword = await requestExpect("/api/auth/register", 409, {
    method: "POST",
    body: JSON.stringify({ email, password, displayName: "重复用户" }),
  });
  assert.match(duplicateSamePassword.message, /已经注册/);

  const badLogin = await requestExpect("/api/auth/login", 401, {
    method: "POST",
    body: JSON.stringify({ email, password: "wrong-password" }),
  });
  assert.match(badLogin.message, /邮箱或密码/);

  const loggedIn = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  assert.equal(loggedIn.user.id, userId);
  assert.ok(loggedIn.user.lastLoginAt);

  const me = await request(`/api/me?userId=${encodeURIComponent(userId)}`);
  assert.equal(me.user.email, email);

  const unknownForgot = await requestExpect("/api/auth/forgot-password", 404, {
    method: "POST",
    body: JSON.stringify({ email: `missing-${Date.now()}@nihongo.loop` }),
  });
  assert.match(unknownForgot.message, /没有找到/);

  const forgot = await request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  assert.match(forgot.resetCode, /^\d{6}$/);

  const badReset = await requestExpect("/api/auth/reset-password", 400, {
    method: "POST",
    body: JSON.stringify({ email, code: "000000", password: "newpass123" }),
  });
  assert.match(badReset.message, /验证码/);

  const resetPassword = await request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code: forgot.resetCode, password: "newpass123" }),
  });
  assert.equal(resetPassword.user.id, userId);

  const oldPasswordLogin = await requestExpect("/api/auth/login", 401, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  assert.match(oldPasswordLogin.message, /邮箱或密码/);

  const newPasswordLogin = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: "newpass123" }),
  });
  assert.equal(newPasswordLogin.user.id, userId);

  const patched = await request("/api/progress", {
    method: "PATCH",
    body: JSON.stringify({ userId, level: "N1", activeModule: "阅读" }),
  });
  assert.equal(patched.progress.level, "N1");
  assert.equal(patched.progress.activeModule, "阅读");

  const checkin = await request("/api/checkin", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  assert.equal(checkin.progress.checkedIn, true);
  assert.equal(checkin.progress.streakDays, 1);
  assert.match(checkin.progress.lastCheckinDate, /^\d{4}-\d{2}-\d{2}$/);

  const sameDayCheckin = await request("/api/checkin", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  assert.equal(sameDayCheckin.progress.checkedIn, true);
  assert.equal(sameDayCheckin.progress.streakDays, 1);
  assert.equal(sameDayCheckin.progress.lastCheckinDate, checkin.progress.lastCheckinDate);

  const vocabulary = await request(`/api/vocabulary?userId=${encodeURIComponent(userId)}&level=N2`);
  assert.equal(vocabulary.vocabulary.level, "N2");
  assert.ok(vocabulary.vocabulary.words.length >= 30);
  const firstWord = vocabulary.vocabulary.words[0];

  const n5Vocabulary = await request(`/api/vocabulary?userId=${encodeURIComponent(userId)}&level=N5`);
  assert.equal(n5Vocabulary.vocabulary.level, "N5");
  assert.ok(n5Vocabulary.vocabulary.words.length >= 800);

  for (const [level, minimum] of [
    ["N4", 180],
    ["N3", 35],
    ["N2", 30],
    ["N1", 30],
  ]) {
    const levelVocabulary = await request(`/api/vocabulary?userId=${encodeURIComponent(userId)}&level=${level}`);
    assert.equal(levelVocabulary.vocabulary.level, level);
    assert.ok(levelVocabulary.vocabulary.words.length >= minimum);
  }

  const n5Grammar = await request(`/api/grammar?userId=${encodeURIComponent(userId)}&level=N5`);
  assert.equal(n5Grammar.grammar.level, "N5");
  assert.ok(n5Grammar.grammar.points.length >= 6);
  assert.ok(n5Grammar.grammar.categories.includes("助词"));

  const n1Grammar = await request(`/api/grammar?userId=${encodeURIComponent(userId)}&level=N1`);
  assert.equal(n1Grammar.grammar.level, "N1");
  assert.ok(n1Grammar.grammar.points.length >= 3);

  const grammarAnswer = await request("/api/grammar/answer", {
    method: "POST",
    body: JSON.stringify({ userId, grammarId: n5Grammar.grammar.points[0].id, correct: true }),
  });
  assert.equal(grammarAnswer.record.completed, true);

  const vocabWrong = await request("/api/vocabulary/answer", {
    method: "POST",
    body: JSON.stringify({ userId, wordId: firstWord.id, correct: false }),
  });
  assert.equal(vocabWrong.record.attempts, 1);
  assert.equal(vocabWrong.record.mastered, false);

  const vocabularyAfterWrong = await request(`/api/vocabulary?userId=${encodeURIComponent(userId)}&level=N2`);
  const wrongWordRecord = vocabularyAfterWrong.vocabulary.words.find((word) => word.id === firstWord.id);
  assert.equal(wrongWordRecord.attempts, 1);
  assert.equal(wrongWordRecord.correct, 0);

  await request("/api/vocabulary/answer", {
    method: "POST",
    body: JSON.stringify({ userId, wordId: firstWord.id, correct: true }),
  });
  const vocabCorrect = await request("/api/vocabulary/answer", {
    method: "POST",
    body: JSON.stringify({ userId, wordId: firstWord.id, correct: true }),
  });
  assert.equal(vocabCorrect.record.mastered, true);

  const vocabUnmastered = await request("/api/vocabulary/master", {
    method: "POST",
    body: JSON.stringify({ userId, wordId: firstWord.id, mastered: false }),
  });
  assert.equal(vocabUnmastered.record.mastered, false);

  const quiz = await request("/api/quiz/answer", {
    method: "POST",
    body: JSON.stringify({ userId, quizId: "grammarN2Q04", answer: "ようだ" }),
  });
  assert.equal(quiz.correct, true);

  const reset = await request("/api/progress/reset", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  assert.equal(reset.progress.level, "N2");
  assert.equal(reset.progress.checkedIn, false);
  assert.equal(reset.progress.streakDays, 0);
  assert.equal(reset.progress.lastCheckinDate, "");

  const stats = await request("/api/stats");
  assert.equal(typeof stats.users, "number");

  process.stdout.write("API checks passed\n");
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
