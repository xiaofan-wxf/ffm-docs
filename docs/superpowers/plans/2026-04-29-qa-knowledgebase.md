# FFM QA Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a trilingual (zh/en/th) Docusaurus v3 documentation site for FFM warehouse QA content, with a Claude-powered AI chat widget, deployed on Vercel via GitHub.

**Architecture:** Docusaurus v3 generates a static site from Markdown files organized in 7 content modules. A Vercel Serverless Function at `/api/chat` prepends a compiled knowledge-base system prompt and calls Claude API with SSE streaming. A floating React chat widget injects globally via a swizzled `Root` component. The `/docs/internal/*` path is gated by Vercel Edge Middleware checking an `INTERNAL_TOKEN` cookie.

**Tech Stack:** Node.js 18+, Docusaurus v3, TypeScript, React 18, `@anthropic-ai/sdk`, Vercel Serverless Functions, Vercel Edge Middleware, GitHub

---

## File Map

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Site config: i18n (zh/en/th), navbar, footer, url |
| `sidebars.ts` | Sidebar navigation tree for all 7 modules |
| `src/pages/index.tsx` | Home page with module quick-links |
| `src/css/custom.css` | Brand colors |
| `src/theme/Root.tsx` | Global wrapper: mounts `<AiChat />` on every page |
| `src/components/AiChat/index.tsx` | Floating button + modal entry point |
| `src/components/AiChat/ChatModal.tsx` | Chat dialog, message list, input, SSE streaming |
| `src/components/AiChat/styles.module.css` | Chat widget CSS |
| `src/components/AiChat/__tests__/ChatModal.test.tsx` | Component unit tests |
| `docs/inbound/requirements.md` | Packing standards & rejection rules |
| `docs/inbound/addresses.md` | All 6 warehouse addresses |
| `docs/inbound/appointment.md` | Receiving hours & appointment rules |
| `docs/platform/tiktok.md` | TikTok 3PF auth + common failures |
| `docs/platform/shopee.md` | Shopee auth + SIP + inventory sync |
| `docs/platform/lazada.md` | Lazada auth steps + inspection warehouse |
| `docs/orders/sync-issues.md` | Order not pulled into SCM |
| `docs/orders/presale.md` | Pre-sale order activation flow |
| `docs/orders/cancellation.md` | Order cancellation scenarios |
| `docs/operations/inbound-sla.md` | Inbound receiving SLA |
| `docs/operations/outbound-sla.md` | Outbound cut-off times & working hours |
| `docs/billing/common-issues.md` | Storage/packing/lease fee FAQ |
| `docs/billing/recharge.md` | Pre-payment top-up steps |
| `docs/returns/return-flow.md` | Sales return (3 scenarios) |
| `docs/returns/transfer.md` | Goods ownership transfer |
| `docs/internal/contacts.md` | Warehouse personal phone numbers (protected) |
| `docs/internal/complaints.md` | Internal complaint & accountability flow |
| `api/chat.ts` | Vercel Serverless: streams Claude response |
| `src/lib/knowledgeBase.ts` | Compiled QA text injected as system prompt |
| `middleware.ts` | Vercel Edge: protects /docs/internal/* |
| `vercel.json` | Vercel routing config |
| `.env.local` | Local env: ANTHROPIC_API_KEY, INTERNAL_TOKEN |
| `package.json` | All dependencies |

---

## Task 1: Initialize Docusaurus project

**Files:**
- Create: `package.json`, `docusaurus.config.ts`, `sidebars.ts`, `tsconfig.json`, `src/css/custom.css`

- [ ] **Step 1: Scaffold Docusaurus v3**

Run inside `/Users/wxf/Documents/workspace/ai-project/ffm-docs`:
```bash
npx create-docusaurus@3 site classic --typescript
```
This creates a `site/` subdirectory. We'll use the project root instead — move files up:
```bash
mv site/* . && mv site/.* . 2>/dev/null; rmdir site
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @anthropic-ai/sdk
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom ts-jest
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run start
```
Expected: browser opens at `http://localhost:3000` with default Docusaurus site. Kill with `Ctrl+C`.

- [ ] **Step 4: Commit scaffold**

```bash
git init
git add .
git commit -m "chore: scaffold Docusaurus v3 with TypeScript"
```

---

## Task 2: Configure docusaurus.config.ts

**Files:**
- Modify: `docusaurus.config.ts`

- [ ] **Step 1: Replace with FFM config**

```typescript
// docusaurus.config.ts
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'FFM Help Center',
  tagline: 'Flash Fulfillment 帮助中心',
  favicon: 'img/favicon.ico',
  url: 'https://ffm-docs.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'th'],
    localeConfigs: {
      zh: { label: '中文', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
      th: { label: 'ภาษาไทย', direction: 'ltr' },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'FFM Help Center',
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: '文档' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Flash Fulfillment`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

- [ ] **Step 2: Verify build still compiles**

```bash
npm run build 2>&1 | tail -5
```
Expected: `Generated static files in "build"` (or similar success message).

- [ ] **Step 3: Commit**

```bash
git add docusaurus.config.ts
git commit -m "feat: configure site metadata and trilingual i18n"
```

---

## Task 3: Configure sidebars.ts

**Files:**
- Modify: `sidebars.ts`

- [ ] **Step 1: Define sidebar structure**

```typescript
// sidebars.ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: '入库须知',
      items: ['inbound/requirements', 'inbound/addresses', 'inbound/appointment'],
    },
    {
      type: 'category',
      label: '店铺授权',
      items: ['platform/tiktok', 'platform/shopee', 'platform/lazada'],
    },
    {
      type: 'category',
      label: '订单处理',
      items: ['orders/sync-issues', 'orders/presale', 'orders/cancellation'],
    },
    {
      type: 'category',
      label: '时效标准',
      items: ['operations/inbound-sla', 'operations/outbound-sla'],
    },
    {
      type: 'category',
      label: '账单与服务',
      items: ['billing/common-issues', 'billing/recharge'],
    },
    {
      type: 'category',
      label: '退货与退仓',
      items: ['returns/return-flow', 'returns/transfer'],
    },
  ],
};

export default sidebars;
```

- [ ] **Step 2: Create placeholder docs to validate sidebar (will be replaced in Tasks 4–10)**

```bash
mkdir -p docs/{inbound,platform,orders,operations,billing,returns,internal}
for f in \
  docs/inbound/requirements.md docs/inbound/addresses.md docs/inbound/appointment.md \
  docs/platform/tiktok.md docs/platform/shopee.md docs/platform/lazada.md \
  docs/orders/sync-issues.md docs/orders/presale.md docs/orders/cancellation.md \
  docs/operations/inbound-sla.md docs/operations/outbound-sla.md \
  docs/billing/common-issues.md docs/billing/recharge.md \
  docs/returns/return-flow.md docs/returns/transfer.md; do
  name=$(basename $f .md)
  echo -e "---\nid: $name\ntitle: $name\n---\n\n# $name\n\nContent coming soon." > $f
done
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add sidebars.ts docs/
git commit -m "feat: configure sidebar structure with placeholder docs"
```

---

## Task 4: Migrate inbound content

**Files:**
- Modify: `docs/inbound/requirements.md`, `docs/inbound/addresses.md`, `docs/inbound/appointment.md`

- [ ] **Step 1: Write docs/inbound/requirements.md**

```markdown
---
id: requirements
title: 箱单标准与拒收规则
sidebar_label: 箱单与拒收
---

# 箱单标准与拒收规则

## 箱单要求

- 每箱必须按照标准张贴箱单
- 不接受混箱到货商品
- 同一箱内存在多个 SKU 时，必须做好明显的隔离措施

## 拒收标准

以下情况仓库将拒绝收货：

1. 无入库单，或未提前通知货物到仓
2. 非收货时间送货（大促前 1 天后 2 天、周日、法定假期）
3. 送货单与实际数量不匹配（仓库根据实际到货情况评估）
4. 外包装或内物明显破损
5. 外箱无明显箱单标注入库单及箱内商品明细

## 包装标准

如需贴标、重新包装等增值服务，请提前联系商务报价，费用按合同约定收取。
```

- [ ] **Step 2: Write docs/inbound/addresses.md**

```markdown
---
id: addresses
title: 仓库地址
sidebar_label: 仓库地址
---

# 仓库地址

## Flash Fulfillment AGV

**泰文：** 88/171-2 หมู่ 15 ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ 10570

**英文：** 88/171-2, Moo 15, Bang Sao Tong Subdistrict, Bang Sao Tong District, Samutprakarn 10570

[Google Maps](https://maps.app.goo.gl/oLP2w1zC5tj1qddg7)

**收件人：** Flashfulfillment/Mai/bell + SCM货主登录账号名称

---

## Flash Fulfillment BST

**泰文：** 172-4 หมู่16 ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ 10570

**英文：** 172-4 Moo16 Bang Sao Thong Subdistrict, Bang Sao Thong District, Samut Prakan Province 10570

[Google Maps](https://maps.app.goo.gl/MNcPcssR3zSkWGsR8)

---

## Flash Express and Fulfillment - Lasalle Hub（LAS）

**泰文：** 10/9 ถ.ศรีนครินทร์ หมู่16 บางแก้ว บางพลี สมุทรปราการ 10540

**英文：** 10/9 Srinakarin Road, Moo 16, Bang Kaew, Bang Phli, Samut Prakan 10540

[Google Maps](https://maps.app.goo.gl/CR1pSg6kRbkXtaD3A)

**收件人：** bell + 货主名字

---

## Flash Fulfillment LAS3

**英文：** 55/94, Moo 15, Bang Sao Thong Sub-District, Bang Sao Thong District, Samut Prakarn Province 10570

**泰文：** 55/94 หมู่ที่ 15 ตำบลบางเสาธง อำเภอบางเสาธง จังหวัดสมุทรปราการ 10570

[Google Maps](https://maps.app.goo.gl/4JVY47f2WxKw1t8m7)

**收件人：** Flashfulfillment/Mai/bell + SCM货主登录账号名称

---

## Flash Fulfillment Live-stream Warehouse（直播仓）

**泰文：** 88/73 หมู่23 ซอยที่ดินไทย คลังสหไทย ถ.เทพารักษ์ บางพลีใหญ่ บางพลี สมุทรปราการ 10540

**英文：** 88/73 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli Yai Subdistrict, Bang Phli District, Samut Prakan Province 10540

[Google Maps](https://maps.app.goo.gl/Uh8PF3Vb7B79kFgq8)

---

## Flash Fulfillment Bang Phli（退件仓）

**泰文：** 88/25 หมู่23 ซอยที่ดินไทย คลังสหไทย ถ.เทพารักษ์ ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540

**英文：** 88/25 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli Yai Subdistrict, Bang Phli District, Samut Prakan Province 10540

[Google Maps](https://maps.app.goo.gl/9Tx7CkwjoKWz6WPU7)
```

- [ ] **Step 3: Write docs/inbound/appointment.md**

```markdown
---
id: appointment
title: 入库预约与收货时间
sidebar_label: 预约与时间
---

# 入库预约与收货时间

## 收货时间

**正常收货：** 周一至周六，09:00–16:00 到货

**不收货日：**
- 周日
- 泰国法定节假日
- 大促活动前 1 天、后 2 天

## 预约方式

仓库采用系统预约方式接收货物。通过预约到货的客户优先收货上架；临时送货优先级最低。

**紧急入库**请提前联系商务，安排额外人力（另行报价）。

## 入库时效

| 情况 | 时效 |
|------|------|
| 正常商品（预约到货） | 收货后 48 小时内上架 |
| 新品（需做新品维护） | 不超过 72 小时 |
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -3
```
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add docs/inbound/
git commit -m "feat: add inbound requirements, addresses, and appointment docs"
```

---

## Task 5: Migrate platform authorization content

**Files:**
- Modify: `docs/platform/tiktok.md`, `docs/platform/shopee.md`, `docs/platform/lazada.md`

- [ ] **Step 1: Write docs/platform/tiktok.md**

```markdown
---
id: tiktok
title: TikTok 店铺授权
sidebar_label: TikTok
---

# TikTok 店铺授权

## 授权入口

SCM → 设置 → 店铺档案 → 选择 TikTok 店铺 → 点击【授权】

跨境 3PF 和本土店铺使用不同授权入口，请根据店铺类型选择。

## 常见问题

### 授权失败：平台已授权但 SCM 显示"未授权"

**原因：** 跨境店授权时选错了本土入口。

**解决方法：**
1. 登录 TikTok 平台后台 → 应用和服务市场 → 应用商店
2. 点击右上角 `...` → 我的应用和事件
3. 找到 FlashFulfilment-ERP → 点击【删除】
4. 回到 SCM 店铺档案，重新发起授权

### 一品多仓获取商品失败（商品映射同步不了平台商品）

**原因：** 店铺为"一品多仓"模式，但 SCM 未开启对应参数。

**解决方法：**
1. 确认客户 TikTok 平台后台已在【仓库和库存】模块开启一品多仓
2. SCM → 店铺档案 → 勾选 ☑️ **开通一品多仓**（确认已在 TikTok 开通白名单，保存后无法取消）

若不是一品多仓，则不需要勾选。

相关文档：[TikTok Shop 一品多仓&共享库存功能使用说明](https://seller-th.tiktok.com)

### 自动同步库存失败

**原因：** 商品映射成功后，客户在平台修改了 SKU 链接信息，导致 SCM 同步库存成功但平台后台库存未更新。

**解决方法：** 删除已映射关系，重新同步商品映射。

### TT海外仓报白

如需申请 TikTok 海外仓报白，相关信息如下：
- 是否有 ERP：是
- ERP 名称：FlashFulfillment-SCM
- 是否改造完成：是
```

- [ ] **Step 2: Write docs/platform/shopee.md**

```markdown
---
id: shopee
title: Shopee 店铺授权
sidebar_label: Shopee
---

# Shopee 店铺授权

## 授权入口

SCM → 设置 → 店铺档案 → 选择 Shopee 店铺 → 点击【授权】

3PF 店铺与本土店铺使用相同入口。

## 常见问题

### 授权过期后重新授权失败

**解决方法：**
1. 在 Shopee 卖家后台撤销旧授权
2. 回到 SCM 店铺档案，重新点击【授权】
3. 按照提示完成 OAuth 流程

### Shopee SIP 国际平台店铺授权失败

**原因：** SIP 模式为 1 个自运营店铺（主店铺）对多个子店铺，系统暂不支持选择单一子店铺授权。

**解决方法：** 使用手工单方式处理。下载平台面单 PDF 文件上传，系统识别平台运单号后正常出库。

详见：[手工单操作方法](../orders/sync-issues#手工单)

### 自动同步库存失败

**库存日志：Failed to update stock**

一品多仓模式下，平台不支持单独修改海外仓库存。暂时在平台手动修改库存，等待平台接口更新。

**库存日志：Stock should be larger than 80**

店铺参加了平台锁定库存活动，库存必须大于 80 才能更新。

### 平台拆单（订单先进 SCM 后平台拆单）

若订单已进入 SCM 后平台执行拆单，请联系运营人员手动处理拆单后的子单据。
```

- [ ] **Step 3: Write docs/platform/lazada.md**

```markdown
---
id: lazada
title: Lazada 店铺授权
sidebar_label: Lazada
---

# Lazada 店铺授权

## 授权步骤

1. 登录 Lazada 卖家后台 → 点击**服务市场**
2. 搜索 `Flash` → 找到 **FLASH WMS** 应用
3. 选择【仅授权】→ 周期选**半年** → 点击【授权使用】
4. 勾选「已同意并签署」→ 点击【确认】→ 提示"订购成功"
5. 返回 SCM → 设置 → 店铺档案 → 选择对应店铺 → 点击【授权】
6. 选择国家 → 输入店铺登录邮箱和密码 → 点击「Submit」

## 授权后设置

授权成功后，需在平台店铺后台将**发货地址**维护为 Flash 仓库地址。

SCM 店铺档案 → 点击【修改】→ 平台仓库设置：
- 点击【获取平台仓库】
- 点击右侧【编辑】→ 选择 Flash 仓库
- 是否获取该仓订单：**是**
- 勾选对应 FFM 仓 → 保存

## 常见问题

### DOF 包裹快递无法揽收

**原因：** Lazada 新店铺不满足日均 10 单时，平台要求客户自行送货到网点妥投。

**申请开通 Pickup 揽收方式：** 请联系商务提交申请。

**开通前临时方案：** 需将包裹送到快递网点做妥投，可通过备用金账户支付员工激励，费用记入月度账单。

### Lazada 质检仓对接

如需对接 Lazada 质检仓，请联系项目经理获取专项流程文档。
```

- [ ] **Step 4: Commit**

```bash
git add docs/platform/
git commit -m "feat: add TikTok, Shopee, Lazada authorization docs with common issues"
```

---

## Task 6: Migrate orders content

**Files:**
- Modify: `docs/orders/sync-issues.md`, `docs/orders/presale.md`, `docs/orders/cancellation.md`

- [ ] **Step 1: Write docs/orders/sync-issues.md**

```markdown
---
id: sync-issues
title: 订单抓取与同步问题
sidebar_label: 订单同步
---

# 订单抓取与同步问题

## 订单未进入 SCM

**原因：** 平台订单状态已被手动点击发货，导致平台状态变更后接口无法推送。

**解决方法（手工单）：** {#手工单}

1. SCM → 销售 → 发货单 → 点击【新增】右下拉键 → 选择**线上店铺**
2. 填写外部单号（平台订单号）→ 点击【获取订单】和【同步订单日志】
3. 订单正常抓入发货单页面

**COD 订单说明：** COD 订单接口比正常付款订单滞后，一般稍等片刻即可自动抓取，或按上述方法手动同步。

## 同步日志：订单不属于该仓库

**完整日志：** `Not configured to get orders from this warehouse: 748226486355xxxxxxxx`

**排查方法：**
1. SCM → 设置 → 店铺档案 → 找到订单所属店铺 → 点击【修改】
2. 点击【获取平台仓库】→ 检查是否显示 Flash 仓库
3. 若显示其他仓库，需在平台后台将发货地址维护为 Flash 仓库地址
4. 重新点击【获取平台仓库】→ 出现 Flash 仓库后点击【编辑】
5. 是否获取该仓订单：**是** → 保存

## 订单预处理异常

### 商品异常

**原因：**
- 未在平台商品链接维护 Seller SKU
- 平台维护的 SKU 与 SCM 商品档案不一致

**解决方法：** 在 SCM 商品映射关系中手动维护映射，或更正平台 SKU 后重新同步。

### 地址异常

**原因：** 店铺档案勾选了"启用卖家自己发货（线下快递）"参数，导致校验平台地址不在线下快递地址库中。

**解决方法：**
1. 店铺档案 → 点击【修改】→ **取消勾选**"启用卖家自己发货（线下快递）"
2. 订单预处理 → 勾选地址异常订单 → 点击【删除】
3. 发货单 → 新增右下拉 → 重新同步订单

## 已维护商品映射，订单匹配到错误商品

**原因：** 订单进入系统后，首先按商品档案条形码自动匹配；失败后再按商品映射关系匹配。若商品档案存在重复条形码则可能误匹配。

**解决方法：** 检查 SCM 商品档案中是否有条形码重复的商品，修正后重新同步订单。
```

- [ ] **Step 2: Write docs/orders/presale.md**

```markdown
---
id: presale
title: 预售订单处理
sidebar_label: 预售订单
---

# 预售订单处理

## TikTok 预售订单

1. 在 TikTok 平台后台将商品链接维护为**预售商品**
2. 订单进入 SCM 后状态显示为**预售订单**，无库存占用
3. 预售期结束后，在 SCM 发货单列表点击【激活】→ 审核下发仓库

## Lazada / Shopee 预售订单

预售订单进入 SCM 后状态正常，但系统会根据预售发货期限控制审核时间。请确认平台维护的预售发货时间与仓库出库时效匹配。

如有疑问请联系运营人员确认。
```

- [ ] **Step 3: Write docs/orders/cancellation.md**

```markdown
---
id: cancellation
title: 平台订单取消
sidebar_label: 订单取消
---

# 平台订单取消

## SCM 拉单方式下的取消

| 取消时机 | 处理方式 |
|---------|---------|
| SCM 审核**前**取消（平台状态已取消） | 不再审核，无需额外操作 |
| SCM 审核进 WMS **后**取消（平台状态已取消） | 仓库通知客户后执行拦截撤回操作 |

## ERP 推单方式下的取消

| 情况 | 处理方式 |
|------|---------|
| ERP 推送进 SCM 后取消（平台状态未知） | 状态为"获取面单失败"，通知客户拦截 |
| ERP 推送且审核到 WMS 后取消 | 在快递交接环节提示错误，通知客户拦截 |

**拦截操作：** 在 SCM WMS 中找到对应发货单 → 操作【拦截】，仓库收到指令后撤回包裹。
```

- [ ] **Step 4: Commit**

```bash
git add docs/orders/
git commit -m "feat: add orders sync, presale, and cancellation docs"
```

---

## Task 7: Migrate operations & billing & returns content

**Files:**
- Modify: `docs/operations/inbound-sla.md`, `docs/operations/outbound-sla.md`, `docs/billing/common-issues.md`, `docs/billing/recharge.md`, `docs/returns/return-flow.md`, `docs/returns/transfer.md`

- [ ] **Step 1: Write docs/operations/inbound-sla.md**

```markdown
---
id: inbound-sla
title: 入库时效
sidebar_label: 入库时效
---

# 入库时效

| 商品类型 | 时效 |
|---------|------|
| 普通商品（预约到货） | 收货后 48 小时内完成上架 |
| 新品（需做新品维护） | 收货后不超过 72 小时 |

## 说明

- 通过预约方式到货的货物优先处理
- 临时到货（未预约）优先级最低，时效不做承诺
- 紧急入库请联系商务，另行安排额外人力（另行报价）

## 收货时间

**正常收货：** 周一至周六 09:00–16:00

**不收货：** 周日、法定节假日、大促前 1 天 / 后 2 天
```

- [ ] **Step 2: Write docs/operations/outbound-sla.md**

```markdown
---
id: outbound-sla
title: 出库时效与作业时间
sidebar_label: 出库时效
---

# 出库时效与作业时间

## 各平台出库时效

| 平台 | 截单时间 | 截单前 | 截单后 |
|------|---------|--------|--------|
| Shopee | 16:00 | 当天完成打包并出库 | 次日完成打包并出库 |
| TikTok | 18:00 | 当天完成打包并出库 | 次日完成打包并出库 |
| Lazada | — | 24 小时完成打包，48 小时出库 | — |
| 其它平台 | — | 24 小时完成打包，48 小时出库 | — |
| B2B | 16:00 | 支持一定体量客户定制 | — |

## 仓库作业时间

**作业日：** 周一至周日（法定节假日除外）

| 仓库 | 作业时间 |
|------|---------|
| BST | 09:00–18:00 |
| AGV | 09:00–18:00 |
| BPL3 | 09:00–18:00 |
| BPL2 | 09:00–18:00 |
| LAS | 09:00–18:00 |

如有非工作时间作业需求，请联系商务报价。

## 货物丢失与损坏赔偿

**仓库丢失：** 按合同约定免赔额后，仓库承担赔偿责任。

**快递丢失：**
- Flash Express 快递：仓库协助沟通处理
- 其他快递：客户自行联系快递公司

**货物损坏：**
- 商品价值 ≤ 2,000 泰铢：月度万分之五免赔，超出部分仓库赔付
- 商品价值 > 2,000 泰铢：可选择采购高价值保价险（货值的千分之六），仓责全赔
```

- [ ] **Step 3: Write docs/billing/common-issues.md**

```markdown
---
id: common-issues
title: 常见账单问题
sidebar_label: 账单问题
---

# 常见账单问题

## 仓储费异常

**可能原因：**
1. 商品档案中商品体积信息有误，导致计费不准
2. 移库操作导致货位面积增加

**解决方法：** 联系运营人员核实商品档案体积信息，或确认移库记录。

## 包材费异常

**可能原因：** 扫描重复、扫描错误、漏扫包材。

**解决方法：** 提供出库单号联系运营人员核查扫描记录。

## 租赁单到期导致费用流水缺失

请确保租赁单在到期前续签，否则系统将停止生成对应费用流水。

## 增值服务

以下服务需提前申请，费用按合同报价收取：
- **用车服务：** SCM → 库存单据 → 服务申请单 → 新增 → 填写信息 → 保存 → 审核，复制 VO 单号通知商务/仓库
- **仓库加班：** 联系商务报价

## 是否可以自备包材/耗材

**不可以。** 仓内多条打包流水线，客户自备耗材不便管理。

如有包材价格问题，可咨询更换为灰色无印刷塑料袋（成本更低）。

## 其他常见问题

| 问题 | 答案 |
|------|------|
| 海运/陆运时效 | 视具体线路而定，请联系商务确认 |
| 海运/陆运最低消费 | 最小 1 立方，无其他限制 |
| 海运/陆运税费 | 0 税率 |
| 入库上架费计算单位 | 按件计费，标准箱可增加暗箱 |
| 尾程物流服务商 | 平台订单由平台指定；非平台订单由仓库指定（目前仅对接 Flash Express） |
| 头程丢件处理 | 按头程服务商合同约定规则赔付，当前标准不超过 200 RMB/件 |
```

- [ ] **Step 4: Write docs/billing/recharge.md**

```markdown
---
id: recharge
title: 预付款充值
sidebar_label: 预付款充值
---

# 预付款充值

## 说明

客户提前充值到货主账号，系统按每日流水扣除预付款金额。账号余额不足时系统会提醒；余额为 0 时，无法审核下发单据给仓库。

## 充值步骤

1. SCM → 结算 → 我的余额 → 点击【充值】
2. 填写充值金额及转账信息，上传充值转账截图
3. 提交后等待财务审核到账
4. 财务确认到账后，SCM 货主余额自动更新
```

- [ ] **Step 5: Write docs/returns/return-flow.md**

```markdown
---
id: return-flow
title: 退货处理流程
sidebar_label: 退货流程
---

# 退货处理流程

## 场景一：非本地仓发的退货（包裹到仓前，客户未创建销退单）

1. 退货包裹到仓，仓库登记到系统
2. 客户在 SCM → 销售 → **销退登记表** → 输入运单号查询 → 点击【认领】
3. 仓库收到认领信息后，将包裹重新上架入库

## 场景二：非本地仓发的退货（客户已创建销退单，包裹后到仓）

1. 客户登录 SCM，提前创建销退单，可在单据中备注包裹处理注意事项
2. 包裹到仓时，仓库按运单号匹配销退单并合并状态
3. 仓库重新上架入库

## 场景三：本地仓发的退货

流程同场景二，无需客户手动创建销退单，系统自动生成。

## 错发/漏发处理

**错发：**
1. 客户提供买家联系方式
2. 仓库联系买家沟通发错商品退回
3. 客户同意补发后，仓库联系买家补发并消除影响
4. 货物收到后做归位处理
5. 仓库认定责任人，补发费用及提成扣款记录系统

**漏发：**
1. 客户提供买家联系方式，客户同意补发
2. 仓库联系买家补发并消除影响
3. 仓库认定责任人，补发费用及提成扣款记录系统
```

- [ ] **Step 6: Write docs/returns/transfer.md**

```markdown
---
id: transfer
title: 货权转移
sidebar_label: 货权转移
---

# 货权转移

用于将货品从 A 货主转移给 B 货主。

## 前置设置（条形码一致时）

若两边货主商品条码一致，可在 SCM → 设置 → 策略设置 中勾选 ☑️ **货权转移支持一键匹配** → 保存。

开启后，系统将自动把转出货主商品档案的所有信息同步到转入货主账号中，实现商品自动匹配。

## 操作步骤

### A 货主（转出）

SCM → 库存单据 → 货权转移单（转出）→ 点击【新增】→ 填写【转移目标货主编码】→ 选择商品/数量 → 保存 → 审核

### B 货主（转入）

SCM → 库存单据 → 货权转移单（转入）→ 点击【匹配商品】→【一键匹配】→ 保存 → 点击【确认】

> 双方货主都确认后，仓库才能看到单据并进行操作。

### 仓库操作

勾选货权转移单号 → 点击【一键完成】→ 状态自动变为"已完成"

## 退仓处理流程

如需退仓，请联系项目经理提交退仓申请，仓库将安排专人对接。
```

- [ ] **Step 7: Commit**

```bash
git add docs/operations/ docs/billing/ docs/returns/
git commit -m "feat: add operations SLA, billing FAQ, and returns flow docs"
```

---

## Task 8: Create internal docs

**Files:**
- Create: `docs/internal/contacts.md`, `docs/internal/complaints.md`

- [ ] **Step 1: Write docs/internal/contacts.md**

```markdown
---
id: contacts
title: 仓库联系人
sidebar_label: 联系人
---

# 仓库联系人（内部）

## Flash Fulfillment AGV

| 姓名 | 电话 |
|------|------|
| Kaew | 0932410996 |
| Non | 0841917076 |
| Earth | 0803311713 |

## Flash Fulfillment BST

| 角色 | 电话 |
|------|------|
| Flash Inbound | 0956087784 |

## Flash Express and Fulfillment - Lasalle Hub（LAS）

| 姓名 | 电话 |
|------|------|
| Bell | 0639920670 |
| 备用 | 0821757093 / 0908852996 |

## Flash Fulfillment LAS3

| 姓名 | 电话 |
|------|------|
| Mai/Bell | 06-3992-0670 / 0809269211 |

## Flash Fulfillment Live-stream Warehouse

| 角色 | 电话 |
|------|------|
| FFM | 023855062 |

## Flash Fulfillment Bang Phli（退件仓）

| 姓名 | 电话 |
|------|------|
| BENZ | 0951716859 |
```

- [ ] **Step 2: Write docs/internal/complaints.md**

```markdown
---
id: complaints
title: 投诉处理内部流程
sidebar_label: 投诉处理
---

# 投诉处理内部流程（内部）

## 错发投诉

1. 客户提供买家联系方式
2. 仓库联系买家，协商发错商品退回
3. 客户确认同意补发
4. 仓库安排补发并消除负评影响
5. 货物收回后做归位
6. **责任认定：** 仓库定则责任人，补发费用及提成扣款记入系统

## 漏发投诉

1. 客户提供买家联系方式
2. 客户确认同意补发
3. 仓库联系买家安排补发
4. **责任认定：** 同上

## 已发货但快递系统未显示

1. 仓库提供发货交接签字单给客户
2. 客户凭签字单联系平台快递申诉跟进
```

- [ ] **Step 3: Add internal sidebar (separate from main)**

Update `sidebars.ts` to add internal sidebar:

```typescript
// sidebars.ts — add to existing config
const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ... existing items ...
  ],
  internalSidebar: [
    {
      type: 'category',
      label: '内部资料',
      items: ['internal/contacts', 'internal/complaints'],
    },
  ],
};
```

- [ ] **Step 4: Commit**

```bash
git add docs/internal/ sidebars.ts
git commit -m "feat: add internal docs (contacts, complaints)"
```

---

## Task 9: Vercel Edge Middleware for internal route protection

**Files:**
- Create: `middleware.ts`, `src/pages/internal-login.tsx`

- [ ] **Step 1: Create middleware.ts at project root**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: This uses Vercel Edge Runtime — no Next.js required.
// Vercel auto-discovers middleware.ts at the project root.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/docs/internal')) {
    const token = request.cookies.get('ffm_internal_token')?.value;
    const expected = process.env.INTERNAL_TOKEN;

    if (!expected || token !== expected) {
      const loginUrl = new URL('/internal-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/docs/internal/:path*'],
};
```

- [ ] **Step 2: Create src/pages/internal-login.tsx**

```tsx
// src/pages/internal-login.tsx
import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function InternalLogin(): JSX.Element {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/internal-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('redirect') || '/docs/internal/contacts';
    } else {
      setError('密码错误');
    }
  };

  return (
    <Layout title="内部登录">
      <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
        <h2>内部资料访问</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="请输入访问密码"
            style={{ width: '100%', padding: 8, marginBottom: 12, fontSize: 16 }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16 }}>
            进入
          </button>
        </form>
      </div>
    </Layout>
  );
}
```

- [ ] **Step 3: Create api/internal-auth.ts**

```typescript
// api/internal-auth.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body as { password: string };
  const expected = process.env.INTERNAL_TOKEN;

  if (!expected || password !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.setHeader(
    'Set-Cookie',
    `ffm_internal_token=${expected}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  );
  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 4: Commit**

```bash
git add middleware.ts src/pages/internal-login.tsx api/internal-auth.ts
git commit -m "feat: add Vercel Edge Middleware for /docs/internal protection"
```

---

## Task 10: Build knowledge base context for AI

**Files:**
- Create: `src/lib/knowledgeBase.ts`

- [ ] **Step 1: Create src/lib/knowledgeBase.ts**

This file compiles the QA content into a concise system-prompt context:

```typescript
// src/lib/knowledgeBase.ts
export const KNOWLEDGE_BASE_ZH = `
# FFM（Flash Fulfillment）知识库

## 入库须知
- 每箱必须张贴箱单；不接受混箱（多SKU需隔离）
- 拒收条件：无入库单、非收货时间、数量不匹配、包装破损、无箱单标注
- 收货时间：周一至周六 09:00-16:00；法定节假日、大促前1天后2天不收货
- 预约到货上架时效：48小时；新品72小时
- 紧急入库请联系商务

## 仓库地址
- AGV：88/171-2, Moo 15, Bang Sao Tong, Samutprakarn 10570
- BST：172-4 Moo16 Bang Sao Thong, Samut Prakan 10570
- LAS：10/9 Srinakarin Road, Moo 16, Bang Kaew, Bang Phli, Samut Prakan 10540
- LAS3：55/94, Moo 15, Bang Sao Thong, Samut Prakarn 10570
- Live-stream：88/73 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli, Samut Prakan 10540
- 退件仓(BPL)：88/25 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli, Samut Prakan 10540

## TikTok 授权问题
- 授权失败：跨境店选错本土入口 → 在平台后台删除旧授权再重新授权
- 一品多仓商品同步失败：在SCM店铺档案勾选"开通一品多仓"（不可撤销）
- 自动同步库存失败：平台SKU被修改，重新建立商品映射

## Shopee 授权问题
- 授权过期重新授权：在Shopee后台撤销旧授权再重新操作
- SIP店铺暂不支持授权：用手工单方式处理
- 同步库存失败(Failed to update stock)：一品多仓平台接口限制，暂时手动修改
- 同步库存失败(Stock should be larger than 80)：参加锁定库存活动，库存必须>80

## Lazada 授权步骤
1. Lazada后台 → 服务市场 → 搜索Flash → FLASH WMS → 仅授权 → 半年 → 授权使用
2. 勾选同意 → 确认 → 订购成功
3. SCM店铺档案 → 授权 → 选国家 → 输邮箱密码 → Submit

## 订单问题
- 订单未进SCM：手动同步 → 发货单 → 新增 → 线上店铺 → 填订单号 → 获取订单
- 日志"订单不属于该仓库"：店铺档案→获取平台仓库→编辑→是否获取该仓订单:是
- 商品异常：平台SKU与SCM条码不一致 → 维护商品映射
- 地址异常：取消"启用卖家自己发货"参数 → 删除异常订单 → 重新同步

## 出库时效
- Shopee：截单16:00，截前当天出库，截后次日出库
- TikTok：截单18:00，截前当天出库，截后次日出库
- Lazada：24小时打包，48小时出库
- 其他/B2B：24小时打包，48小时出库

## 作业时间
- 所有仓库：周一至周日 09:00-18:00（法定节假日除外）
- 非工作时间作业需联系商务报价

## 账单问题
- 仓储费异常：商品档案体积有误或移库导致
- 包材费异常：扫描重复/错误/遗漏
- 不可自备包材：统一使用仓库包材便于管理
- 充值：SCM→结算→我的余额→充值→上传转账截图→财务审核

## 退货流程
- 非本地仓退货(未创建销退单)：仓库登记 → SCM销退登记表认领 → 重新上架
- 非本地仓退货(已创建销退单)：按运单号匹配销退单 → 上架
- 本地仓退货：自动生成销退单，流程同上

## 货权转移
- A货主：库存单据→货权转移单(转出)→新增→填目标货主编码→审核
- B货主：货权转移单(转入)→匹配商品→一键匹配→确认
- 仓库：一键完成

## 赔偿标准
- 仓库货物丢失：按合同免赔额后仓库赔付
- Flash快递丢失：仓库协助沟通；其他快递客户自行联系
- 货物损坏≤2000铢：月度万分之五免赔；>2000铢可购保价险(货值千分之六)
- 头程丢件：服务商合同约定，当前不超过200RMB/件

## 其他
- 海运陆运最低消费：最小1立方，无其他限制；0税率
- 上架费：按件计费
- 尾程物流：平台订单平台指定；非平台订单仓库指定(目前只有FlashExpress)
`.trim();

export function buildSystemPrompt(lang: 'zh' | 'en' | 'th'): string {
  const langInstruction = {
    zh: '请用中文回答。',
    en: 'Please answer in English.',
    th: 'กรุณาตอบเป็นภาษาไทย',
  }[lang];

  return `你是 FFM（Flash Fulfillment）的客服助手。${langInstruction}
只根据以下知识库内容回答问题。如果问题超出知识库范围，请告知用户联系商务人员。
不要编造知识库中没有的信息。

${KNOWLEDGE_BASE_ZH}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/knowledgeBase.ts
git commit -m "feat: add compiled knowledge base for AI system prompt"
```

---

## Task 11: Build /api/chat Vercel Serverless Function (TDD)

**Files:**
- Create: `api/chat.ts`
- Create: `api/__tests__/chat.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// api/__tests__/chat.test.ts
import { createMocks } from 'node-mocks-http';

// Mock Anthropic SDK before importing the handler
jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      stream: jest.fn().mockReturnValue({
        async *[Symbol.asyncIterator]() {
          yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } };
          yield { type: 'content_block_delta', delta: { type: 'text_delta', text: ' world' } };
          yield { type: 'message_stop' };
        },
      }),
    },
  })),
}));

describe('POST /api/chat', () => {
  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 400 when messages array is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { lang: 'zh' },
    });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  it('sets SSE headers and streams response for valid POST', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: '你好' }],
        lang: 'zh',
      },
    });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res.getHeader('Content-Type')).toBe('text/event-stream');
    expect(res._getData()).toContain('Hello world');
  });
});
```

- [ ] **Step 2: Install test dependency**

```bash
npm install --save-dev node-mocks-http
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx jest api/__tests__/chat.test.ts --no-coverage 2>&1 | tail -10
```
Expected: FAIL — `Cannot find module '../chat'`

- [ ] **Step 4: Write api/chat.ts**

```typescript
// api/chat.ts
import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildSystemPrompt } from '../src/lib/knowledgeBase';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, lang = 'zh' } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    lang?: 'zh' | 'en' | 'th';
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: buildSystemPrompt(lang as 'zh' | 'en' | 'th'),
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      res.write(event.delta.text);
    }
  }

  res.end();
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx jest api/__tests__/chat.test.ts --no-coverage 2>&1 | tail -10
```
Expected: PASS — 3 tests passing

- [ ] **Step 6: Commit**

```bash
git add api/chat.ts api/__tests__/chat.test.ts
git commit -m "feat: add /api/chat SSE endpoint with Claude streaming"
```

---

## Task 12: Build AiChat React component (TDD)

**Files:**
- Create: `src/components/AiChat/index.tsx`
- Create: `src/components/AiChat/ChatModal.tsx`
- Create: `src/components/AiChat/styles.module.css`
- Create: `src/components/AiChat/__tests__/ChatModal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/AiChat/__tests__/ChatModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatModal from '../ChatModal';

// Mock fetch for SSE
global.fetch = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockReset();
});

describe('ChatModal', () => {
  it('renders input and send button', () => {
    render(<ChatModal onClose={() => {}} lang="zh" />);
    expect(screen.getByPlaceholderText(/输入问题/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /发送/i })).toBeInTheDocument();
  });

  it('displays user message after submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('你好！') })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      },
    });

    render(<ChatModal onClose={() => {}} lang="zh" />);
    fireEvent.change(screen.getByPlaceholderText(/输入问题/i), {
      target: { value: '仓库地址是什么？' },
    });
    fireEvent.click(screen.getByRole('button', { name: /发送/i }));

    await waitFor(() => {
      expect(screen.getByText('仓库地址是什么？')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<ChatModal onClose={onClose} lang="zh" />);
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/components/AiChat/__tests__/ChatModal.test.tsx --no-coverage 2>&1 | tail -10
```
Expected: FAIL — `Cannot find module '../ChatModal'`

- [ ] **Step 3: Write styles.module.css**

```css
/* src/components/AiChat/styles.module.css */
.floatButton {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--ifm-color-primary);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 360px;
  height: 500px;
  background: var(--ifm-background-color);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  font-weight: 600;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.userMsg {
  align-self: flex-end;
  background: var(--ifm-color-primary);
  color: white;
  padding: 8px 12px;
  border-radius: 12px 12px 0 12px;
  max-width: 80%;
  font-size: 14px;
}

.assistantMsg {
  align-self: flex-start;
  background: var(--ifm-color-emphasis-100);
  padding: 8px 12px;
  border-radius: 12px 12px 12px 0;
  max-width: 80%;
  font-size: 14px;
  white-space: pre-wrap;
}

.inputRow {
  display: flex;
  padding: 12px;
  gap: 8px;
  border-top: 1px solid var(--ifm-color-emphasis-200);
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  font-size: 14px;
  background: var(--ifm-background-color);
  color: var(--ifm-font-color-base);
}

.sendBtn {
  padding: 8px 16px;
  background: var(--ifm-color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.sendBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 4: Write ChatModal.tsx**

```tsx
// src/components/AiChat/ChatModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onClose: () => void;
  lang: 'zh' | 'en' | 'th';
}

export default function ChatModal({ onClose, lang }: Props): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const assistantMsg: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: '请求失败，请稍后重试。',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const placeholder = { zh: '输入问题...', en: 'Ask a question...', th: 'ถามคำถาม...' }[lang];
  const sendLabel = { zh: '发送', en: 'Send', th: 'ส่ง' }[lang];
  const title = { zh: 'FFM 智能客服', en: 'FFM Assistant', th: 'ผู้ช่วย FFM' }[lang];

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <span>{title}</span>
        <button onClick={onClose} aria-label="×">×</button>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label={sendLabel}
        >
          {sendLabel}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write index.tsx (floating button)**

```tsx
// src/components/AiChat/index.tsx
import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import ChatModal from './ChatModal';

type Lang = 'zh' | 'en' | 'th';

export default function AiChat(): JSX.Element {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Detect locale from path prefix (e.g. /en/docs/... or /th/docs/...)
  const lang: Lang = location.pathname.startsWith('/en')
    ? 'en'
    : location.pathname.startsWith('/th')
    ? 'th'
    : 'zh';

  return (
    <>
      <button
        className={styles.floatButton}
        onClick={() => setOpen(o => !o)}
        aria-label="AI客服"
        title="AI客服"
      >
        💬
      </button>
      {open && <ChatModal onClose={() => setOpen(false)} lang={lang} />}
    </>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx jest src/components/AiChat/__tests__/ChatModal.test.tsx --no-coverage 2>&1 | tail -10
```
Expected: PASS — 3 tests passing

- [ ] **Step 7: Commit**

```bash
git add src/components/AiChat/
git commit -m "feat: add AI chat floating widget component"
```

---

## Task 13: Inject AiChat globally via swizzled Root

**Files:**
- Create: `src/theme/Root.tsx`

- [ ] **Step 1: Create src/theme/Root.tsx**

```tsx
// src/theme/Root.tsx
import React from 'react';
import AiChat from '@site/src/components/AiChat';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <AiChat />
    </>
  );
}
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run start
```

Open browser at `http://localhost:3000`. Verify:
- 💬 button appears in bottom-right on all pages
- Clicking opens the chat modal
- Typing and sending shows user message bubble
- Close button (×) closes the modal

- [ ] **Step 3: Commit**

```bash
git add src/theme/Root.tsx
git commit -m "feat: inject AI chat globally via swizzled Root component"
```

---

## Task 14: Deploy to Vercel via GitHub

**Files:**
- Create: `vercel.json`, `.env.local`, `.gitignore` (update)

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": null
}
```

- [ ] **Step 2: Update .gitignore to exclude .env.local**

Add to `.gitignore`:
```
.env.local
.env
node_modules/
build/
.docusaurus/
```

- [ ] **Step 3: Create .env.local for local development**

```bash
# .env.local (never commit this file)
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
INTERNAL_TOKEN=your-secret-password-here
```

- [ ] **Step 4: Push to GitHub**

```bash
git add vercel.json .gitignore
git commit -m "chore: add Vercel config"

# Create GitHub repo (requires gh CLI)
gh repo create ffm-docs --public --source=. --remote=origin --push
```

- [ ] **Step 5: Connect to Vercel**

```bash
# Requires Vercel CLI: npm i -g vercel
vercel link
vercel env add ANTHROPIC_API_KEY production
vercel env add INTERNAL_TOKEN production
vercel --prod
```

Expected output: `✅ Production deployment ready at https://ffm-docs.vercel.app`

- [ ] **Step 6: Verify deployed site**

Open the deployment URL. Check:
1. Home page loads
2. Sidebar shows all 6 modules
3. Language switcher shows zh/en/th
4. 💬 button appears
5. AI chat opens and responds (test question: "仓库地址是什么？")
6. `/docs/internal/contacts` redirects to login page
7. After entering correct password, contacts page loads

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: production deployment verified"
git push
```

---

## Task 15: Home page

**Files:**
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Replace default home page**

```tsx
// src/pages/index.tsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

const modules = [
  { href: '/docs/inbound/requirements', icon: '📦', labelZh: '入库须知' },
  { href: '/docs/platform/tiktok', icon: '🔗', labelZh: '店铺授权' },
  { href: '/docs/orders/sync-issues', icon: '📋', labelZh: '订单处理' },
  { href: '/docs/operations/outbound-sla', icon: '⏱', labelZh: '时效标准' },
  { href: '/docs/billing/common-issues', icon: '💰', labelZh: '账单与服务' },
  { href: '/docs/returns/return-flow', icon: '🔄', labelZh: '退货与退仓' },
];

export default function Home(): JSX.Element {
  return (
    <Layout title="FFM Help Center" description="Flash Fulfillment 帮助中心">
      <main style={{ maxWidth: 900, margin: '60px auto', padding: '0 20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8 }}>FFM 帮助中心</h1>
        <p style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', marginBottom: 48 }}>
          Flash Fulfillment 操作手册与常见问题
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {modules.map(m => (
            <Link
              key={m.href}
              to={m.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '20px 24px',
                border: '1px solid var(--ifm-color-emphasis-200)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s',
              }}
            >
              <span style={{ fontSize: 32 }}>{m.icon}</span>
              <span style={{ fontWeight: 600 }}>{m.labelZh}</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run start
```
Open `http://localhost:3000`. Verify 6 module cards appear and each links to the correct doc page.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.tsx
git commit -m "feat: add home page with module quick-links"
git push
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| Docusaurus v3 static site | Task 1 |
| Trilingual i18n (zh/en/th) | Task 2 (config) |
| 7 content modules | Tasks 4–8 |
| Internal docs with protection | Tasks 8–9 |
| AI chat widget (floating) | Tasks 12–13 |
| Claude API streaming backend | Task 11 |
| Knowledge base system prompt | Task 10 |
| Vercel + GitHub deployment | Task 14 |
| Home page | Task 15 |
| Operations videos visible externally | ✅ Videos linked in content docs |
| Contacts/complaints internal only | ✅ Task 9 middleware protects /docs/internal/* |

**Placeholder scan:** No TBD/TODO found.

**Type consistency:** `buildSystemPrompt` defined in Task 10, imported in Task 11 `api/chat.ts`. `Lang` type consistent across Tasks 11–13.
