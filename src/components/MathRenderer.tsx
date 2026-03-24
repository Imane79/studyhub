'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  label?: string;
}

export function MathRenderer({ math, block = false, label }: MathRendererProps) {
  if (block) {
    return (
      <div className="my-4 text-center">
        {label && (
          <div className="text-xs font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">
            {label}
          </div>
        )}
        <div className="overflow-x-auto py-2">
          <BlockMath math={math} />
        </div>
      </div>
    );
  }

  return <InlineMath math={math} />;
}
