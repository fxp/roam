# 问野/Roam · 操作手册

**定位**：AI 自主完成事情的展示空间。每个条目都是 AI Agent 在没有人类手把手干预下独立完成的任务成果。

> **仓库**: `github.com/fxp/roam`
> **线上地址**: `roam.xiaopingfeng.com`
> **部署**: GitHub Actions → Cloudflare Pages (project: `xpf-roam`)

---

## 1. 部署方式

```
git push origin main
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml)
        │
        ▼ npx wrangler pages deploy
Cloudflare Pages (project: xpf-roam)
        │
        ▼
roam.xiaopingfeng.com
```

**必要的 GitHub Secrets**（Settings → Secrets → Actions）：

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token，需有 Pages Edit 权限 |
| `CLOUDFLARE_ACCOUNT_ID` | `0356d59ccdcff356bf3bbdb580bbaa60` |

**自定义域名**：在 Cloudflare Pages 项目 `xpf-roam` 的 Custom domains 里添加 `roam.xiaopingfeng.com`，Cloudflare 会自动添加 DNS 记录。

---

## 2. Repo 结构

```
roam/
├── CLAUDE.md                 # 本文件
├── index.html                # 主页（任务列表 + 空间介绍）
├── bot-dream/                # Bot Dream 实验室（日历式日志）
│   ├── index.html            # 日历主页（GitHub contributions 风格）
│   ├── experiments.json      # 实验清单（每次发布必须更新）
│   ├── seventeen-nights.html # 「十七个深夜」完整记录
│   ├── lab.html              # 实验室浏览器
│   ├── nights/               # 实验 HTML 文件（YYYY-MM-DD-slug.html）
│   └── screenshots/          # 实验截图（YYYY-MM-DD-slug.png）
├── <slug>/                   # 其他任务详情页
│   └── index.html
└── .github/
    └── workflows/
        └── deploy.yml
```

### Bot Dream 发布流程

Bot Dream 日历由 `experiments.json` 驱动，**无需修改 `index.html`**。发布新实验：

1. 把实验文件放到 `bot-dream/nights/YYYY-MM-DD-slug.html`
2. （可选）把截图放到 `bot-dream/screenshots/YYYY-MM-DD-slug.png`
3. 在 `bot-dream/experiments.json` 末尾追加一个 JSON 条目
4. `git push` → 自动部署

详见 Skill：`/bot-dream-push`

---

## 3. 添加新任务

1. 在 `index.html` 的"近期任务"区域加一个 `.task-card`：

```html
<div class="task-card">
  <div class="task-meta">
    <span class="task-tag ai">AI</span>
    <span>2026-05-XX</span>
  </div>
  <div class="task-title">任务名称</div>
  <div class="task-summary">一两句话描述任务目标和结果。</div>
  <div class="task-footer">
    <span>执行者: Claude Sonnet</span>
    <span class="task-arrow">查看详情 →</span>
  </div>
</div>
```

2. （可选）在 `tasks/<slug>/index.html` 创建详细页，记录过程日志和 Agent 判断依据。

3. `git push` 自动触发部署。

---

## 4. 相关 Repo

| Repo | 职责 |
|---|---|
| `fxp/roam`（本 repo） | 问野空间内容 + 部署 |
| `fxp/xiaopingfeng-site` | 主站首页（问野入口链接在那里） |
