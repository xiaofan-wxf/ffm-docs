---
id: tiktok
title: TikTok Store Authorization
sidebar_label: TikTok
---

# TikTok Store Authorization

## Authorization Entry

SCM → Settings → Store Profile → Select TikTok Store → Click **[Authorize]**

Cross-border 3PF stores and local stores use different authorization entries. Please select based on your store type.

## Common Issues

### Authorization Failed: Store is authorized on the platform but SCM shows "Unauthorized"

**Cause:** The cross-border store used the local store authorization entry by mistake.

**Solution:**
1. Log in to TikTok Seller Center → App and Services Marketplace → App Store
2. Click `...` in the top right → My Apps and Events
3. Find FlashFulfilment-ERP → Click **[Delete]**
4. Return to SCM Store Profile and re-authorize

![Delete TikTok App](/img/img_043.png)

### Multi-warehouse product sync failure (product mapping cannot sync platform products)

**Cause:** The store is in "multi-warehouse" mode, but the corresponding parameter has not been enabled in SCM.

**Solution:**
1. Confirm the customer has enabled multi-warehouse mode in TikTok Seller Center under **[Warehouse & Inventory]**
2. SCM → Store Profile → Check ☑️ **Enable Multi-warehouse** (confirm whitelist approval on TikTok first; cannot be unchecked after saving)

If the store is not in multi-warehouse mode, leave this unchecked.

![Platform Multi-warehouse Setting](/img/img_046.png)
![SCM Enable Multi-warehouse](/img/img_047.png)

### Auto stock sync failure

**Cause:** After successful product mapping, the customer modified SKU link information on the platform, causing SCM to sync stock successfully but the platform back-end inventory not updating.

**Solution:** Delete the existing mapping relationship and re-sync product mapping.

### TikTok Overseas Warehouse Whitelist Application

To apply for TikTok overseas warehouse whitelist, provide the following information:
- ERP available: Yes
- ERP name: FlashFulfillment-SCM
- Integration complete: Yes
