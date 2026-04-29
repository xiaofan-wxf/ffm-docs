import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: '操作指南',
      items: [
        'guide/product-profile',
        'guide/inbound-notice',
        'guide/outbound-notice',
        'guide/store-setup',
        'guide/product-mapping',
        'guide/order-preprocessing',
      ],
    },
    {
      type: 'category',
      label: '入库须知',
      items: ['inbound/requirements', 'inbound/addresses', 'inbound/appointment'],
    },
    {
      type: 'category',
      label: '店铺授权',
      items: ['platform/tiktok', 'platform/shopee', 'platform/lazada'],
    },
    {
      type: 'category',
      label: '订单处理',
      items: ['orders/sync-issues', 'orders/presale', 'orders/cancellation'],
    },
    {
      type: 'category',
      label: '时效标准',
      items: ['operations/inbound-sla', 'operations/outbound-sla'],
    },
    {
      type: 'category',
      label: '账单与服务',
      items: ['billing/common-issues', 'billing/recharge'],
    },
    {
      type: 'category',
      label: '退货与退仓',
      items: ['returns/return-flow', 'returns/transfer'],
    },
  ],
  internalSidebar: [
    {
      type: 'category',
      label: '内部资料',
      items: ['internal/contacts', 'internal/complaints'],
    },
  ],
};

export default sidebars;
