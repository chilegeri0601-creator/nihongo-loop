# Nihongo Loop 部署与协作指南

这份文档用于把项目上传到 GitHub，并部署到自己的服务器。

## 1. 本地发布前检查

在项目目录运行：

```bash
npm run check
npm test
```

确认输出包含：

```text
API checks passed
```

## 2. 初始化 Git 仓库

如果电脑还没有安装 Git，先安装：

```text
https://git-scm.com/downloads
```

安装后，在项目目录运行：

```bash
git init
git status
git add .
git commit -m "Release Nihongo Loop v1.0.0"
```

注意：`data/db.json` 是本地用户数据，已经写入 `.gitignore`，不要上传。

## 3. 上传到 GitHub

推荐安装 GitHub CLI：

```text
https://cli.github.com/
```

登录：

```bash
gh auth login
```

创建私有仓库并推送：

```bash
gh repo create nihongo-loop --private --source . --remote origin --push
```

如果你想创建公开仓库，把 `--private` 改成 `--public`。

如果不用 GitHub CLI，也可以在 GitHub 网页新建仓库，然后运行：

```bash
git remote add origin https://github.com/你的用户名/nihongo-loop.git
git branch -M main
git push -u origin main
```

## 4. 服务器部署

服务器需要 Node.js 18 或更新版本。

上传代码后进入项目目录：

```bash
npm install
HOST=0.0.0.0 PORT=8787 npm start
```

如果服务器使用 Windows PowerShell：

```powershell
$env:HOST="0.0.0.0"
$env:PORT="8787"
npm start
```

浏览器访问：

```text
http://服务器IP:8787
```

## 5. 使用 PM2 常驻运行

安装 PM2：

```bash
npm install -g pm2
```

启动：

```bash
npm run pm2:start
pm2 save
```

查看运行状态：

```bash
pm2 status
npm run pm2:logs
```

更新代码后重启：

```bash
git pull
npm run pm2:restart
```

设置开机自启：

```bash
pm2 startup
```

按照命令提示执行生成的那一行命令。

## 6. Nginx 反向代理

如果你有域名，可以用 Nginx 转发到 Node 服务：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 7. 协作建议

- `main` 分支只放稳定版本。
- 每次新增功能时创建新分支，例如 `feature/vocabulary-mistakes`。
- 功能完成后提交 Pull Request。
- 合并前运行 `npm run check` 和 `npm test`。
- 不要提交 `data/db.json`，避免泄露账号和学习记录。

## 8. 数据备份

正式上线后，定期备份：

```text
data/db.json
```

这个文件保存注册账号、学习进度、打卡、答题记录和错题本状态。
