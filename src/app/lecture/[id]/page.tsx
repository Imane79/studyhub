'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getContent } from '@/lib/content';
import { Lecture, Section } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { ContentRenderer } from '@/components/ContentRenderer';
import { FlashcardDeck } from '@/components/Flashcard';
import { ProblemCard } from '@/components/Problem';
import { useProgress } from '@/hooks/useProgress';

type Mode = 'read' | 'cards' | 'practice';

export default function LecturePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [mode, setMode] = useState<Mode>('read');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isComplete, toggleComplete } = useProgress();

  useEffect(() => {
    getContent()
      .then((content) => {
        const found = content.lectures.find((l) => l.id === id);
        if (found) {
          setLecture(found);
          setActiveSection(found.sections[0] || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-dim)] text-sm animate-pulse">Loading lecture…</div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-[var(--text-secondary)]">Lecture not found.</div>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-blue-400 hover:underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  const accentColor = lecture.color;
  const sections = lecture.sections;
  const currentIndex = sections.findIndex((s) => s.id === activeSection?.id);

  const goToSection = (section: Section) => {
    setActiveSection(section);
    setMode('read');
  };

  const goPrev = () => {
    if (currentIndex > 0) goToSection(sections[currentIndex - 1]);
  };

  const goNext = () => {
    if (currentIndex < sections.length - 1) goToSection(sections[currentIndex + 1]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          lecture={lecture}
          activeSectionId={activeSection?.id || ''}
          onSelectSection={(sid) => {
            const s = sections.find((sec) => sec.id === sid);
            if (s) goToSection(s);
          }}
          isComplete={isComplete}
          onToggleComplete={toggleComplete}
          isOpen={true}
          onClose={() => {}}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        <Sidebar
          lecture={lecture}
          activeSectionId={activeSection?.id || ''}
          onSelectSection={(sid) => {
            const s = sections.find((sec) => sec.id === sid);
            if (s) goToSection(s);
          }}
          isComplete={isComplete}
          onToggleComplete={toggleComplete}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-1.5 rounded-[8px] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* Section title */}
          <div className="flex-1 min-w-0">
            {activeSection && (
              <div className="truncate text-sm font-medium text-[var(--text-primary)]">
                <span className="text-[var(--text-dim)] font-mono mr-2">{activeSection.number}</span>
                {activeSection.title}
              </div>
            )}
          </div>

          {/* Mode tabs */}
          <div
            className="flex rounded-[8px] overflow-hidden flex-shrink-0"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            {(['read', 'cards', 'practice'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-3 py-1.5 text-xs font-medium transition-all duration-200"
                style={{
                  background: mode === m ? accentColor : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-dim)',
                }}
              >
                {m === 'read' ? '📖 Read' : m === 'cards' ? '🃏 Cards' : '📝 Practice'}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {!activeSection ? (
              <div className="text-center text-[var(--text-dim)] py-20">Select a section from the sidebar</div>
            ) : (
              <>
                {/* Section header */}
                <div className="mb-6">
                  <div className="text-xs font-mono mb-1" style={{ color: accentColor }}>
                    {lecture.chapter} · {activeSection.number}
                  </div>
                  <h1
                    className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {activeSection.title}
                  </h1>
                </div>

                {/* Read Mode */}
                {mode === 'read' && (
                  <div>
                    <ContentRenderer
                      blocks={activeSection.content}
                      accentColor={accentColor}
                    />

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                      {activeSection.flashcards.length > 0 && (
                        <button
                          onClick={() => setMode('cards')}
                          className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200"
                          style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                        >
                          🃏 Review {activeSection.flashcards.length} Flashcards
                        </button>
                      )}
                      {activeSection.problems.length > 0 && (
                        <button
                          onClick={() => setMode('practice')}
                          className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                        >
                          📝 Practice {activeSection.problems.length} Problems
                        </button>
                      )}
                      <button
                        onClick={() => toggleComplete(activeSection.id)}
                        className="px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 ml-auto"
                        style={{
                          background: isComplete(activeSection.id) ? `${accentColor}22` : 'var(--bg-elevated)',
                          color: isComplete(activeSection.id) ? accentColor : 'var(--text-secondary)',
                          border: `1px solid ${isComplete(activeSection.id) ? accentColor : 'var(--border)'}`,
                        }}
                      >
                        {isComplete(activeSection.id) ? '✓ Reviewed' : 'Mark as Reviewed'}
                      </button>
                    </div>

                    {/* Prev / Next navigation */}
                    <div className="flex justify-between gap-4 mt-6">
                      {currentIndex > 0 ? (
                        <button
                          onClick={goPrev}
                          className="flex-1 py-3 rounded-[12px] text-sm text-left px-4 transition-all duration-200"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <div className="text-xs text-[var(--text-dim)] mb-0.5">← Previous</div>
                          <div className="font-medium truncate">{sections[currentIndex - 1].title}</div>
                        </button>
                      ) : <div className="flex-1" />}

                      {currentIndex < sections.length - 1 ? (
                        <button
                          onClick={goNext}
                          className="flex-1 py-3 rounded-[12px] text-sm text-right px-4 transition-all duration-200"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <div className="text-xs text-[var(--text-dim)] mb-0.5">Next →</div>
                          <div className="font-medium truncate">{sections[currentIndex + 1].title}</div>
                        </button>
                      ) : <div className="flex-1" />}
                    </div>
                  </div>
                )}

                {/* Cards Mode */}
                {mode === 'cards' && (
                  <div>
                    <FlashcardDeck cards={activeSection.flashcards} accentColor={accentColor} />
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setMode('practice')}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Switch to Practice Problems →
                      </button>
                    </div>
                  </div>
                )}

                {/* Practice Mode */}
                {mode === 'practice' && (
                  <div>
                    {activeSection.problems.length === 0 ? (
                      <div className="text-center text-[var(--text-dim)] py-12">
                        No practice problems for this section.
                      </div>
                    ) : (
                      <div>
                        {activeSection.problems.map((problem, i) => (
                          <ProblemCard
                            key={i}
                            problem={problem}
                            index={i}
                            accentColor={accentColor}
                          />
                        ))}
                      </div>
                    )}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setMode('cards')}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        ← Back to Flashcards
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
