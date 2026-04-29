// src/pages/internal-login.tsx
import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function InternalLogin(): React.JSX.Element {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/internal-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('redirect') || '/docs/internal/contacts';
    } else {
      setError('密码错误');
    }
  };

  return (
    <Layout title="内部登录">
      <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
        <h2>内部资料访问</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="请输入访问密码"
            style={{ width: '100%', padding: 8, marginBottom: 12, fontSize: 16, boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16 }}>
            进入
          </button>
        </form>
      </div>
    </Layout>
  );
}
