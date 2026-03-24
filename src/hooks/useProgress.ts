'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lecture } from '@/lib/types';

const STORAGE_KEY = 'studyhub-progress';

interface Progress {
  [sectionId: string]: boolean;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((next: Progress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setProgress(next);
  }, []);

  const toggleComplete = useCallback(
    (sectionId: string) => {
      const next = { ...progress, [sectionId]: !progress[sectionId] };
      save(next);
    },
    [progress, save]
  );

  const isComplete = useCallback(
    (sectionId: string): boolean => {
      return !!progress[sectionId];
    },
    [progress]
  );

  const getLectureProgress = useCallback(
    (lecture: Lecture): { done: number; total: number } => {
      const total = lecture.sections.length;
      const done = lecture.sections.filter((s) => progress[s.id]).length;
      return { done, total };
    },
    [progress]
  );

  const totalCompleted = Object.values(progress).filter(Boolean).length;

  return {
    progress,
    mounted,
    toggleComplete,
    isComplete,
    getLectureProgress,
    totalCompleted,
  };
}
