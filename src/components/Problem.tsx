'use client';

import React, { useState } from 'react';
import { Problem as ProblemType } from '@/lib/types';
import { ParsedText } from '@/lib/parseInline';

interface ProblemProps {
  problem: ProblemType;
  index: number;
  accentColor?: string;
}

const typeConfig = {
  calculation: { icon: '🧮', label: 'Calculation', color: '#E8A838' },
  conceptual: { icon: '🧠', label: 'Conceptual', color: '#5B8AF0' },
};

export function ProblemCard({ problem, index, accentColor }: ProblemProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const config = typeConfig[problem.type] || typeConfig.conceptual;

  return (
    <div
      className="rounded-[12px] p-5 mb-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-mono text-[var(--text-dim)]">#{index + 1}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-[6px]"
          style={{ background: `${config.color}22`, color: config.color }}
        >
          {config.icon} {config.label}
        </span>
      </div>

      {/* Question */}
      <div className="text-[var(--text-primary)] leading-relaxed mb-4">
        <ParsedText text={problem.q} />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {problem.hint && (
          <button
            onClick={() => setShowHint((h) => !h)}
            className="text-xs px-3 py-1.5 rounded-[8px] font-medium transition-all duration-200"
            style={{
              background: showHint ? '#E8A83822' : 'var(--bg-elevated)',
              border: `1px solid ${showHint ? '#E8A838' : 'var(--border)'}`,
              color: showHint ? '#E8A838' : 'var(--text-secondary)',
            }}
          >
            {showHint ? 'Hide Hint' : '💡 Show Hint'}
          </button>
        )}
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="text-xs px-3 py-1.5 rounded-[8px] font-medium transition-all duration-200"
          style={{
            background: showSolution ? `${accentColor || '#7BCB8E'}22` : 'var(--bg-elevated)',
            border: `1px solid ${showSolution ? (accentColor || '#7BCB8E') : 'var(--border)'}`,
            color: showSolution ? (accentColor || '#7BCB8E') : 'var(--text-secondary)',
          }}
        >
          {showSolution ? 'Hide Solution' : '✓ Show Solution'}
        </button>
      </div>

      {/* Hint */}
      {showHint && problem.hint && (
        <div className="mt-3 px-3 py-2 rounded-[8px] text-sm text-[var(--text-secondary)]"
          style={{ background: '#E8A83818', borderLeft: '3px solid #E8A838' }}
        >
          <ParsedText text={problem.hint} />
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div
          className="mt-3 px-4 py-3 rounded-[8px] text-sm text-[var(--text-primary)] leading-relaxed"
          style={{
            background: `${accentColor || '#7BCB8E'}12`,
            borderLeft: `3px solid ${accentColor || '#7BCB8E'}`,
          }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: accentColor || '#7BCB8E' }}>
            Solution
          </div>
          <ParsedText text={problem.a} />
        </div>
      )}
    </div>
  );
}
