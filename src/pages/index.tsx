import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home(): React.JSX.Element {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const localePrefix = currentLocale === 'zh' ? '' : `/${currentLocale}`;

  const modules = [
    {
      href: `${localePrefix}/docs/guide/product-profile`,
      icon: '📖',
      label: translate({ id: 'home.module.guide.label', message: '操作指南' }),
      desc: translate({ id: 'home.module.guide.desc', message: '商品档案、入库通知单、商品映射、订单预处理' }),
      highlight: true,
    },
    {
      href: `${localePrefix}/docs/inbound/requirements`,
      icon: '📦',
      label: translate({ id: 'home.module.inbound.label', message: '入库须知' }),
      desc: translate({ id: 'home.module.inbound.desc', message: '箱单标准、拒收规则、仓库地址、预约与时间' }),
    },
    {
      href: `${localePrefix}/docs/platform/tiktok`,
      icon: '🔗',
      label: translate({ id: 'home.module.store.label', message: '店铺授权' }),
      desc: translate({ id: 'home.module.store.desc', message: 'TikTok、Shopee、Lazada 授权及常见问题' }),
    },
    {
      href: `${localePrefix}/docs/orders/sync-issues`,
      icon: '📋',
      label: translate({ id: 'home.module.orders.label', message: '订单处理' }),
      desc: translate({ id: 'home.module.orders.desc', message: '订单同步、预售订单、取消流程' }),
    },
    {
      href: `${localePrefix}/docs/operations/outbound-sla`,
      icon: '⏱',
      label: translate({ id: 'home.module.sla.label', message: '时效标准' }),
      desc: translate({ id: 'home.module.sla.desc', message: '入库时效、出库截单时间、仓库作业时间' }),
    },
    {
      href: `${localePrefix}/docs/billing/common-issues`,
      icon: '💰',
      label: translate({ id: 'home.module.billing.label', message: '账单与服务' }),
      desc: translate({ id: 'home.module.billing.desc', message: '仓储费、包材费、充值及增值服务' }),
    },
    {
      href: `${localePrefix}/docs/returns/return-flow`,
      icon: '🔄',
      label: translate({ id: 'home.module.returns.label', message: '退货与退仓' }),
      desc: translate({ id: 'home.module.returns.desc', message: '销退流程、货权转移、错发漏发处理' }),
    },
  ];

  return (
    <Layout
      title={translate({ id: 'home.title', message: 'FFM Help Center' })}
      description={translate({ id: 'home.description', message: 'Flash Fulfillment 操作手册与常见问题解答' })}
    >
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            {translate({ id: 'home.hero.title', message: 'FFM 帮助中心' })}
          </h1>
          <p className={styles.heroSub}>
            {translate({ id: 'home.hero.subtitle', message: 'Flash Fulfillment 操作手册与常见问题解答' })}
          </p>
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
