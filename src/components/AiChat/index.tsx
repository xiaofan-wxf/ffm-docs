// src/components/AiChat/index.tsx
import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import ChatModal from './ChatModal';

type Lang = 'zh' | 'en' | 'th';

const SUPPORTED_LANGS = new Set<Lang>(['zh', 'en', 'th']);

export default function AiChat(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const { i18n } = useDocusaurusContext();

  const locale = i18n.currentLocale;
  const lang: Lang = SUPPORTED_LANGS.has(locale as Lang) ? (locale as Lang) : 'zh';

  return (
    <>
      <button
        className={styles.floatButton}
        onClick={() => setOpen(o => !o)}
        aria-label="AI客服"
        title="AI客服"
      >
        💬
      </button>
      {open && <ChatModal onClose={() => setOpen(false)} lang={lang} />}
    </>
  );
}
