/**
 * PEC API Server
 * 协会网站后端服务入口
 */
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono();

// ============ 全局中间件 ============
app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:4321').split(','),
    credentials: true,
  })
);

// ============ 路由 ============
app.get('/', (c) => c.json({ name: 'PEC API', version: '0.1.0' }));

app.get('/api/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
  })
);

// TODO: 在 Phase 2 实现
// import devicesRoute from './routes/devices.js';
// app.route('/api/devices', devicesRoute);

// TODO: 在 Phase 3 实现
// import itemsRoute from './routes/items.js';
// import messagesRoute from './routes/messages.js';
// import adminRoute from './routes/admin.js';

// ============ 启动 ============
const port = Number(process.env.PORT ?? 3000);

console.log(`🚀 PEC API listening on :${port}`);
serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
});
