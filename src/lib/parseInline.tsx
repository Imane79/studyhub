'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { codeTheme } from '@/lib/codeTheme';

let keyCounter = 0;
function nextKey() {
  return `pi-${keyCounter++}`;
}

export function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  return parseFencedCode(text);
}

function parseFencedCode(text: string): React.ReactNode[] {
  const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('```')) {
      const firstNewline = part.indexOf('\n');
      const lang = part.slice(3, firstNewline).trim() || 'text';
      const code = part.slice(firstNewline + 1, -3);
      result.push(
        <div key={nextKey()} className="rounded-[10px] overflow-hidden border border-[var(--border)] my-3">
          <div style={{ background: 'var(--bg-elevated)', padding: '4px 12px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{lang}</span>
          </div>
          <SyntaxHighlighter
            language={lang}
            style={codeTheme}
            customStyle={{ margin: 0, background: '#0d1117', fontSize: '0.82rem', lineHeight: '1.6', padding: '12px 16px', fontFamily: 'var(--font-mono)' }}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    } else {
      result.push(...parseBlockMath(part));
    }
  }
  return result;
}

function parseBlockMath(text: string): React.ReactNode[] {
  const parts = text.split(/((?:\$\$)[\s\S]*?(?:\$\$))/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2);
      result.push(<BlockMath key={nextKey()} math={math} />);
    } else {
      result.push(...parseInlineMath(part));
    }
  }
  return result;
}

function parseInlineMath(text: string): React.ReactNode[] {
  const parts = text.split(/(\$[^$\n]+?\$)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = part.slice(1, -1);
      result.push(<InlineMath key={nextKey()} math={math} />);
    } else {
      result.push(...parseCode(part));
    }
  }
  return result;
}

function parseCode(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const code = part.slice(1, -1);
      result.push(
        <code
          key={nextKey()}
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255,255,255,0.08)',
            padding: '1px 5px',
            borderRadius: '4px',
            fontSize: '0.88em',
            color: '#e8c97e',
          }}
        >
          {code}
        </code>
      );
    } else {
      result.push(...parseBold(part));
    }
  }
  return result;
}

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      result.push(<strong key={nextKey()}>{inner}</strong>);
    } else {
      result.push(...parseItalic(part));
    }
  }
  return result;
}

function parseItalic(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      result.push(<em key={nextKey()}>{inner}</em>);
    } else {
      result.push(...parseNewlines(part));
    }
  }
  return result;
}

function parseNewlines(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\n\n|\n)/g);
  const result: React.ReactNode[] = [];
  for (const part of parts) {
    if (part === '\n\n') {
      result.push(<br key={nextKey()} />);
      result.push(<br key={nextKey()} />);
    } else if (part === '\n') {
      result.push(<br key={nextKey()} />);
    } else if (part) {
      result.push(<span key={nextKey()}>{part}</span>);
    }
  }
  return result;
}

export function ParsedText({ text, className }: { text: string; className?: string }) {
  const nodes = parseInline(text);
  return <span className={className}>{nodes}</span>;
}
