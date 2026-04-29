// api/internal-auth.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body as { password: string };
  const expected = process.env.INTERNAL_TOKEN;

  if (!expected || password !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.setHeader(
    'Set-Cookie',
    `ffm_internal_token=${expected}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  );
  return res.status(200).json({ ok: true });
}
