'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { codeTheme } from '@/lib/codeTheme';

interface CodeBlockProps {
  language: string;
  body: string;
  title?: string;
}

export function CodeBlock({ language, body, title }: CodeBlockProps) {
  return (
    <div className="rounded-[12px] overflow-hidden border border-[var(--border)] my-4">
      {title && (
        <div className="bg-[var(--bg-elevated)] px-4 py-2 flex items-center gap-2 border-b border-[var(--border)]">
          <span className="text-xs font-mono text-[var(--text-dim)]">{language}</span>
          <span className="text-xs text-[var(--text-secondary)] ml-auto">{title}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={codeTheme}
        customStyle={{
          margin: 0,
          background: '#0d1117',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
        }}
        PreTag="div"
      >
        {body}
      </SyntaxHighlighter>
    </div>
  );
}
