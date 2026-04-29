// src/components/AiChat/__tests__/ChatModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatModal from '../ChatModal';

global.fetch = jest.fn();

// jsdom does not implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockReset();
});

describe('ChatModal', () => {
  it('renders input and send button', () => {
    render(<ChatModal onClose={() => {}} lang="zh" />);
    expect(screen.getByPlaceholderText('输入问题...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送' })).toBeInTheDocument();
  });

  it('displays user message after submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('你好！') })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      },
    });

    render(<ChatModal onClose={() => {}} lang="zh" />);
    fireEvent.change(screen.getByPlaceholderText('输入问题...'), {
      target: { value: '仓库地址是什么？' },
    });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));

    await waitFor(() => {
      expect(screen.getByText('仓库地址是什么？')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<ChatModal onClose={onClose} lang="zh" />);
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
