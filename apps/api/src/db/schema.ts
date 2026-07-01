/**
 * 数据库 Schema（Drizzle ORM）
 * Phase 2/3 实现：当前仅定义结构，迁移脚本待 Phase 2 加
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/** 设备元信息表 */
export const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // bambu-a1 / bambu-x2d / raspberry-pi / other
  name: text('name').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

/** 设备状态缓存表（仅保留最新一条/设备） */
export const deviceStates = sqliteTable('device_states', {
  deviceId: text('device_id').primaryKey().references(() => devices.id),
  status: text('status').notNull(), // online / idle / busy / offline
  currentTask: text('current_task'),
  lastSeen: text('last_seen').notNull().default(sql`(current_timestamp)`),
});

/** 贵重物品表 */
export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  quantity: integer('quantity').notNull().default(1),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

/** 物品留言表 */
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: text('item_id').notNull().references(() => items.id),
  studentId: text('student_id').notNull(),
  displayName: text('display_name').notNull(),
  department: text('department').notNull(),
  content: text('content').notNull(),
  ipHash: text('ip_hash'), // 用于速率限制，存 IP 的 SHA256（隐私）
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

/** 部门口令表 */
export const deptTokens = sqliteTable('dept_tokens', {
  department: text('department').primaryKey(),
  tokenHash: text('token_hash').notNull(), // bcrypt 哈希
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`),
});
