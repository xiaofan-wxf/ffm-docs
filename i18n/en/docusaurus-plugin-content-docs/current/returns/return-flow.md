---
id: return-flow
title: Return Processing Flow
sidebar_label: Return Flow
---

# Return Processing Flow

## Scenario 1: Return from a non-local warehouse (package arrives before merchant creates a return order)

1. The returned package arrives at the warehouse and is registered in the system
2. The merchant logs into SCM → Sales → **Return Registration** → Search by tracking number → Click **[Claim]**
3. After the warehouse receives the claim notification, the package is shelved back into inventory

## Scenario 2: Return from a non-local warehouse (merchant has already created a return order; package arrives later)

1. The merchant logs into SCM and creates a return order in advance; special handling notes can be added to the order
2. When the package arrives at the warehouse, staff matches it to the return order by tracking number and merges the status
3. The warehouse re-shelves the package into inventory

## Scenario 3: Return from a local warehouse

The process is the same as Scenario 2. The merchant does not need to create a return order manually — the system generates it automatically.

## Wrong Item / Missing Item Handling

**Wrong item sent:**
1. Merchant provides the buyer's contact information
2. The warehouse contacts the buyer to arrange the return of the wrong item
3. After the merchant approves the replacement, the warehouse contacts the buyer to send the correct item and resolve the issue
4. The returned item is shelved back into inventory

**Missing item (not shipped):**
1. Merchant provides the buyer's contact information; merchant approves the replacement
2. The warehouse contacts the buyer to send the missing item and resolve the issue
