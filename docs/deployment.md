# 部署指南

本指南分两部分：
1. **前端**：部署到 GitHub Pages（或 Cloudflare Pages）
2. **后端**：部署到群晖 SA6400 的 Container Manager + Cloudflare Tunnel 暴露

---

## Part 1: 前端部署到 GitHub Pages

### 1.1 准备 GitHub 仓库

```bash
# 在项目根目录
git init
git add .
git commit -m "chore: initial commit"
git remote add origin git@github.com:<你的组织>/pec-website.git
git push -u origin main
```

### 1.2 配置 Astro 输出路径

如果用 `<用户名>.github.io/pec-website` 这种**子路径**，编辑 `apps/web/astro.config.mjs`：

```js
export default defineConfig({
  site: 'https://<用户名>.github.io',
  base: '/pec-website',  // 仓库名作为 base
  // ...
});
```

如果用**自定义域名**（如 `pec.example.com`），改成：

```js
export default defineConfig({
  site: 'https://pec.example.com',
  // 不需要 base
});
```

### 1.3 创建 GitHub Actions

文件：`.github/workflows/deploy-web.yml`

```yaml
name: Deploy Web to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/shared/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:web
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./apps/web/dist
      - uses: actions/deploy-pages@v4
```

### 1.4 仓库 Settings → Pages

- Source: **GitHub Actions**

推送代码后自动部署，约 2 分钟。

---

## Part 2: 后端部署到群晖

### 2.1 准备群晖环境

1. 登录 DSM
2. 套件中心 → 搜索安装 **Container Manager**
3. SSH 启用：控制面板 → 终端机和 SNMP → 启用 SSH

### 2.2 上传项目到群晖

**方式 A: 通过 File Station 上传** （简单）

将整个项目压缩成 zip，上传到 `/volume1/docker/pec-website/` 然后解压。

**方式 B: 通过 git clone** （推荐，方便后续更新）

```bash
ssh admin@<群晖IP>
sudo -i
mkdir -p /volume1/docker/pec-website
cd /volume1/docker/pec-website
git clone git@github.com:<你的组织>/pec-website.git .
```

### 2.3 配置环境变量

复制 `.env.example` 为 `.env`，填入：

```bash
# 数据库路径（群晖路径）
DATABASE_URL=file:/data/pec.db

# 主人后台密码（bcrypt 哈希）
# 生成方法：node -e "console.log(require('bcryptjs').hashSync('你的密码', 12))"
ADMIN_PASSWORD_HASH=$2a$12$xxx...

# JWT 密钥（随机生成）
JWT_SECRET=<32字符随机串>

# 拓竹打印机配置
BAMBU_A1_IP=192.168.1.50
BAMBU_A1_ACCESS_CODE=12345678
BAMBU_A1_SERIAL=01S00A1234567890

BAMBU_X2D_IP=192.168.1.51
BAMBU_X2D_ACCESS_CODE=87654321
BAMBU_X2D_SERIAL=01X00B0987654321

# CORS 允许的前端域名
CORS_ORIGIN=https://<用户名>.github.io,https://pec.example.com
```

### 2.4 启动 Docker 容器

```bash
cd /volume1/docker/pec-website
docker compose up -d
```

查看日志：
```bash
docker compose logs -f
```

预期输出：
```
api    | 🚀 PEC API listening on :3000
bambu  | ✅ Connected to Bambu A1 at 192.168.1.50
bambu  | ✅ Connected to Bambu X2D at 192.168.1.51
```

### 2.5 验证本地访问

群晖局域网内浏览器访问：`http://<群晖IP>:3000/api/health`

应返回：
```json
{"status":"ok","timestamp":1234567890}
```

---

## Part 3: Cloudflare Tunnel 配置

### 3.1 注册 Cloudflare 账号

访问 [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) 注册。

### 3.2 添加域名到 Cloudflare（如已购域名）

1. Cloudflare 控制台 → Add a Site
2. 输入域名 → Free 计划
3. 按提示修改域名注册商的 NS 服务器到 Cloudflare

> 💡 如果没有自己的域名，可以跳过此步，使用 Cloudflare Tunnel 提供的免费 `*.trycloudflare.com` 域名。

### 3.3 创建 Tunnel

1. Cloudflare 控制台 → Zero Trust → Networks → **Tunnels**
2. 点击 **Create a tunnel**
3. 选择 **Cloudflared** → 命名为 `pec-nas`
4. 保存后获得一段命令，类似：
   ```
   cloudflared service install eyJhxxx...
   ```
   复制 token（`eyJhxxx...` 部分）。

### 3.4 群晖运行 cloudflared

编辑 `docker-compose.yml`，已包含 `cloudflared` 服务，把 token 填到 `.env`：

```bash
CLOUDFLARE_TUNNEL_TOKEN=eyJhxxx...
```

重启：
```bash
docker compose up -d cloudflared
```

### 3.5 配置 Public Hostname

回到 Cloudflare Tunnel 控制台：

1. 在刚创建的 Tunnel 点 **Configure** → **Public Hostname** 标签
2. Add a public hostname:
   - Subdomain: `api`
   - Domain: `pec.example.com`（你的域名）
   - Service Type: HTTP
   - URL: `pec-api:3000`（Docker 容器名）
3. 保存

现在 `https://api.pec.example.com` 就指向群晖里的后端了。

### 3.6 更新前端环境变量

编辑 `apps/web/.env.production`：

```
PUBLIC_API_BASE=https://api.pec.example.com
```

重新构建并推送，GitHub Actions 自动重新部署。

---

## Part 4: 配置树莓派客户端

在每台树莓派上执行：

```bash
# 下载脚本
wget https://raw.githubusercontent.com/<你的组织>/pec-website/main/collectors/pi-agent/pi-agent.sh \
     -O /usr/local/bin/pi-agent.sh
chmod +x /usr/local/bin/pi-agent.sh

# 配置：每台树莓派分配唯一 ID
echo 'export DEVICE_ID="pi-001"' >> /etc/profile.d/pec-agent.sh
echo 'export API_URL="https://api.pec.example.com"' >> /etc/profile.d/pec-agent.sh

# 安装 systemd 服务
wget https://raw.githubusercontent.com/<你的组织>/pec-website/main/collectors/pi-agent/pi-agent.service \
     -O /etc/systemd/system/pi-agent.service
systemctl enable --now pi-agent.timer
```

验证：
```bash
systemctl status pi-agent.service
journalctl -u pi-agent.service -f
```

---

## Part 5: 验证全链路

1. ✅ 浏览器访问 `https://<用户名>.github.io/pec-website` 看到首页
2. ✅ 访问 `/devices` 页面看到设备卡片
3. ✅ 打开拓竹打印机 → 状态变成 "空闲"
4. ✅ 树莓派关机 → 90s 后状态变成 "离线"
5. ✅ 物品页能留言（用部门口令）

全部 ✅ 就部署成功啦～

---

## 维护操作

### 更新代码

前端：直接 `git push`，GitHub Actions 自动重新部署。

后端：
```bash
ssh admin@<群晖IP>
cd /volume1/docker/pec-website
git pull
docker compose up -d --build
```

### 备份数据库

```bash
# 群晖 SSH
cd /volume1/docker/pec-website/data
cp pec.db pec.db.backup.$(date +%Y%m%d)
```

建议设置群晖自动备份：控制面板 → 任务计划 → 创建 → 用户定义脚本（每周一次）。

### 查看日志

```bash
docker compose logs -f api      # API 日志
docker compose logs -f bambu    # 拓竹采集器日志
docker compose logs -f cloudflared  # Tunnel 日志
```

### 重置部门口令

主人后台 `https://api.pec.example.com/admin` 登录，找到对应部门点"重置口令"。
