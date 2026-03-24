'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lecture, Section } from '@/lib/types';

interface SidebarProps {
  lecture: Lecture;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  isComplete: (id: string) => boolean;
  onToggleComplete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  lecture,
  activeSectionId,
  onSelectSection,
  isComplete,
  onToggleComplete,
  isOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();

  const handleSelect = (section: Section) => {
    onSelectSection(section.id);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className="fixed top-0 left-0 h-full z-30 flex flex-col overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0"
        style={{
          width: '280px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Back button */}
        <div
          className="flex items-center gap-2 px-4 py-4 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
          onClick={() => router.push('/')}
        >
          <span className="text-[var(--text-secondary)] text-lg">←</span>
          <span className="text-sm text-[var(--text-secondary)]">All Lectures</span>
        </div>

        {/* Lecture info */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: lecture.color }}
          >
            {lecture.icon} {lecture.chapter}
          </div>
          <div
            className="text-sm font-semibold text-[var(--text-primary)] leading-snug"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {lecture.title}
          </div>
        </div>

        {/* Sections list */}
        <div className="flex-1 overflow-y-auto py-2">
          {lecture.sections.map((section, idx) => {
            const active = section.id === activeSectionId;
            const done = isComplete(section.id);
            return (
              <div
                key={section.id}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group"
                style={{
                  background: active ? `${lecture.color}15` : 'transparent',
                  borderLeft: active ? `3px solid ${lecture.color}` : '3px solid transparent',
                }}
                onClick={() => handleSelect(section)}
              >
                {/* Checkbox */}
                <button
                  className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: done ? lecture.color : 'var(--border)',
                    background: done ? lecture.color : 'transparent',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(section.id);
                  }}
                  title={done ? 'Mark incomplete' : 'Mark reviewed'}
                >
                  {done && <span className="text-white text-[10px] leading-none">✓</span>}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-xs font-mono text-[var(--text-dim)]">
                      {section.number}
                    </span>
                  </div>
                  <div
                    className="text-xs leading-snug"
                    style={{ color: active ? lecture.color : 'var(--text-secondary)' }}
                  >
                    {section.title}
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mt-1.5">
                    {section.flashcards.length > 0 && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-[4px]"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-dim)' }}
                      >
                        🃏 {section.flashcards.length}
                      </span>
                    )}
                    {section.problems.length > 0 && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-[4px]"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-dim)' }}
                      >
                        📝 {section.problems.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
