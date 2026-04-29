---
id: store-setup
title: Store Profile Creation & Authorization
sidebar_label: Store Setup & Auth
---

# Store Profile Creation & Authorization

## Adding a Store

**Path:** SCM → Settings → Store Profiles → Click **[New]**

![Store profile list, click New](/img/11_店铺档案列表.jpg)

1. Enter the store name
2. Select the sales platform (TikTok / Shopee / Lazada / Other)
3. Select the country
4. Click **[Save]** → Click **[Enable]**

![New store profile form](/img/11_新增店铺档案.jpg)

:::caution
Newly added stores default to Draft status. Click **[Enable]** before use. After saving, proceed with platform authorization, then return to configure the store API settings.
:::

---

## Store Authorization

### TikTok Authorization

**Path:** SCM → Settings → Store Profiles → Find the TikTok store → Click **[Authorize]**

TikTok cross-border 3PF and local stores use different authorization entries:

| Store Type | Authorization Entry |
|-----------|-------------------|
| Cross-border 3PF | Select "Plus Seller" |
| Local store | Select "Thailand" and log in with account credentials |

![TikTok authorization entry selection](/img/12_TikTok授权入口.jpg)

:::caution Cross-border stores
For TikTok cross-border stores: after authorizing the main account, you must select the specific sub-store — it's a one-to-one authorization. The multi-warehouse option must be checked when creating the store profile and **cannot be unchecked after saving**.
:::

![TikTok multi-warehouse explanation](/img/12_TikTok一品多仓说明.jpg)

---

### Shopee Authorization

**Path:** SCM → Settings → Store Profiles → Find the Shopee store → Click **[Authorize]**

| Store Type | Login Method |
|-----------|-------------|
| Local store | Select country, enter account credentials |
| 3PF cross-border store | Click "Switch to Sub Account" and log in with the main account |

![Shopee authorization - local store](/img/13_Shopee授权_本土店.jpg)

![Shopee authorization - 3PF](/img/13_Shopee授权_3PF.jpg)

---

### Lazada Authorization

Lazada requires subscribing to Flash WMS on the Lazada service marketplace first, then completing authorization in SCM.

:::caution
Lazada has updated its authorization process. Please follow the latest steps below.
:::

1. Log in to Lazada Seller Center → Click **[Service Marketplace]**

![Lazada service marketplace search](/img/14_Lazada服务市场搜索.jpg)

2. Search `Flash` → Find **Flash WMS** → Click the app → Select **[Authorize Only]** → Period: **6 months** → Click **[Authorize]**

![Lazada select authorization method](/img/14_Lazada选择授权方式.jpg)

3. Check "I agree and sign" → Click **[Confirm]** → "Order successful" message appears

![Lazada confirm order](/img/15_Lazada确认订购.jpg)

![Lazada order successful](/img/15_Lazada订购成功.jpg)

4. On the order success page, click the "Authorize Service" button
5. Return to SCM → Settings → Store Profiles → Find the Lazada store → Click **[Authorize]**
6. On the Lazada Open Platform authorization page, select country → Enter email and password → Submit

![Lazada Open Platform authorization](/img/16_Lazada_OpenPlatform授权.jpg)

![Lazada authorization successful](/img/16_Lazada授权成功.jpg)

---

## Bind Flash Warehouse

After authorization, you must bind the platform warehouse to the Flash warehouse in SCM so the system can correctly pull orders from that warehouse.

**Path:** Settings → Store Profiles → Find the authorized store → Click **[Edit]**

1. Click **[Get Platform Warehouses]** to pull the warehouse list from the platform
2. Click **[Edit]** on the right side of the warehouse entry

![Platform warehouse settings](/img/17_平台仓库设置.jpg)

3. Set "Get orders from this warehouse": **Yes**
4. Under "Assign to specific FFM warehouse", select the corresponding Flash warehouse
5. Click **[Save]**

![Warehouse binding configuration](/img/17_仓库绑定配置.jpg)

:::caution Important
This step must be completed before the system will pull orders from the corresponding Flash warehouse. If orders are not appearing in SCM, check this configuration first.
:::

---

## Enable Auto Order Approval

Once enabled, orders entering SCM are automatically approved and sent to the warehouse without manual review.

**Path:** SCM → Settings → Policy Settings → Order Review Settings → Click **[Edit]**

1. Check ☑️ **Enable Smart Auto-Approval**
2. Click **[Save]**

:::info
By default this applies to all stores and all order sources. You can also enable it for individual stores only.
:::

---

## Auto Inventory Sync Settings

Inventory sync requires product mapping to be set up first (see [Product Mapping Guide](./product-mapping)), then enable auto-sync.

### Batch Edit by Store

**Path:** Products → Product Mapping → **[Batch Edit by Store]**

![Product mapping list](/img/18_商品映射关系列表.jpg)

1. Select the store to enable auto inventory sync for
2. Set "Enable Inventory Update": **Yes**
3. Set "Inventory Update Percentage": default **100%** (syncs all warehouse stock to the platform)
   - If multiple stores share the same warehouse stock, enter the percentage accordingly
4. Save — the system will sync on a scheduled basis

![Batch edit by store](/img/18_按店铺批量修改.jpg)

### Batch Edit Inventory Info by Product

**Path:** Products → Product Mapping → Select products → Click **[Batch Edit Inventory Info]**

![Select products for batch edit](/img/19_勾选商品批量修改.jpg)

Set "Enable Inventory Update: Yes" and "Inventory Update Percentage", then save.

![Batch edit inventory info](/img/19_批量修改库存信息.jpg)
