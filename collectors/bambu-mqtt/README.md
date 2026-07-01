# Bambu MQTT Collector

> 拓竹 A1 / X2D 状态采集器，**Phase 2 实现**

## 职责

订阅拓竹打印机 LAN Mode MQTT，将 `IDLE / PRINTING / OFFLINE` 状态推送到 `@pec/api` 的 `/api/devices/:id/state` 端点。

## LAN Mode 准备

在打印机屏幕上：
1. 设置 → 通用 → 工作站模式 → **本地 (LAN Only)**
2. 设置 → 网络 → 记录 **IP 地址**
3. 设置 → 通用 → **访问码**（8 位数字）
4. 机身底部贴纸找到 **序列号 (Serial Number)**

将以上三项填入根目录 `apps/api/.env` 的 `BAMBU_*` 字段。

## MQTT 主题

- **订阅**：`device/{serial}/report`（每秒一次状态推送）
- **认证**：用户名 `bblp`，密码 = 访问码，TLS 8883 端口
- **关键字段**：`print.gcode_state` → `IDLE / RUNNING / PAUSE / FAILED / FINISH`

## 状态映射

| Bambu gcode_state | PEC DeviceStatus |
|-------------------|------------------|
| IDLE              | idle             |
| RUNNING           | busy             |
| PAUSE             | busy             |
| FAILED / FINISH   | idle             |
| (连接超时 30s)    | offline          |

详见 [拓竹官方 MQTT 文档](https://github.com/Doridian/OpenBambuAPI) 社区整理。
