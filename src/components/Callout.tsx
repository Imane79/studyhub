'use client';

import React from 'react';
import { ParsedText } from '@/lib/parseInline';
import { CalloutStyle } from '@/lib/types';

const styles: Record<
  CalloutStyle,
  { bg: string; border: string; icon: string; label: string }
> = {
  info: {
    bg: 'rgba(91,138,240,0.1)',
    border: '#5B8AF0',
    icon: 'ℹ️',
    label: 'Note',
  },
  warning: {
    bg: 'rgba(232,168,56,0.1)',
    border: '#E8A838',
    icon: '⚠️',
    label: 'Warning',
  },
  tip: {
    bg: 'rgba(123,203,142,0.1)',
    border: '#7BCB8E',
    icon: '💡',
    label: 'Tip',
  },
  exam: {
    bg: 'rgba(239,83,80,0.1)',
    border: '#EF5350',
    icon: '🎯',
    label: 'Exam',
  },
};

interface CalloutProps {
  style: CalloutStyle;
  body: string;
}

export function Callout({ style, body }: CalloutProps) {
  const s = styles[style] || styles.info;
  return (
    <div
      className="rounded-[8px] px-4 py-3 my-4 flex gap-3"
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
      }}
    >
      <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1">
        <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: s.border }}>
          {s.label}
        </div>
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
          <ParsedText text={body} />
        </div>
      </div>
    </div>
  );
}
