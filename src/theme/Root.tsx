// src/theme/Root.tsx
import React from 'react';
import AiChat from '@site/src/components/AiChat';

export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      {children}
      <AiChat />
    </>
  );
}
