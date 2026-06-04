# Nihongo Loop 日语学习网页

Nihongo Loop 是一个面向 JLPT N1-N5 学习者的日语学习网页应用，包含登录注册、打卡、单词、语法、阅读、听力、等级考试模拟、独立测验和单词错题本。

## 运行方式

推荐直接运行网页版服务：

```bash
npm start
```

然后在浏览器打开：

```text
http://127.0.0.1:8787
```

Windows 也可以双击：

```text
start-web.bat
```

如果电脑没有安装 npm，但有 Node.js，也可以运行：

```bash
node server.js
```

## 演示账号

```text
邮箱：demo@nihongo.loop
密码：demo123456
```

也可以在登录页直接注册新账号。注册信息、学习进度、打卡、单词答题记录、语法答题记录都会保存到：

```text
data/db.json
```

## 功能清单

- 独立登录页和注册流程
- 忘记密码、验证码找回和重置密码
- 登录后首页展示学习模块和进度
- 每日打卡
- N1-N5 等级切换
- 单词学习、发音、单词表、独立测验、错题本
- 语法学习，按 N1-N5 和分类拆分
- 阅读、听力、等级考试模拟独立学习页
- 听力学习和听力测验音频播放
- 所有测验统一进入独立测验页
- 后端 API 保存账号和学习记录
- 响应式网页布局

## 开发检查

检查 JavaScript 语法：

```bash
npm run check
```

启动服务后运行完整接口和页面检查：

```bash
npm test
```

## 版本管理和部署

GitHub 上传、服务器部署、PM2 常驻运行、Nginx 反向代理请看：

```text
DEPLOY.md
```

发布前检查请看：

```text
RELEASE_CHECKLIST.md
```

版本记录请看：

```text
CHANGELOG.md
```

## 发布提醒

`data/db.json` 是本地用户数据文件，已经加入 `.gitignore`。如果要把项目发给别人或上传到代码平台，不要把自己的 `data/db.json` 一起发布。

这个项目当前使用 Node.js 内置 HTTP 服务，不依赖第三方 npm 包。部署到服务器时，将项目目录上传后运行：

```bash
HOST=0.0.0.0 PORT=8787 npm start
```

服务器开放对应端口后，即可通过服务器地址访问网页。
