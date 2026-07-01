/**
 * @pec/shared
 * 前后端共享的类型定义和常量
 */

// ============ 设备相关 ============

/** 设备类型 */
export type DeviceType = 'bambu-a1' | 'bambu-x2d' | 'raspberry-pi' | 'other';

/** 设备简易状态（仅 4 态，不暴露具体进度） */
export type DeviceStatus = 'online' | 'idle' | 'busy' | 'offline';

/** 设备元信息 */
export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  /** 简介，用于卡片副标题 */
  description?: string;
  /** 是否对外公开 */
  isPublic: boolean;
}

/** 设备实时状态 */
export interface DeviceState {
  deviceId: string;
  status: DeviceStatus;
  /** 上次上报时间（ISO 8601） */
  lastSeen: string;
  /** 当前任务描述（可选，例如打印中显示文件名） */
  currentTask?: string;
}

// ============ 贵重物品相关 ============

/** 物品分类 */
export type ItemCategory =
  | 'printer'
  | 'computer'
  | 'sensor'
  | 'instrument'
  | 'tool'
  | 'consumable'
  | 'other';

/** 贵重物品 */
export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  /** 数量 */
  quantity: number;
  /** 简介（型号、规格） */
  description?: string;
  /** 封面图片 URL */
  imageUrl?: string;
  /** 创建时间 */
  createdAt: string;
}

// ============ 留言相关 ============

/** 物品留言 */
export interface ItemMessage {
  id: number;
  itemId: string;
  /** 留言者学号（必填） */
  studentId: string;
  /** 留言者自报姓名（可伪造，仅展示） */
  displayName: string;
  /** 留言者所属部门（由口令认证决定） */
  department: string;
  /** 留言内容 */
  content: string;
  /** 创建时间 */
  createdAt: string;
}

// ============ 认证相关 ============

/** 部门 */
export const DEPARTMENTS = [
  'tech-hardware', // 硬件部
  'tech-software', // 软件部
  'tech-optics',   // 光电部
  'media',         // 媒体部
  'admin',         // 管理部
] as const;

export type Department = (typeof DEPARTMENTS)[number];

/** 部门中文名映射 */
export const DEPARTMENT_NAMES: Record<Department, string> = {
  'tech-hardware': '硬件部',
  'tech-software': '软件部',
  'tech-optics': '光电部',
  'media': '媒体部',
  'admin': '管理部',
};

/** 留言提交载荷 */
export interface MessagePayload {
  itemId: string;
  /** 部门口令 */
  deptToken: string;
  /** 学号（格式 `^\d{4}[A-Z0-9]{4,10}$`） */
  studentId: string;
  /** 自报姓名 */
  displayName: string;
  /** 留言内容（≤ 500 字） */
  content: string;
}

// ============ API 响应通用结构 ============

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============ SSE 事件 ============

/** SSE 推送事件类型 */
export type SseEvent =
  | { type: 'device-state'; payload: DeviceState }
  | { type: 'item-message'; payload: ItemMessage }
  | { type: 'heartbeat'; payload: { ts: number } };

// ============ 约束常量 ============

export const LIMITS = {
  /** 留言内容最大长度 */
  MESSAGE_MAX_LENGTH: 500,
  /** 学号正则 */
  STUDENT_ID_REGEX: /^\d{4}[A-Z0-9]{4,10}$/,
  /** 姓名最大长度 */
  DISPLAY_NAME_MAX_LENGTH: 20,
  /** 留言速率限制：每分钟次数 */
  MESSAGE_RATE_PER_MINUTE: 3,
  /** 设备心跳超时（秒），超过即视为离线 */
  HEARTBEAT_TIMEOUT_SEC: 90,
} as const;
