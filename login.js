const authForm = document.querySelector("#authForm");
const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authSubmit = document.querySelector("#authSubmit");
const authNote = document.querySelector("#authNote");
const accountLabel = document.querySelector("#accountLabel");
const toast = document.querySelector("#toast");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8787" : "";

let toastTimer;
const initialMode = new URLSearchParams(window.location.search).get("mode");
let currentMode = initialMode === "register" || initialMode === "forgot" || initialMode === "reset" ? initialMode : "login";
const savedState = JSON.parse(localStorage.getItem("nihongoLoopState") || "{}");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
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

function setAuthMode(mode) {
  currentMode = mode;
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  authForm.classList.toggle("is-login", isLogin);
  authForm.classList.toggle("is-register", isRegister);
  authForm.classList.toggle("is-forgot", isForgot);
  authForm.classList.toggle("is-reset", isReset);
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authTab === mode);
  });
  if (isForgot) {
    authTitle.textContent = "找回密码";
    authSubtitle.textContent = "输入注册邮箱，生成本地演示验证码";
    authSubmit.textContent = "获取找回验证码";
    authNote.textContent = "当前为本地原型，验证码会直接显示在页面里。";
  } else if (isReset) {
    authTitle.textContent = "设置新密码";
    authSubtitle.textContent = "输入验证码和新密码，完成后自动登录";
    authSubmit.textContent = "重置密码并登录";
    authNote.textContent = "验证码 15 分钟内有效。";
  } else {
    authTitle.textContent = isLogin ? "欢迎回来" : "创建学习账号";
    authSubtitle.textContent = isLogin ? "登录后继续今天的日语学习任务" : "注册后同步打卡、错题和等级进度";
    authSubmit.textContent = isLogin ? "登录并继续学习" : "注册并生成计划";
    authNote.textContent = isLogin ? "可以使用 demo@nihongo.loop / demo123456 体验。" : "注册成功后会自动回到首页。";
  }
  const url = new URL(window.location.href);
  url.searchParams.set("mode", mode);
  window.history.replaceState({}, "", url);
}

function updateAccountLabel(user) {
  const display = user || localStorage.getItem("nihongoLoopUserEmail") || "演示用户";
  accountLabel.textContent = `当前账号：${display}`;
}

document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab));
});

forgotPasswordButton.addEventListener("click", () => {
  setAuthMode("forgot");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const displayName = form.elements.displayName.value.trim();
  const email = form.elements.email.value.trim();
  const resetCode = form.elements.resetCode.value.trim();
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;
  const isLogin = currentMode === "login";
  const isForgot = currentMode === "forgot";
  const isReset = currentMode === "reset";

  if (!email) {
    authNote.textContent = "请先填写邮箱。";
    showToast(authNote.textContent);
    return;
  }
  if (isForgot) {
    authSubmit.disabled = true;
    authSubmit.textContent = "正在生成验证码...";
    try {
      const data = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      form.elements.resetCode.value = data.resetCode;
      setAuthMode("reset");
      authNote.textContent = `${data.message} 演示验证码：${data.resetCode}`;
      showToast("验证码已生成");
    } catch (error) {
      authNote.textContent = error.message || "找回失败，请稍后再试。";
      showToast(authNote.textContent);
    }
    authSubmit.disabled = false;
    authSubmit.textContent = "重置密码并登录";
    return;
  }
  if (!password) {
    authNote.textContent = "请填写密码。";
    showToast(authNote.textContent);
    return;
  }
  if (isReset && !resetCode) {
    authNote.textContent = "请填写找回验证码。";
    showToast(authNote.textContent);
    return;
  }
  if (!isLogin) {
    if (!isReset && !displayName) {
      authNote.textContent = "请填写昵称，方便保存你的学习档案。";
      showToast(authNote.textContent);
      return;
    }
    if (password.length < 6) {
      authNote.textContent = "密码至少需要 6 位。";
      showToast(authNote.textContent);
      return;
    }
    if (password !== confirmPassword) {
      authNote.textContent = "两次输入的密码不一致。";
      showToast(authNote.textContent);
      return;
    }
  }

  authSubmit.disabled = true;
  authSubmit.textContent = isReset ? "正在重置..." : isLogin ? "正在登录..." : "正在注册...";
  try {
    const data = await apiRequest(isReset ? "/api/auth/reset-password" : isLogin ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ displayName, email, password, code: resetCode }),
    });
    localStorage.setItem("nihongoLoopUserId", data.user.id);
    localStorage.setItem("nihongoLoopUserEmail", data.user.displayName || data.user.email);
    Object.assign(savedState, data.progress);
    localStorage.setItem("nihongoLoopState", JSON.stringify(savedState));
    updateAccountLabel(data.user.displayName || data.user.email);
    authNote.textContent = isReset ? "密码已重置，正在返回首页。" : isLogin ? "登录成功，正在返回首页。" : "注册成功，正在返回首页。";
    showToast(authNote.textContent);
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 700);
  } catch (error) {
    authNote.textContent = error.message || (isLogin ? "登录失败，请检查邮箱和密码。" : "注册失败，请稍后再试。");
    showToast(authNote.textContent);
    authSubmit.disabled = false;
    authSubmit.textContent = isReset ? "重置密码并登录" : isLogin ? "登录并继续学习" : "注册并生成计划";
  }
});

setAuthMode(currentMode);
updateAccountLabel();
