# =============================================
# PEC API Dockerfile - 多阶段构建优化体积
# =============================================

# ---------- 构建阶段 ----------
FROM node:22-alpine AS builder
WORKDIR /repo

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# 复制 workspace 配置
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# 安装全部依赖（仅 api 及其依赖）
RUN pnpm install --frozen-lockfile --filter @pec/api...

# 构建
RUN pnpm --filter @pec/api build

# ---------- 运行阶段 ----------
FROM node:22-alpine AS runner
WORKDIR /app

# better-sqlite3 需要这些（native module）
RUN apk add --no-cache python3 make g++ \
    && corepack enable \
    && corepack prepare pnpm@9.15.0 --activate

# 复制 workspace 元数据
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# 仅安装生产依赖
RUN pnpm install --frozen-lockfile --filter @pec/api --prod \
    && apk del python3 make g++

# 复制构建产物
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/packages/shared/src ./packages/shared/src

ENV NODE_ENV=production
EXPOSE 3000

# 数据库目录（挂载点）
VOLUME ["/app/apps/api/data"]

CMD ["node", "apps/api/dist/index.js"]
