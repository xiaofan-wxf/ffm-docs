# FFM QA 知识库设计文档

**日期：** 2026-04-29  
**项目：** FFM Daily QA Knowledge Base  
**源文档：** [FFM日常问题QA](https://flashexpress.feishu.cn/wiki/N31vwos09iHf2FkOIrQcq61VnTg)

---

## 目标

将现有飞书 Wiki 文档（FFM日常问题QA）迁移为一个公开可访问的文档网站，配备 AI 问答浮窗，支持中/英/泰三语，服务外部商家自助查询和内部运营团队。

---

## 技术选型

| 层 | 技术 | 理由 |
|---|---|---|
| 文档框架 | Docusaurus v3 | 原生 i18n（中/英/泰），React 生态，社区成熟 |
| 托管 | Vercel | push 自动部署，免费额度够用，支持 Serverless Function |
| 代码托管 | GitHub | 触发 Vercel CI/CD |
| AI 问答 | Claude API（claude-sonnet-4-6） | 高质量多语言回答，按用量计费 |
| AI 后端 | Vercel Serverless Function | 零运维，与 Vercel 托管统一 |

---

## 整体架构

```
GitHub Repo (Markdown + i18n 翻译文件)
        │
        │ git push → Vercel 自动构建
        ▼
   静态站点（Docusaurus）
   公网：https://help.ffm.com 或 ffm-docs.vercel.app
        │
        │ 用户点击 AI 问答浮窗
        ▼
   Vercel Serverless Function /api/chat
        │
        │ system prompt（注入精简文档） + 用户问题 → Claude API
        ▼
   流式回答（SSE）返回前端显示
```

---

## 仓库目录结构

```
ffm-docs/
├── docs/
│   ├── inbound/            # 入库须知
│   │   ├── requirements.md # 箱单标准、拒收标准
│   │   ├── addresses.md    # 各仓地址（AGV/BST/LAS等）
│   │   └── appointment.md  # 预约方式、收货时间
│   ├── platform/           # 店铺授权
│   │   ├── tiktok.md
│   │   ├── shopee.md
│   │   └── lazada.md
│   ├── orders/             # 订单处理
│   │   ├── sync-issues.md  # 订单抓取失败
│   │   ├── presale.md      # 预售订单
│   │   └── cancellation.md # 订单取消
│   ├── operations/         # 时效与作业
│   │   ├── inbound-sla.md
│   │   └── outbound-sla.md
│   ├── billing/            # 账单与服务
│   │   ├── common-issues.md
│   │   └── recharge.md
│   ├── returns/            # 退货与退仓
│   │   ├── return-flow.md
│   │   └── transfer.md
│   └── internal/           # 仅内部可见（受密码保护）
│       ├── contacts.md     # 仓库联系人手机号
│       └── complaints.md   # 投诉内部责任认定流程
├── i18n/
│   ├── en/docs/            # 英文翻译
│   └── th/docs/            # 泰文翻译
├── src/
│   └── components/
│       └── AiChat/
│           ├── index.tsx   # 浮窗入口按钮
│           └── ChatModal.tsx # 对话框组件
├── api/
│   └── chat.ts             # Vercel Serverless Function
├── static/
│   └── img/                # 从飞书文档迁移的截图
└── docusaurus.config.ts
```

---

## 内外版内容区分

| 内容类型 | 对外公开 | 仅内部 |
|---------|---------|--------|
| QA 文字内容 | ✅ | |
| 操作截图 | ✅ | |
| 操作视频（.mov/.mp4） | ✅ | |
| 仓库地址 | ✅ | |
| 仓库联系人个人手机号 | | ✅ |
| 投诉内部责任认定流程 | | ✅ |
| 内部 @mention 人员记录 | | ✅ |

**实现方式：** 内部内容放在 `/internal` 路由下，通过 Vercel Password Protection 或简单的 token 参数保护，无需独立部署。

---

## 内容模块

依据源文档重新组织，按商家使用场景分类：

1. **入库须知** — 箱单标准、拒收规则、各仓地址（AGV/BST/LAS/BPL/Live-stream/退件仓）、预约方式、收货时间窗口
2. **店铺授权** — TikTok 3PF/本土店、Shopee 3PF/SIP、Lazada 3PF 授权步骤及常见失败处理（含一品多仓）
3. **订单处理** — 订单未抓取、COD 订单滞后、预售订单激活、订单取消流程、商品映射、地址异常
4. **时效标准** — 入库上架时效（48h/新品72h）、各平台出库截单时间（Shopee 16:00/TikTok 18:00/Lazada 24-48h）、作业时间（周一至周日节假日除外）
5. **账单 & 服务** — 仓储费/包材费常见问题、预充值方式、增值服务（用车/加班）
6. **退货 & 退仓** — 销退流程（三类）、退仓流程、货权转移单操作
7. **常见问题** — 头程丢件赔偿、货物损坏处理、是否可自备包材、海运陆运时效与税费

每个条目格式：
```markdown
## 问题标题

**原因**（可选）：...

**解决步骤**：
1. ...
2. ...

**参考视频**：[视频标题](链接)
```

---

## AI 问答浮窗

### 交互设计
- 右下角悬浮按钮，点击展开对话框（宽 360px，高 500px）
- 支持多轮对话，对话历史保存在 sessionStorage
- 对话框内语言跟随当前站点语言（中/英/泰）

### 后端：`/api/chat`（Vercel Serverless Function）

```
POST /api/chat
Body: { messages: [{role, content}], lang: "zh"|"en"|"th" }
Response: SSE stream
```

**System Prompt 策略：**
- 注入精简版文档内容（~8k tokens，覆盖所有 QA 要点）
- 限定只在知识库范围内回答，超出范围引导联系商务
- 自动用用户当前语言回答

### 费用估算
每天 50 次问答 × 5k tokens × 30 天 ≈ 7.5M tokens/月，约 $3-5/月（Claude Sonnet）。

---

## 三语 i18n 策略

- **中文（zh）**：默认语言，直接用源文档内容
- **英文（en）**：人工翻译关键页面，其余页面初期用机器翻译（Claude 批量生成）
- **泰文（th）**：同上，优先翻译时效、地址、常见问题等高频页面

Docusaurus i18n 工作流：
```bash
npm run write-translations -- --locale en
npm run write-translations -- --locale th
# 编辑 i18n/en/ 和 i18n/th/ 目录下的翻译文件
```

---

## 部署流程

1. GitHub 仓库（`main` 分支）连接 Vercel
2. Vercel 环境变量：`ANTHROPIC_API_KEY`
3. push to `main` → Vercel 自动构建并发布
4. 内部版：Vercel Dashboard 开启 Password Protection（Pro plan）或用 `/internal?token=xxx` 方式

---

## 不在范围内

- 用户登录系统（内外版用密码/token 简单区分，不做账号体系）
- 飞书文档自动同步（内容变更手动更新 Markdown 文件）
- 移动 App（响应式网站覆盖手机浏览器需求）
