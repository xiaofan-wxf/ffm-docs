---
id: cancellation
title: Platform Order Cancellation
sidebar_label: Order Cancellation
---

# Platform Order Cancellation

## SCM Pull-mode Cancellations

| Cancellation Timing | Handling |
|--------------------|---------|
| Cancelled **before** SCM approval (platform status: cancelled) | Do not approve; no further action needed |
| Cancelled **after** SCM approval pushed to WMS (platform status: cancelled) | Notify customer; warehouse executes intercept and recall |

## ERP Push-mode Cancellations

| Scenario | Handling |
|----------|---------|
| Cancelled after ERP pushes to SCM (platform status unknown) | Status shows "Failed to get shipping label"; notify customer to intercept |
| Cancelled after ERP pushes and approved to WMS | Error flagged at courier handoff; notify customer to intercept |

![ERP Push Cancellation Handling](/img/img_062.png)

**Intercept operation:** Find the corresponding shipment order in SCM WMS → Execute **[Intercept]**; the warehouse will then recall the package.
