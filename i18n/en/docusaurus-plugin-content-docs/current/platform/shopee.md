---
id: shopee
title: Shopee Store Authorization
sidebar_label: Shopee
---

# Shopee Store Authorization

## Authorization Entry

SCM → Settings → Store Profile → Select Shopee Store → Click **[Authorize]**

## Common Issues

### Re-authorization fails after previous authorization expires

**Solution:**
1. Revoke the old authorization in Shopee Seller Center
2. Return to SCM Store Profile and click **[Authorize]** again
3. Complete the OAuth flow as prompted

### Shopee SIP International Store Authorization Failed

**Cause:** SIP mode is a 1-to-many structure (one self-operated main store to multiple sub-stores). The system currently does not support authorizing individual sub-stores.

**Solution:** Use manual order entry. Download the platform shipping label PDF and upload it; the system recognizes the platform tracking number and proceeds with outbound processing.

### Auto stock sync failure

**Log: Failed to update stock**

In multi-warehouse mode, the platform does not support updating overseas warehouse inventory individually. Manually update inventory on the platform in the meantime and wait for the platform API to be updated.

**Log: Stock should be larger than 80**

The store has joined a platform inventory lock promotion; inventory must be above 80 to update.

![Inventory Lock Promotion](/img/img_052.png)

### Platform order split (order enters SCM before platform splits it)

If an order has already entered SCM and the platform then splits it, please contact operations staff to manually handle the split sub-orders.
