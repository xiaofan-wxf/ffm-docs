// api/chat.ts
import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildSystemPrompt } from '../src/lib/knowledgeBase';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await client.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2048,
    stream: true,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      ...messages,
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) res.write(text);
  }

  res.end();
}
