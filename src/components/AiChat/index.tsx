// src/components/AiChat/index.tsx
import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import ChatModal from './ChatModal';

type Lang = 'zh' | 'en' | 'th';

export default function AiChat(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const lang: Lang = location.pathname.startsWith('/en')
    ? 'en'
    : location.pathname.startsWith('/th')
    ? 'th'
    : 'zh';

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
