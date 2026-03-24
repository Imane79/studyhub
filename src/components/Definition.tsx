'use client';

import React from 'react';
import { ParsedText } from '@/lib/parseInline';

interface DefinitionProps {
  term: string;
  body: string;
  accentColor?: string;
}

export function Definition({ term, body, accentColor = '#5B8AF0' }: DefinitionProps) {
  return (
    <div
      className="my-4 rounded-[8px] px-4 py-3"
      style={{
        borderLeft: `4px solid ${accentColor}`,
        background: `${accentColor}18`,
      }}
    >
      <div
        className="font-semibold text-base mb-1"
        style={{ color: accentColor, fontFamily: 'var(--font-heading)' }}
      >
        {term}
      </div>
      <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
        <ParsedText text={body} />
      </div>
    </div>
  );
}
