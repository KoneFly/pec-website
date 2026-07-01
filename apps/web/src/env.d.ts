/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** 后端 API 基础 URL，部署时通过 GitHub Actions 注入 */
  readonly PUBLIC_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
