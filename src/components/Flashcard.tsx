'use client';

import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '@/lib/types';
import { ParsedText } from '@/lib/parseInline';

interface FlashcardProps {
  cards: FlashcardType[];
  accentColor?: string;
}

export function FlashcardDeck({ cards, accentColor = '#5B8AF0' }: FlashcardProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-[var(--text-dim)] py-12">
        No flashcards for this section.
      </div>
    );
  }

  const card = cards[index];

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i > 0 ? i - 1 : cards.length - 1)), 150);
  };

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i < cards.length - 1 ? i + 1 : 0)), 150);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Counter */}
      <div className="text-sm font-mono text-[var(--text-dim)]">
        {index + 1} / {cards.length}
      </div>

      {/* Flip Card */}
      <div
        className="w-full max-w-xl cursor-pointer"
        style={{ perspective: '1000px', minHeight: '220px' }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <div
          style={{
            transition: 'transform 0.5s ease',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            minHeight: '220px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-[12px] p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'var(--bg-card)',
              border: `2px solid ${accentColor}`,
            }}
          >
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: accentColor }}>
              Question
            </div>
            <div className="text-base text-[var(--text-primary)] leading-relaxed flex-1 flex items-center">
              <ParsedText text={card.q} />
            </div>
            <div className="text-xs text-[var(--text-dim)] mt-3 text-center">Tap to reveal answer</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-[12px] p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `${accentColor}22`,
              border: `2px solid ${accentColor}`,
            }}
          >
            <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: accentColor }}>
              Answer
            </div>
            <div className="text-base text-[var(--text-primary)] leading-relaxed flex-1 flex items-center">
              <ParsedText text={card.a} />
            </div>
            <div className="text-xs text-[var(--text-dim)] mt-3 text-center">Tap to see question</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-4 items-center">
        <button
          onClick={prev}
          className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200"
          style={{
            background: accentColor,
            color: '#fff',
          }}
        >
          Flip
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
