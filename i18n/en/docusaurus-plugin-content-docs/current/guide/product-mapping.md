---
id: product-mapping
title: Product Mapping & Inventory Sync
sidebar_label: Product Mapping
---

# Product Mapping & Inventory Sync

Product mapping links the **platform Seller SKU** to the **SCM product barcode**, allowing platform orders to automatically match the correct product in SCM and synchronizing warehouse stock back to the platform.

## Product Mapping Setup

**Path:** SCM → Products → Product Mapping → Click dropdown next to **[New]** → **[Sync Products]**

1. Select the store to map
2. Set time range to **All**
3. Click **[Get Products]** or **[Sync Inventory]**
4. Platform SKUs are pulled into SCM and current warehouse stock is synced to the platform

:::info
If the product profile barcode exactly matches the platform SKU, the system **auto-matches** — no manual mapping needed.
:::

### When Barcode and Platform SKU Don't Match

Manual mapping is required:

1. Find the unmatched entry in the Product Mapping list
2. Click the entry to open its details
3. Enter the SCM product barcode in the "Barcode" field
4. Click **[Update Inventory]** to sync stock to the platform

---

## Bundle Product Mapping

Use this when the platform lists a bundle SKU (multiple individual products sold together).

### Steps

**Step 1: Create a Bundle Profile in SCM**

Path: Products → Product Bundles → Click **[New]**

![Bundle profile list](/img/20_套装档案列表.jpg)

1. Enter the bundle name
2. Add the individual products and quantities (selected from existing product profiles)
3. Save → Click **[Enable]**

![Create bundle profile](/img/20_套装档案创建.jpg)

**Step 2: Sync Platform Bundle Products**

Same as standard product mapping: Product Mapping → New dropdown → Sync Products → Select store → Get Products

**Step 3: Configure Bundle Mapping**

1. Find the platform bundle SKU in the Product Mapping list
2. Copy the SCM bundle profile barcode
3. Paste the bundle barcode into the "Barcode" field for that entry
4. Click **[Update Inventory]** to sync bundle stock to the platform

![Bundle mapping](/img/21_套装映射关系.jpg)

![Bundle inventory update](/img/21_套装库存更新.jpg)

---

## Manual Inventory Sync

### Single SKU Sync

**Path:** Products → Product Mapping → Find the product → Click **[Update Inventory]** on the right

![Single SKU inventory update](/img/22_单SKU库存更新.jpg)

After clicking, check **[Inventory Update Log]** to view success or failure details.

### Batch Sync by Store

**Path:** Products → Product Mapping → Dropdown next to New → **[Sync Products]**

![Batch sync by store](/img/22_按店铺批量同步.jpg)

1. Select the store
2. Set time range to **All**
3. Click **[Sync Inventory]** → Syncs current warehouse stock to the platform

After sync completes, check **Product Mapping → Inventory Update Log** for results.
