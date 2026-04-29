---
id: store-setup
title: Store Profile Creation & Authorization
sidebar_label: Store Setup & Auth
---

# Store Profile Creation & Authorization

## Adding a Store

**Path:** SCM → Settings → Store Profiles → Click **[New]**

1. Enter the store name
2. Select the sales platform (TikTok / Shopee / Lazada / Other)
3. Select the country
4. Enter a store description (optional)
5. Sender info: select "Use warehouse sender address"
6. Click **[Save]** → Click **[Enable]**

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
| Cross-border 3PF | Select "3P Seller" (choose the sub-account entry for Thailand, etc.) |
| Local store | Select "Thailand" and log in with account credentials |

:::caution Cross-border stores
For TikTok cross-border stores: after authorizing the main account, you must select the specific sub-store — it's a one-to-one authorization.
:::

#### TikTok Multi-Warehouse Authorization

For TikTok multi-warehouse stores, check "Enable Multi-Warehouse" when creating/editing the store profile in SCM:

1. Confirm that the TikTok multi-warehouse whitelist has been approved on the TikTok platform
2. SCM Store Profile → Edit → Check ☑️ **Enable Multi-Warehouse**
3. Cannot be unchecked after saving — proceed with authorization

**How to identify TikTok multi-warehouse:** When creating a global product on TikTok, go to the [Warehouse & Inventory] module:
- **Multi-warehouse:** You can assign the product to different warehouses and enter stock per warehouse
- **Standard (non-multi):** Only one warehouse can be selected per country

---

### Shopee Authorization

**Path:** SCM → Settings → Store Profiles → Find the Shopee store → Click **[Authorize]**

| Store Type | Login Method |
|-----------|-------------|
| Local store | Select country, enter account credentials |
| 3PF cross-border store | Click "Switch to Sub Account" and log in with the main account |

---

### Lazada Authorization

Lazada authorization has two steps: **subscribe to Flash WMS on the Lazada service marketplace first, then authorize in SCM**.

#### Step 1: Lazada Service Marketplace

1. Log in to Lazada Seller Center → Click **Service Marketplace**
2. Search `Flash` → Find **FLASH WMS**
3. Select **[Authorize Only]** → Period: **6 months** → Click **[Authorize]**
4. Check "I agree and sign" → Click **[Confirm]** → "Order successful" message appears

#### Step 2: SCM System Authorization

5. Return to SCM → Settings → Store Profiles → Select the store → Click **[Authorize]**
6. Select country → Enter store login email and password → Click "Submit"
7. "Authorization success" confirms the store is linked

After success, the store's authorization status in SCM updates to **Authorized** with the expiry date shown.

:::tip
Lazada authorization has an expiry date. Renew before it expires or orders will stop syncing.
:::

---

## Post-Authorization Configuration

### 1. Update Shipping Address on the Platform

After authorization, update the **shipping address** in the platform's store backend to the Flash warehouse address:
- TikTok: Merchant Profile → Warehouse Management → Select Flash Fulfillment warehouse
- Lazada: Seller Center → Logistics → Shipping Address → Enter the Flash warehouse address

### 2. Platform Warehouse Settings in SCM

**Path:** SCM → Settings → Store Profiles → Find the authorized store → Click **[Edit]**

1. Click **[Get Platform Warehouses]** to pull the warehouse list from the platform
2. Find the Flash warehouse → Click **[Edit]** on the right
3. Set "Get orders from this warehouse": **Yes**
4. Select the corresponding FFM warehouse → Save

---

## Auto Order Approval

Once enabled, orders entering SCM are automatically approved and sent to the warehouse without manual review.

**Path:** SCM → Settings → Policy Settings → Order Review Settings → Click **[Edit]**

1. Check ☑️ **Enable Smart Auto-Approval**
2. Click **[Save]**

:::info
By default this applies to all stores and all order sources. You can also enable it for individual stores only.
:::

---

## Automatic Inventory Sync

Inventory sync requires product mapping to be set up first (see [Product Mapping Guide](./product-mapping)), then enable auto-sync.

### Batch Edit by Store

**Path:** Products → Product Mapping → **[Batch Edit by Store]**

1. Select the store to enable auto inventory sync for
2. Set "Enable Inventory Update": **Yes**
3. Set "Inventory Update Percentage": default **100%** (syncs all warehouse stock to the platform)
   - If multiple stores share the same warehouse stock, enter the percentage accordingly
4. Save — the system will sync on a scheduled basis

### Batch Edit Inventory Info by Product

**Path:** Products → Product Mapping → Select products → Click **[Batch Edit Inventory Info]**

Set "Enable Inventory Update: Yes" and "Inventory Update Percentage", then save.
