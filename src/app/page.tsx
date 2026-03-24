'use client';

import React, { useEffect, useState } from 'react';
import { getContent } from '@/lib/content';
import { CourseContent } from '@/lib/types';
import { LectureCard } from '@/components/LectureCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';

export default function HomePage() {
  const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { getLectureProgress, totalCompleted, mounted } = useProgress();

  useEffect(() => {
    getContent()
      .then(setContent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-dim)] text-sm animate-pulse">Loading content…</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-sm">Failed to load content.json</div>
      </div>
    );
  }

  const { course, lectures } = content;
  const totalSections = lectures.reduce((sum, l) => sum + l.sections.length, 0);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Course Header */}
        <header className="mb-10">
          <div
            className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)] mb-3"
          >
            {course.code} · {course.semester}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {course.name}
          </h1>
          <div className="text-sm text-[var(--text-secondary)]">{course.instructor}</div>

          {/* Global progress */}
          <div className="mt-6 p-4 rounded-[12px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Overall Progress</span>
              <span className="text-xs font-mono text-[var(--text-dim)]">
                {mounted ? totalCompleted : 0} / {totalSections} sections reviewed
              </span>
            </div>
            <ProgressBar
              done={mounted ? totalCompleted : 0}
              total={totalSections}
              color="#5B8AF0"
              height={6}
            />
          </div>
        </header>

        {/* Lecture Cards */}
        <section>
          <h2
            className="text-xs font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4"
          >
            Lectures
          </h2>
          <div className="flex flex-col gap-4">
            {lectures.map((lecture) => {
              const progress = getLectureProgress(lecture);
              return (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  done={progress.done}
                  total={progress.total}
                />
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-[var(--text-dim)]">
          StudyHub · Edit <code className="font-mono">public/content.json</code> to update content
        </footer>
      </div>
    </main>
  );
}
