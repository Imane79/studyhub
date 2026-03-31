'use client';

import React, { useEffect, useState } from 'react';
import { getContent, getCourses, CourseInfo } from '@/lib/content';
import { Lecture } from '@/lib/types';
import { LectureCard } from '@/components/LectureCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';

export default function HomePage() {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('studyhub-course') || 'multimedia';
    }
    return 'multimedia';
  });
  const [loading, setLoading] = useState(true);
  const { getLectureProgress, mounted } = useProgress();

  useEffect(() => {
    Promise.all([getCourses(), getContent()])
      .then(([c, content]) => {
        setCourses(c);
        setLectures(content.lectures);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-dim)] text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  const course = courses.find((c) => c.id === selectedCourse);
  const filtered = lectures.filter((l) => l.courseId === selectedCourse);
  const totalSections = filtered.reduce((sum, l) => sum + l.sections.length, 0);
  const totalCompleted = mounted
    ? filtered.reduce((sum, l) => sum + getLectureProgress(l).done, 0)
    : 0;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Course Tabs */}
        <div className="flex gap-2 mb-10">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCourse(c.id); localStorage.setItem('studyhub-course', c.id); }}
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200"
              style={
                selectedCourse === c.id
                  ? { background: c.color, color: '#fff' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {course && (
          <>
            {/* Course Header */}
            <header className="mb-10">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)] mb-3">
                {course.code} · {course.semester}
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {course.name}
              </h1>
              <div className="text-sm text-[var(--text-secondary)]">{course.instructor}</div>

              {/* Progress */}
              <div
                className="mt-6 p-4 rounded-[12px]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Overall Progress</span>
                  <span className="text-xs font-mono text-[var(--text-dim)]">
                    {mounted ? totalCompleted : 0} / {totalSections} sections reviewed
                  </span>
                </div>
                <ProgressBar
                  done={mounted ? totalCompleted : 0}
                  total={totalSections}
                  color={course.color}
                  height={6}
                />
              </div>
            </header>

            {/* Lecture Cards */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">
                Lectures
              </h2>
              <div className="flex flex-col gap-4">
                {filtered.map((lecture) => {
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
          </>
        )}

        <footer className="mt-12 text-center text-xs text-[var(--text-dim)]">
          StudyHub · Spring 2026
        </footer>
      </div>
    </main>
  );
}
