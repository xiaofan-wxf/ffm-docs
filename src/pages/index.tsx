import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const modules = [
  { href: '/docs/inbound/requirements', icon: '📦', label: '入库须知' },
  { href: '/docs/platform/tiktok', icon: '🔗', label: '店铺授权' },
  { href: '/docs/orders/sync-issues', icon: '📋', label: '订单处理' },
  { href: '/docs/operations/outbound-sla', icon: '⏱', label: '时效标准' },
  { href: '/docs/billing/common-issues', icon: '💰', label: '账单与服务' },
  { href: '/docs/returns/return-flow', icon: '🔄', label: '退货与退仓' },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="FFM Help Center" description="Flash Fulfillment 帮助中心">
      <main style={{ maxWidth: 900, margin: '60px auto', padding: '0 20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8 }}>FFM 帮助中心</h1>
        <p style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', marginBottom: 48 }}>
          Flash Fulfillment 操作手册与常见问题
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}
        >
          {modules.map(m => (
            <Link
              key={m.href}
              to={m.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '20px 24px',
                border: '1px solid var(--ifm-color-emphasis-200)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s',
              }}
            >
              <span style={{ fontSize: 32 }}>{m.icon}</span>
              <span style={{ fontWeight: 600 }}>{m.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
