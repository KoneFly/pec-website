#!/usr/bin/env bash
# =============================================
# PEC 树莓派心跳脚本
# 用法：systemd timer 每 30 秒触发一次
# 配置：/etc/profile.d/pec-agent.sh 提供 DEVICE_ID 和 API_URL
# =============================================
set -euo pipefail

: "${DEVICE_ID:?DEVICE_ID 未设置，例: export DEVICE_ID=pi-001}"
: "${API_URL:?API_URL 未设置，例: export API_URL=https://api.pec.example.com}"

# 采集本机指标
CPU=$(top -bn1 | awk '/Cpu\(s\)/ {print 100-$8}' | cut -d. -f1)
MEM=$(free | awk '/Mem:/ {printf "%d", $3/$2*100}')
TEMP=$(vcgencmd measure_temp 2>/dev/null | sed 's/temp=//;s/.C//' || echo "0")
UPTIME=$(awk '{print int($1)}' /proc/uptime)

# POST 到 API
curl -fsS -X POST "${API_URL}/api/devices/${DEVICE_ID}/heartbeat" \
  -H "Content-Type: application/json" \
  -d "{\"cpu\":${CPU},\"mem\":${MEM},\"temp\":${TEMP},\"uptime\":${UPTIME}}" \
  > /dev/null || {
    logger -t pec-agent "心跳上报失败: ${DEVICE_ID}"
    exit 1
  }

logger -t pec-agent "心跳 OK: cpu=${CPU}% mem=${MEM}% temp=${TEMP}°C"
