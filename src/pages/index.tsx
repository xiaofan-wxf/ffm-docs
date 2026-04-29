import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const modules = [
  {
    href: '/docs/guide/product-profile',
    icon: '📖',
    label: '操作指南',
    desc: '商品档案、入库通知单、商品映射、订单预处理',
    highlight: true,
  },
  {
    href: '/docs/inbound/requirements',
    icon: '📦',
    label: '入库须知',
    desc: '箱单标准、拒收规则、仓库地址、预约与时间',
  },
  {
    href: '/docs/platform/tiktok',
    icon: '🔗',
    label: '店铺授权',
    desc: 'TikTok、Shopee、Lazada 授权及常见问题',
  },
  {
    href: '/docs/orders/sync-issues',
    icon: '📋',
    label: '订单处理',
    desc: '订单同步、预售订单、取消流程',
  },
  {
    href: '/docs/operations/outbound-sla',
    icon: '⏱',
    label: '时效标准',
    desc: '入库时效、出库截单时间、仓库作业时间',
  },
  {
    href: '/docs/billing/common-issues',
    icon: '💰',
    label: '账单与服务',
    desc: '仓储费、包材费、充值及增值服务',
  },
  {
    href: '/docs/returns/return-flow',
    icon: '🔄',
    label: '退货与退仓',
    desc: '销退流程、货权转移、错发漏发处理',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="FFM Help Center" description="Flash Fulfillment 帮助中心">
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>FFM 帮助中心</h1>
          <p className={styles.heroSub}>Flash Fulfillment 操作手册与常见问题解答</p>
        </div>
        <div className={styles.grid}>
          {modules.map(m => (
            <Link
              key={m.href}
              to={m.href}
              className={`${styles.card} ${m.highlight ? styles.cardHighlight : ''}`}
            >
              <span className={styles.cardIcon}>{m.icon}</span>
              <div className={styles.cardBody}>
                <span className={styles.cardLabel}>{m.label}</span>
                <span className={styles.cardDesc}>{m.desc}</span>
              </div>
              <span className={styles.cardArrow}>›</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
