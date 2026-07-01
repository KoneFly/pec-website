# Pi Agent

> 树莓派心跳采集器，**Phase 2 实现/部署**

## 一句话说明

每 30 秒由 systemd timer 触发 `pi-agent.sh`，向 `@pec/api` POST 当前 `cpu / mem / temp / uptime`。

## 安装步骤

```bash
# 1. 上传脚本到树莓派
sudo cp pi-agent.sh /usr/local/bin/pi-agent.sh
sudo chmod +x /usr/local/bin/pi-agent.sh

# 2. 安装 systemd 单元
sudo cp pi-agent.service pi-agent.timer /etc/systemd/system/

# 3. 配置环境变量（每台 Pi 独立 ID）
sudo tee /etc/profile.d/pec-agent.sh > /dev/null <<EOF
export DEVICE_ID="pi-001"
export API_URL="https://api.pec.example.com"
EOF

# 4. 启动
sudo systemctl daemon-reload
sudo systemctl enable --now pi-agent.timer

# 5. 验证
systemctl status pi-agent.timer
journalctl -u pi-agent.service -f
```

## 卸载

```bash
sudo systemctl disable --now pi-agent.timer
sudo rm /etc/systemd/system/pi-agent.{service,timer}
sudo rm /usr/local/bin/pi-agent.sh
sudo rm /etc/profile.d/pec-agent.sh
```
