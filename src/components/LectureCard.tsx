'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lecture } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

interface LectureCardProps {
  lecture: Lecture;
  done: number;
  total: number;
}

export function LectureCard({ lecture, done, total }: LectureCardProps) {
  const router = useRouter();
  const totalFlashcards = lecture.sections.reduce((sum, s) => sum + s.flashcards.length, 0);
  const totalProblems = lecture.sections.reduce((sum, s) => sum + s.problems.length, 0);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/lecture/${lecture.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/lecture/${lecture.id}`)}
      className="rounded-[12px] p-6 cursor-pointer transition-all duration-200 group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-2px)';
        el.style.borderColor = lecture.color;
        el.style.boxShadow = `0 8px 32px ${lecture.color}33`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[6px] mb-3"
            style={{ background: `${lecture.color}22`, color: lecture.color }}
          >
            <span>{lecture.icon}</span>
            <span>Lecture {lecture.number}</span>
          </div>
          <h2
            className="text-lg font-semibold text-[var(--text-primary)] leading-snug"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {lecture.title}
          </h2>
          <div className="text-sm text-[var(--text-dim)] mt-1">{lecture.chapter}</div>
        </div>
        <div className="text-3xl ml-4">{lecture.icon}</div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-[var(--text-dim)] mb-4">
        <span>
          <span className="text-[var(--text-secondary)] font-medium">{lecture.sections.length}</span> sections
        </span>
        <span>
          <span className="text-[var(--text-secondary)] font-medium">{totalFlashcards}</span> cards
        </span>
        <span>
          <span className="text-[var(--text-secondary)] font-medium">{totalProblems}</span> problems
        </span>
      </div>

      {/* Progress */}
      <ProgressBar done={done} total={total} color={lecture.color} height={4} showLabel />
    </div>
  );
}
