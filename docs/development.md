# 开发指南

## 环境要求

| 软件 | 版本 | 备注 |
|------|------|------|
| Node.js | ≥ 22 LTS | 后端用了原生 fetch / WebStreams |
| pnpm | ≥ 9 | 包管理器（**不要用 npm/yarn**） |
| Git | 任意 | 版本控制 |
| Docker（可选） | ≥ 24 | 本地模拟部署环境 |

### 安装 Node.js 22 + pnpm

```bash
# Windows（推荐用 nvm-windows）
nvm install 22
nvm use 22

# 启用 pnpm（Node 22 内置 corepack）
corepack enable
corepack prepare pnpm@9.15.0 --activate

# 验证
node --version  # v22.x.x
pnpm --version  # 9.15.0
```

## 项目初始化

```bash
cd D:\Download\光电网站

# 安装全部依赖（monorepo 一次性）
pnpm install
```

## 本地开发

### 启动前端（Astro）

```bash
pnpm dev:web
# → http://localhost:4321
```

### 启动后端（Hono）

```bash
pnpm dev:api
# → http://localhost:3000
```

### 同时启动前后端

打开两个终端，分别运行上面两条命令即可。前端默认会代理 `/api/*` 到后端的 3000 端口。

## 项目结构详解

```
光电网站/
├─ apps/
│  ├─ web/                          # Astro 前端
│  │  ├─ src/
│  │  │  ├─ pages/                  # 路由（文件即路由）
│  │  │  │  ├─ index.astro          # 首页
│  │  │  │  ├─ team.astro           # 团队页
│  │  │  │  ├─ projects.astro       # 项目页
│  │  │  │  ├─ recruit.astro        # 招新页
│  │  │  │  ├─ devices.astro        # 设备状态页
│  │  │  │  └─ items/
│  │  │  │     ├─ index.astro       # 物品列表
│  │  │  │     └─ [id].astro        # 物品详情 + 留言
│  │  │  ├─ components/             # UI 组件
│  │  │  ├─ layouts/                # 页面布局
│  │  │  ├─ styles/                 # 全局样式
│  │  │  └─ assets/                 # 静态资源
│  │  ├─ public/                    # 直接复制到根的静态文件
│  │  ├─ astro.config.mjs           # Astro 配置
│  │  └─ package.json
│  │
│  └─ api/                          # Hono 后端
│     ├─ src/
│     │  ├─ index.ts                # 入口
│     │  ├─ routes/                 # API 路由
│     │  │  ├─ devices.ts
│     │  │  ├─ items.ts
│     │  │  ├─ messages.ts
│     │  │  └─ admin.ts
│     │  ├─ db/                     # 数据库
│     │  │  ├─ schema.ts            # Drizzle schema
│     │  │  └─ index.ts             # 数据库连接
│     │  └─ services/               # 业务逻辑
│     │     ├─ auth.ts
│     │     └─ sse.ts
│     ├─ drizzle.config.ts
│     └─ package.json
│
├─ collectors/
│  ├─ bambu-mqtt/                   # 拓竹采集器
│  │  ├─ src/index.ts
│  │  └─ package.json
│  └─ pi-agent/                     # 树莓派客户端
│     ├─ pi-agent.sh                # 心跳脚本
│     └─ pi-agent.service           # systemd 单元
│
├─ packages/
│  └─ shared/                       # 前后端共享类型
│     ├─ src/
│     │  ├─ types/
│     │  │  ├─ device.ts
│     │  │  ├─ item.ts
│     │  │  └─ message.ts
│     │  └─ index.ts
│     └─ package.json
│
├─ docs/                            # 文档
├─ docker-compose.yml               # 部署配置
└─ package.json                     # 根 package
```

## 编码规范

### 命名

- **文件名**：kebab-case（`device-card.astro`）
- **组件名**：PascalCase（`DeviceCard`）
- **变量/函数**：camelCase（`getDeviceStatus`）
- **常量**：UPPER_SNAKE_CASE（`MAX_MESSAGE_LENGTH`）
- **数据库表/列**：snake_case（`device_states`、`created_at`）

### 注释语言

**中文**为主。所有面向协会成员维护的代码必须有中文注释。仅依赖标识符和库 API 注释可用英文。

### TypeScript

- **必须开 strict 模式**
- 不允许 `any`，必须用 `unknown` 或具体类型
- 前后端共享类型放 `packages/shared`

### Git Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
<类型>(<范围>): <主题>

类型：
- feat:     新功能
- fix:      修复 bug
- docs:     文档变更
- style:    格式（不影响代码运行）
- refactor: 重构
- perf:     性能优化
- test:     测试
- chore:    构建/工具链
- arch:     架构变更（自定义类型，必须同步更新 docs/architecture.md）

例：
feat(web): 添加设备状态卡片组件
fix(api): 修复留言重复提交问题
arch(api): 设备状态从轮询改为 MQTT 订阅
```

## 测试

```bash
# 类型检查
pnpm typecheck

# 单元测试（Vitest）
pnpm test

# E2E 测试（Playwright，可选）
pnpm test:e2e
```

## 调试技巧

### 后端调试

- 启动时设置 `DEBUG=pec:*` 环境变量看详细日志
- 数据库 inspect：`pnpm --filter @pec/api db:studio`（Drizzle Studio）

### 拓竹 MQTT 调试

- 在打印机屏幕开启 LAN Mode，记录 IP 和 Access Code
- 用 [MQTT Explorer](http://mqtt-explorer.com/) 直连验证
- 主题格式：`device/{serial}/report`

### 前端调试

- Astro 自带 HMR，改文件即生效
- React/Vue 岛屿组件的 devtools 自动可用

## 常见问题

### Q: pnpm install 报错 `ERR_PNPM_PEER_DEP_ISSUES`

A: 删 `node_modules` 和 `pnpm-lock.yaml`，重装。

### Q: Astro 编译报 `Cannot find module '@pec/shared'`

A: workspace 链接没建好，运行 `pnpm install` 即可。

### Q: 后端启动报端口占用

A: 改 `apps/api/.env` 里的 `PORT`，前端代理同步改 `apps/web/astro.config.mjs`。
