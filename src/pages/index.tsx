import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const i18n = {
  zh: {
    title: 'FFM 帮助中心',
    subtitle: 'Flash Fulfillment 操作手册与常见问题解答',
    modules: [
      { label: '操作指南',  desc: '商品档案、入库通知单、商品映射、订单预处理' },
      { label: '入库须知',  desc: '箱单标准、拒收规则、仓库地址、预约与时间' },
      { label: '店铺授权',  desc: 'TikTok、Shopee、Lazada 授权及常见问题' },
      { label: '订单处理',  desc: '订单同步、预售订单、取消流程' },
      { label: '时效标准',  desc: '入库时效、出库截单时间、仓库作业时间' },
      { label: '账单与服务', desc: '仓储费、包材费、充值及增值服务' },
      { label: '退货与退仓', desc: '销退流程、货权转移、错发漏发处理' },
    ],
  },
  en: {
    title: 'FFM Help Center',
    subtitle: 'Flash Fulfillment Operations Manual & FAQ',
    modules: [
      { label: 'Operations Guide',    desc: 'Product profiles, inbound notices, product mapping, order pre-processing' },
      { label: 'Inbound Requirements', desc: 'Box standards, rejection rules, warehouse address, appointments' },
      { label: 'Store Authorization',  desc: 'TikTok, Shopee, Lazada authorization & common issues' },
      { label: 'Order Handling',       desc: 'Order sync, pre-sale orders, cancellation flow' },
      { label: 'SLA Standards',        desc: 'Inbound SLA, outbound cut-off times, warehouse hours' },
      { label: 'Billing & Services',   desc: 'Storage fees, packaging fees, top-up & value-added services' },
      { label: 'Returns & Removal',    desc: 'Return flow, cargo transfer, mis-ship & shortage handling' },
    ],
  },
  th: {
    title: 'FFM ศูนย์ช่วยเหลือ',
    subtitle: 'คู่มือการใช้งาน Flash Fulfillment & คำถามที่พบบ่อย',
    modules: [
      { label: 'คู่มือการใช้งาน',         desc: 'โปรไฟล์สินค้า, ใบแจ้งรับสินค้า, การแมปสินค้า, การประมวลผลล่วงหน้า' },
      { label: 'ข้อกำหนดการรับสินค้า',     desc: 'มาตรฐานกล่อง, กฎการปฏิเสธ, ที่อยู่คลัง, การนัดหมาย' },
      { label: 'การอนุญาตร้านค้า',         desc: 'การอนุญาต TikTok, Shopee, Lazada & ปัญหาที่พบบ่อย' },
      { label: 'การจัดการออเดอร์',         desc: 'การซิงค์ออเดอร์, ออเดอร์พรีออเดอร์, ขั้นตอนการยกเลิก' },
      { label: 'มาตรฐาน SLA',             desc: 'SLA การรับสินค้า, เวลาตัดรอบออกสินค้า, เวลาทำการคลัง' },
      { label: 'การเรียกเก็บเงิน & บริการ', desc: 'ค่าจัดเก็บ, ค่าบรรจุภัณฑ์, การเติมเงิน & บริการเพิ่มมูลค่า' },
      { label: 'การคืนสินค้า & นำออก',     desc: 'ขั้นตอนคืนสินค้า, การโอนกรรมสิทธิ์, การจัดการส่งผิด & ขาด' },
    ],
  },
};

const MODULE_HREFS = [
  '/docs/guide/product-profile',
  '/docs/inbound/requirements',
  '/docs/platform/tiktok',
  '/docs/orders/sync-issues',
  '/docs/operations/outbound-sla',
  '/docs/billing/common-issues',
  '/docs/returns/return-flow',
];

const MODULE_ICONS = ['📖', '📦', '🔗', '📋', '⏱', '💰', '🔄'];

export default function Home(): React.JSX.Element {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const t = i18n[currentLocale as keyof typeof i18n] ?? i18n.zh;
  const localePrefix = currentLocale === 'zh' ? '' : `/${currentLocale}`;

  return (
    <Layout title={t.title} description={t.subtitle}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t.title}</h1>
          <p className={styles.heroSub}>{t.subtitle}</p>
        </div>
        <div className={styles.grid}>
          {t.modules.map((m: { label: string; desc: string }, idx: number) => (
            <Link
              key={idx}
              to={`${localePrefix}${MODULE_HREFS[idx]}`}
              className={`${styles.card} ${idx === 0 ? styles.cardHighlight : ''}`}
            >
              <span className={styles.cardIcon}>{MODULE_ICONS[idx]}</span>
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
