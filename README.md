# Photonics & Electronics Club（PEC）

> 大学生光电科技协会官方网站项目

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Status](https://img.shields.io/badge/status-WIP-orange)]()
[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro)]()
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono)]()

## ✨ 项目简介

PEC 协会的官方门户网站，当前核心使命是对外宣传：

1. 展示协会风采、竞赛方向、活动、项目与招新信息。
2. 通过开屏流线、电路、粒子和数据视觉建立光电与工程气质。

设备状态和物品留言保留为后续可选模块；飞书资料与 NAS 文件继续在协会内部访问。

## 🏗️ 技术架构

```
GitHub Pages（前端） ─→ Cloudflare Tunnel ─→ 群晖 SA6400（后端 + DB）
                                                  │
                                                  ├─ 拓竹打印机 A1/X2D（MQTT）
                                                  └─ 树莓派 ×N（HTTP 心跳）
```

当前公开站只使用 Astro 与 GitHub Pages。图中的后端链路是后续可选方案。

## 📚 设计与架构文档

- [架构与视觉演进路线图](docs/site-evolution-roadmap.md)：当前状态、视觉模块、扩展架构和逐阶段验收。
- [外部资源台账](docs/asset-catalog.md)：明日方舟资源、字体、图标和第三方素材的使用规则。
- [完整后端架构](docs/architecture.md)：群晖、设备状态和留言功能的可选技术方案。
- [品牌规范](docs/brand-spec.md)：品牌色、字体、动画和性能约束。

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
