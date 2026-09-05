# 外部美术、字体与图标资源台账

> 可下载不等于自动获得公开网站使用权。资源进入网站前需记录来源、作者、许可、修改方式和使用位置。

## 1. 目录约定

```text
apps/web/
├─ public/media/association/        # 协会自有照片与公开宣传素材
├─ src/assets/brand/                # Logo、品牌纹理和自制图形
├─ src/assets/icons/                # 自制或许可明确的 SVG 图标
├─ src/assets/fonts/                # 允许自托管的字体
└─ src/assets/vendor/<source>/      # 保留来源边界的第三方素材
```

第三方文件不得散落在页面目录，也不得覆盖协会原始 Logo。

## 2. 使用状态

| 状态 | 含义 |
|---|---|
| 候选 | 已发现，尚未核验许可或适配性 |
| 可测试 | 许可允许本地设计验证，暂不发布 |
| 可发布 | 许可、署名和修改条件已经明确 |
| 禁止发布 | 仅供参考、版权不明或不允许当前用途 |

## 3. 参考来源

| 来源 | 可借鉴内容 | 当前决定 |
|---|---|---|
| [Rainform](https://github.com/afterimage-lab/Rainform) | 数据驱动粒子、固定 seed、延迟初始化、WebGL fallback | 只借鉴架构；不复制源码和品牌资产 |
| [Ark-Particle-Imitate](https://github.com/QingXia-Ela/Ark-Particle-Imitate) | 图片采样、粒子聚合/散开、鼠标吸附/排斥 | 可重新实现算法；示例图片不进入协会网站 |
| [ignoredone 美术资源库](https://www.ignoredone.space/index.php/resource/) | 信息分层、版式、纹理、编号和活动视觉 | 许可明确的下载项才进入候选 |
| [ignoredone 字体库](https://www.ignoredone.space/index.php/fontlab/) | Outfit、Satoshi、MiSans、HarmonyOS Sans、思源宋体、Clash Display 等 | 逐个核验官方许可 |
| [ignoredone 自制图标包](https://www.ignoredone.space/index.php/iconasset-2/) | 统一线性图标和交互图标参考 | 找到许可声明后再使用 |

## 4. 明日方舟资源使用规则

可复用 ignoredone 资源库中可下载且许可明确的素材，并满足以下条件：

1. 下载页或压缩包中存在明确许可或作者使用说明。
2. 许可允许公开网页展示、修改和再分发。
3. 不会让访客误以为协会网站是明日方舟官方或关联项目。
4. 角色立绘、游戏 Logo、活动主视觉和官方品牌标志默认不用于协会官网。
5. 优先选择纹理、网格、作者自制图标、字体和可复用工程文件。
6. 需要署名时，在页面 Credits 和仓库 README 同时标注。

优先核验：

- 作者自制图标包；
- 明确许可的纹理、笔刷和设计工程；
- 许可明确的字体；
- 不含角色和官方标志的几何、网格、噪声与界面装饰。

## 5. 登记模板

| ID | 文件 | 来源页 | 作者 | 许可 | 允许修改 | 署名要求 | 使用位置 | 状态 |
|---|---|---|---|---|---|---|---|---|
| 示例 | `grid-texture.webp` | `https://...` | 作者名 | CC BY 4.0 | 是 | Credits | 项目区背景 | 可发布 |

## 6. 字体检查

- 是否允许 Webfont、自托管和子集化；
- 是否要求保留许可证；
- 中文字体是否需要 WOFF2 子集；
- 配置 `font-display: swap`；
- 首屏最多预加载两个字体文件；
- fallback 不产生明显布局跳动。

## 7. 图标检查

- 统一 `viewBox`、描边宽度和端点样式；
- 清除编辑器元数据和无用 path；
- 使用 `currentColor` 继承主题颜色；
- 操作图标提供 `aria-label`，装饰图标设置 `aria-hidden="true"`；
- 同一导航或组件不混用风格不同的图标源。

## 8. 协会自有素材优先级

- 5–10 张比赛和活动照片；
- 控制板、摄像头、机器人和 3D 打印作品照片；
- 3–5 个代表项目名称、简介和技术栈；
- 可公开的获奖证书或现场照片；
- 经负责人确认可公开的团队信息；
- 招新二维码或报名入口。
