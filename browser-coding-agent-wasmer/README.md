# Browser Coding Agent × Wasmer

「在浏览器里跑 Coding Agent」系列之二。和 [① WebContainers 版](../browser-coding-agent/) 用同一个 agent 外壳（同一套工具、权限确认、收尾闸门），区别只在 `Bash` 工具背后的运行时：这一版用开源的 [Wasmer SDK](https://github.com/wasmerio/wasmer-sdk)（WASIX）。

| | ① WebContainers | ② Wasmer |
|---|---|---|
| 运行时 | StackBlitz 托管，闭源，从 stackblitz.com 加载 | 开源（MIT + 大用户量署名条款），本目录自带 `sdk/`，同源加载 |
| Shell / Node | jsh + Node 22，npm | bash + Node 24（Edge.js），pnpm（npm 装不了包），Python 按需 |
| 联网装包 | 开箱即用 | 要用户配一个 WISP 中继（`/wisp ws://…`） |
| 首次下载 | 运行时约几十 MB | bash + Node 约 90MB，Python 另约 59MB |
| 状态 | 已上线 | 开发中，SDK 是 alpha |

## 本地运行

需要页面带 `Cross-Origin-Opener-Policy: same-origin` 和 `Cross-Origin-Embedder-Policy: credentialless`（线上由仓库根目录的 `_headers` 提供）。任何带这两个头的静态服务都行。

## 目录里有什么

- `index.html`：页面，单文件。Bash 工具在文件中部 “Bash (optional)” 那一段。
- `sdk/`：[`@wasmer/sdk` 0.19.1](https://www.npmjs.com/package/@wasmer/sdk) 的浏览器构建（`dist/` + `pkg/`，约 5MB，主要是 wasm）。许可见 `sdk/LICENSE`（MIT，另有“月活超 100 万或月收入超 100 万美元的商业产品要在界面上显著标注 Wasmer”一条）；`pkg/snippets/*/acorn.*` 是 acorn（MIT）。

## 联网与许可的注意点

- 浏览器页面不能开 TCP 连接，`pnpm add` 要经过 WISP 中继（WebSocket 转 TCP）。没配中继时 Bash 会直接拒绝装包命令，不会卡住。
- WISP 客户端 `@mercuryworkshop/wisp-js` 的许可是 **AGPL-3.0**，所以**没有**放进本仓库，import map 从 jsDelivr（固定 0.4.1）加载，只在配置了 `/wisp` 之后才会用到。是否可以这样使用请自行确认。
- 中继能看到客户端要连的主机；本机起中继时只绑 127.0.0.1，且不要长期开着（任何网页都能连本机的 WebSocket）。默认配置会拒绝 `198.18.x.x` 这类 fake-IP DNS 结果，需要时加 `allow_private_ips`，这会放宽 SSRF 防护，用完就关。

## 已知限制（实测）

- 没有 git、grep、sed、awk、find、curl、npx；`npm install` 失败，用 pnpm。
- `node --test` 默认模式不能用，页面会自动改成 `--test-isolation=none`；`node x | tail` 这种管道里 node 当上游时输出为空，要先重定向到文件。
- vitest 5、mocha 12 跑不了；`node:test`、mocha 10 可以。
