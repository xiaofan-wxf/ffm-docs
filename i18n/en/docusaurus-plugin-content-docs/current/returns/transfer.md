---
id: transfer
title: Inventory Ownership Transfer
sidebar_label: Ownership Transfer
---

# Inventory Ownership Transfer

Used to transfer goods from Merchant A to Merchant B.

## Pre-requisite Setup (when barcodes are the same)

If both merchants share the same product barcodes, you can enable auto-matching in SCM → Settings → Policy Settings → Check ☑️ **Ownership Transfer Supports One-click Matching** → Save.

Once enabled, the system will automatically sync all product profile information from the outgoing merchant to the receiving merchant's account.

![One-click Matching Setting](/img/img_027.png)

## Steps

### Merchant A (Outgoing)

SCM → Inventory Documents → Ownership Transfer (Outgoing) → Click **[New]** → Enter **[Target Merchant Code]** → Select products/quantities → Save → Approve

![Ownership Transfer Outgoing](/img/img_028.png)

### Merchant B (Incoming)

SCM → Inventory Documents → Ownership Transfer (Incoming) → Click **[Match Products]** → **[One-click Match]** → Save → Click **[Confirm]**

![Ownership Transfer Incoming](/img/img_029.png)
![One-click Match Confirm](/img/img_030.png)

> Both merchants must confirm before the warehouse can view the document and proceed with operations.

### Warehouse Operations

Select the ownership transfer order number → Click **[Complete All]** → Status automatically changes to "Completed"

![Warehouse Complete All](/img/img_032.png)
