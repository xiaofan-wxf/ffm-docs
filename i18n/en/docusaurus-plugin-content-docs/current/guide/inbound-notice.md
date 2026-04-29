---
id: inbound-notice
title: Creating Inbound Notices
sidebar_label: Inbound Notice
---

# Creating Inbound Notices

An Inbound Notice (AN order) is the document used for receiving goods into the warehouse. The warehouse uses it to receive and shelve your shipment.

## Basic Process

**Path:** SCM → Inventory Documents → Inbound Notices → Click **[New]**

![Inbound Notice list](/img/03_入库通知单列表.jpg)

### Step 1: Fill in the Inbound Notice

1. Enter the inbound notice creation page
2. Select the inbound type
3. Click **[Select]** in the product section to add items
4. Enter the quantity for each product
5. Add any notes in the remarks field (e.g. tracking number for the first-leg shipment)
6. Click **[Save]**

![New Inbound Notice form](/img/03_新增入库通知单.jpg)

:::caution Important
A newly saved inbound notice has status **Pending Review**. **Once approved and sent to the warehouse, you can no longer create box label information.** Always complete the box list management before approving.
:::

### Step 2: Create Box List (Packing Information)

The box list is attached to the outside of each carton so the warehouse can identify the owner and inbound notice on arrival.

**Path:** Inventory Documents → Inbound Notices → Click the AN number (status: Unapproved) → Enter details page → Click **[Box List Management]**

![Click blue AN number to enter details](/img/04_入库单详情_点击AN单号.jpg)

![Box List Management page](/img/04_入库单详情_箱单管理按钮.jpg)

There are two ways to fill in packing information:

#### Method A: Direct Edit (few SKUs)

Click **[Edit]** → Add products and quantities per box → Click **[Save]**

![Select products](/img/05_箱单管理_选择商品.jpg)

![Fill in packing information](/img/05_箱单管理_填写分箱信息.jpg)

#### Method B: Bulk Import (many SKUs or many boxes)

1. Click **[Bulk Import]** → **[Download Template]** to get the box list template
2. Fill in the template:

| Column | Description |
|--------|-------------|
| Quantity Per Box | Number of units of this product per box |
| Number Of Boxes | Total number of boxes |
| Barcode | Actual barcode of the product |

![Excel box list template format](/img/06_批量导入分箱_模板字段.jpg)

3. Save the file and click **[Open File]** to upload
4. When the system shows "Importable quantity: X rows", click **[Import]**

![Import complete](/img/06_批量导入分箱_完成.jpg)

5. After import, click **[Download Box List]** to generate a PDF

### Step 3: Print Box List and Approve

1. Download the box list PDF and print it

![Box list PDF download](/img/07_箱单下载PDF.jpg)

![Box label style](/img/07_箱单标签样式.jpg)

2. Affix the labels to the outside of each corresponding carton
3. Go back to the inbound notice list → Select the AN order → Click **[Approve]** to send to warehouse

**Box label contents:** Automatically generated label including: owner info, inbound notice number, box number/total boxes, product barcodes and quantities.

---

## Mixed-SKU Box

Use when one carton contains multiple SKUs.

**Path:** Inventory Documents → Inbound Notices → Click the unapproved AN number → Click **[Edit]**

1. Click **[Add Product]** and select items
2. Click **[Mixed Box]** and enter the mixed quantities
3. Fill in quantity per box and number of boxes for each row
4. Click **[Save]**

![Mixed box operation interface](/img/08_混箱操作界面.jpg)

![Mixed box packing complete](/img/08_混箱分箱完成.jpg)

5. Click **[Download Box List]** to export the mixed-box PDF
6. Print and affix to the corresponding cartons

![Mixed box label](/img/09_混箱箱单标签.jpg)

**Mixed Box Label Example:**

![Mixed box list example](/img/10_混箱箱单示例.jpg)

![Mixed box list example 2](/img/10_混箱箱单示例2.jpg)

:::info
For mixed boxes, all SKUs in the same carton are printed on a single label for easy warehouse verification.
:::
