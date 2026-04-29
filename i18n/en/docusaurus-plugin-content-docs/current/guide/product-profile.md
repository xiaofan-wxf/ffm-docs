---
id: product-profile
title: Creating Product Profiles
sidebar_label: Product Profiles
---

# Creating Product Profiles

Product profiles are the foundation of the SCM system. All inbound and outbound operations use the barcode in the profile for identification.

## Creating a Single Product Profile

**Path:** Products → Product Profiles → Click **[New]** → Enter barcode and product name → Click **[Save]**

![Product profile list, click New](/img/01_商品档案列表.jpg)

**Field Reference:**

| Field | Description |
|-------|-------------|
| Product Barcode | The actual barcode on the product. Used when scanning during inbound. |
| Product Name | Supports Chinese, English, and Thai. |

![New product profile form](/img/01_新增商品档案.jpg)

:::caution
Newly created profiles default to **Draft** status. You must click **[Enable]** before the product can be used in inbound or outbound orders.
:::

**To enable:** Go to the Product Profiles list → Select the product → Click **[Enable]**

---

## Bulk Import

Use this when you have many products to add at once.

**Path:** Products → Product Profiles → Dropdown next to **[New]** → **[Bulk Import]** → Download template → Fill in product info → Save → Click **[Open File]** → Upload → Click **[Import]**

![Bulk import entry](/img/02_批量导入界面.jpg)

**Template Fields:**

| Column | Field |
|--------|-------|
| Barcode | Product barcode (maps to "Product Barcode" in SCM) |
| Commodity name | Product name (maps to "Product Name" in SCM) |
| Specification | Spec / variant |
| Shelf life item or not | Whether the product has an expiry date |

![Excel template format example](/img/02_批量导入模板字段.jpg)

**Steps:**

1. Click **[Download Template]** on the bulk import page
2. Fill in product data following the template format and save
3. Click **[Open File]** to upload the completed file
4. When the system shows "Importable quantity: X rows", click **[Import]**
5. After import, go back to the product list and bulk **[Enable]** the new profiles

:::tip
If a row shows "Not importable", it's usually a duplicate barcode or a required field left blank. Fix the row and re-upload.
:::
