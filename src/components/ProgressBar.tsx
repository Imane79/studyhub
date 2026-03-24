'use client';

import React from 'react';

interface ProgressBarProps {
  done: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({
  done,
  total,
  color = '#5B8AF0',
  showLabel = false,
  height = 4,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-[var(--text-dim)] mb-1">
          <span>
            {done} / {total} sections reviewed
          </span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: `${height}px`, background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
