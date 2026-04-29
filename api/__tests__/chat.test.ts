// api/__tests__/chat.test.ts
import { createMocks } from 'node-mocks-http';

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue(
            (async function* () {
              yield { choices: [{ delta: { content: 'Hello' } }] };
              yield { choices: [{ delta: { content: ' world' } }] };
              yield { choices: [{ delta: { content: null } }] };
            })()
          ),
        },
      },
    })),
  };
});

describe('POST /api/chat', () => {
  beforeEach(() => jest.resetModules());

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });

  it('returns 400 when messages array is missing', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { lang: 'zh' } });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  it('sets SSE headers and streams response for valid POST', async () => {
    process.env.DEEPSEEK_API_KEY = 'test-key';
    const { req, res } = createMocks({
      method: 'POST',
      body: { messages: [{ role: 'user', content: '你好' }], lang: 'zh' },
    });
    const { default: handler } = await import('../chat');
    await handler(req as any, res as any);
    expect(res.getHeader('Content-Type')).toBe('text/event-stream');
    expect(res._getData()).toContain('Hello');
  });
});
