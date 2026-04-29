---
id: order-preprocessing
title: "Order Pre-Processing: Product Exception Handling"
sidebar_label: Order Pre-Processing
---

# Order Pre-Processing: Product Exception Handling

When an order enters SCM, the system automatically matches products in this order:

1. **First:** Auto-match by product barcode in the product profile
2. **Second:** Match by barcode maintained in the product mapping

When a platform order enters an exception state due to a product error that can't be matched, there are two ways to resolve it.

---

## Entry 1: Manual Mapping in Order Pre-Processing

**Path:** Sales → Order Pre-Processing

1. Search for the platform order number in the "External Order No." field
2. Click the **icon** in the "Barcode" column
3. In the popup, enter the correct SCM product barcode
4. Click **[Auto-Map Exception Products]**
5. Click **[Generate Shipment Order]**

![Order pre-processing - product exception handling](/img/23_订单预处理_商品异常处理.jpg)

---

## Entry 2: Maintain Product Mapping Directly

If this is a systemic SKU mismatch (affecting multiple orders), fix it in the product mapping so all future orders are handled automatically:

**Path:** Products → Product Mapping

1. Find the platform SKU entry
2. Enter the correct SCM barcode in the "Barcode" field
3. Click **[Update Inventory]**

Once maintained, future orders with the same SKU will match automatically — no need to handle each order individually.

---

## Common Product Exception Causes

| Cause | Resolution |
|-------|-----------|
| Platform product listing has no Seller SKU | Add the Seller SKU in the platform's product management |
| Platform SKU doesn't match SCM barcode | Manually maintain the mapping in Product Mapping |
| Duplicate barcode in product profiles | Find and fix duplicate barcodes in SCM Product Profiles |
| Product profile not enabled | Change the product status to **[Enable]** in Product Profiles |

For more order sync issues, see [Order Sync Issues](../orders/sync-issues).
