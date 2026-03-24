'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

let keyCounter = 0;
function nextKey() {
  return `pi-${keyCounter++}`;
}

export function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  return parseBlockMath(text);
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
