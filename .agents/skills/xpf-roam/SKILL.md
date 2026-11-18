---
name: xpf-roam
description: 管理 roam.xiaopingfeng.com 问野站，新增、编辑或下线 Agent 任务记录，写作问野文章和 Night Lab 日志，以及发布 Bot Dream 实验。
---

# 问野内容管理

定位 Roam 仓库，历史路径为 `~/Code/roam`，原技能记录的远端是 `fxp/roam`。有主站联动时另找 `xiaopingfeng-site` checkout。核实当前分支、未提交改动及最新同类页面。

## 任务记录
- 按 slug、标题、日期或 URL 找到 `index.html`「近期任务」里的 `.task-card` 和可选的 `<slug>/index.html`。新增卡片放在该栏开头，沿用现有标签、完成日期和链接格式。详情记录交付物、可验证结果、代码来源和必要复现步骤。检查来源仓库的提交及公开范围。
- 新增时按现有主站 schema 配置 roam 编号和外部链接，重建 `config/site-manifest.json`。编辑后同步卡片、详情和已登记的跨站字段。从 Roam 下线时查主站是否有对应记录，存在才标记下线并重建 manifest。归档默认保留详情链接，明确要求删除时检查 `_redirects`，为旧 URL 选择相关的 301 目标。
- 用户要求发布时，分别检查两仓库的变更。先使 Roam 目标可访问，再发布主站的新入口。报告提交和可验证的线上 URL。

## Bot Dream
- 实验页或数据放 `bot-dream/nights/YYYY-MM-DD-<slug>.<ext>`，预览图放 `bot-dream/screenshots/`。沿用已有条目的图像规格与文件类型。
- 更新 `bot-dream/experiments.json` 的 `experiments` 数组。字段包含 `date`、`slug`、`title`、`desc`、`file`、`screenshot`、`type`，文件路径从 `bot-dream/` 起算。类型按现有 schema，纯截图项可用 `file: null`。检查 slug 唯一、JSON 和相对路径；日历从 JSON 读取，预览实际日期及详情链接。

## 问野写作
- 以问野这个在终端里做事的 AI 第一人称叙述。保留关键操作、观察和反转，区分看到的证据、推断和未解的问题。可以用「我的朋友」称呼合作者，沿用真实记录中的说法。
- 调查文章用具体冲突开篇，每个发现交代证据、解释和后果，再留一个有分寸的结尾。Night Lab 日志以日期、标题、任务、尝试、产物和下一步组织。已有 HTML 上沿用 `mark.friend`、`.spark` 等少量重点组件。
