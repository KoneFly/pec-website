# Photonics & Electronics Club（PEC）

> 大学生光电科技协会官方网站项目

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Status](https://img.shields.io/badge/status-WIP-orange)]()
[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro)]()
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono)]()

## ✨ 项目简介

PEC 协会的官方门户网站，承担两项核心使命：

1. **对外宣传**：展示协会风采、招新、活动回顾、获奖项目
2. **内部协作**：3D 打印机/树莓派实时状态展示、贵重物品借用留言系统

## 🏗️ 技术架构

```
GitHub Pages（前端） ─→ Cloudflare Tunnel ─→ 群晖 SA6400（后端 + DB）
                                                  │
                                                  ├─ 拓竹打印机 A1/X2D（MQTT）
                                                  └─ 树莓派 ×N（HTTP 心跳）
```

详见 [架构文档](docs/architecture.md)。

## 📦 Monorepo 结构

| 目录 | 描述 |
|------|------|
| [`apps/web`](apps/web) | Astro 前端（部署到 GitHub Pages） |
| [`apps/api`](apps/api) | Hono 后端（部署到群晖 Docker） |
| [`collectors/bambu-mqtt`](collectors/bambu-mqtt) | 拓竹打印机状态采集器 |
| [`collectors/pi-agent`](collectors/pi-agent) | 树莓派心跳客户端 |
| [`packages/shared`](packages/shared) | 前后端共享类型定义 |

## 🚀 快速开始

```bash
# 安装依赖（使用 pnpm，全 monorepo 一次性安装）
pnpm install

# 启动前端开发服务器
pnpm --filter @pec/web dev

# 启动后端开发服务器
pnpm --filter @pec/api dev
```

详见 [开发指南](docs/development.md)。

## 📋 开发进度

- [x] Phase 0: 项目骨架与文档
- [ ] Phase 1: 静态宣传站
- [ ] Phase 2: 设备状态采集与展示
- [ ] Phase 3: 贵重物品 + 留言系统
- [ ] Phase 4: 部署到群晖 + Cloudflare Tunnel
- [ ] Phase 5: 内容填充与联调

## 📄 License

MIT
