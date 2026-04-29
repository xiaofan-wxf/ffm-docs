---
id: sync-issues
title: Order Sync Issues
sidebar_label: Order Sync
---

# Order Sync Issues

## Order Not Entering SCM

**Cause:** The order was manually marked as shipped on the platform, causing a status change that prevents the API from pushing it to SCM.

### Method 1: Manual Order Creation + Upload Platform Shipping Label

Use when **the platform order was already marked as shipped and the order cannot be fetched via API**:

1. SCM → Sales → Shipment Orders → Click **[New]** → Fill in consignee info and the **platform tracking number** (phone number must start with 0, 9 digits) → Enter products and quantities → Click **[Save]** → Click **[Approve]**
2. The shipment order status changes to **Failed to Fetch Label**
3. Log in to the platform and download the shipping label PDF for that order
4. Go back to the shipment order in SCM → Click **[Handle Failed Label Fetch]** in the header → Upload the label PDF
5. The system verifies the label matches a platform courier and automatically links it — status changes to **Outbounding**, and the order is sent to the warehouse normally

### Method 2: Sync via External Order Number

Use when **the platform order status is normal but it wasn't auto-fetched** (including COD orders):

1. SCM → Sales → Shipment Orders → Click the dropdown next to **[New]** → Select **Online Store**
2. Enter the external order number (platform order ID) → Click **[Fetch Order]** and **[Sync Order Log]**
3. The order should now appear in the shipment order list

**COD order note:** COD order API pushes are delayed compared to regular paid orders. Wait a moment for automatic sync, or use Method 2 above.

## Sync Log: Order does not belong to this warehouse

**Full log:** `Not configured to get orders from this warehouse: 748226486355xxxxxxxx`

**Troubleshooting steps:**
1. SCM → Settings → Store Profile → Find the store the order belongs to → Click **[Edit]**
2. Click **[Fetch Platform Warehouses]** → Check if Flash warehouse appears
3. If another warehouse is shown, update the shipping address to Flash warehouse address in the platform back-end
4. Click **[Fetch Platform Warehouses]** again → When Flash warehouse appears, click **[Edit]**
5. Set "Fetch orders from this warehouse": **Yes** → Save

![Store Profile Settings](/img/img_039.png)
![Fetch Platform Warehouses](/img/img_040.png)

## Order Pre-processing Exceptions

### Product Exception

**Causes:**
- Seller SKU not maintained in the platform product listing
- Platform SKU does not match the product profile in SCM

**Solution:** Manually maintain the mapping in SCM product mapping, or correct the platform SKU and re-sync.

### Address Exception

**Cause:** The store profile has "Enable seller's own shipping (offline courier)" checked, causing the system to fail address validation because the platform address is not in the offline courier address database.

**Solution:**
1. Store Profile → Click **[Edit]** → **Uncheck** "Enable seller's own shipping (offline courier)"
2. Order Pre-processing → Select address-exception orders → Click **[Delete]**
3. Shipment Orders → New dropdown → Re-sync the orders

![Uncheck Offline Courier](/img/img_041.png)
![Re-sync Orders](/img/img_042.png)

:::tip Thai Address Region Selection
Thai addresses in SCM follow a **Sub-district → District → Province** three-level structure, searchable by **English / Thai / postal code**:
- **SCM Web:** Address fields support Chinese, English, Thai, and postal code search
- **SCM Client App:** Supports Chinese/English/Thai/postal code, plus **smart address parsing** (paste an address string and it auto-fills the fields)
:::

## Product mapping is configured but orders match to the wrong product

**Cause:** When an order enters the system, it first tries to auto-match by product barcode; if that fails, it matches by product mapping. Duplicate barcodes in product profiles can cause incorrect matches.

**Solution:** Check for duplicate barcodes in SCM product profiles, correct them, and re-sync the orders.

![Product Mapping Match](/img/img_054.png)
![Product Mapping Relationships](/img/img_055.png)
