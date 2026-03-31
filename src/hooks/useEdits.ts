'use client';
import { useState, useEffect, useCallback } from 'react';
import { Flashcard, Problem } from '@/lib/types';

export interface SectionEdit {
  markdown?: string;
  flashcards?: Flashcard[];
  problems?: Problem[];
}

const KEY = 'studyhub-edits';

export function useEdits() {
  const [edits, setEdits] = useState<Record<string, SectionEdit>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEdits(JSON.parse(raw));
    } catch {}
  }, []);

  const save = useCallback((sectionId: string, patch: Partial<SectionEdit>) => {
    setEdits(prev => {
      const next = { ...prev, [sectionId]: { ...prev[sectionId], ...patch } };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const get = useCallback((sectionId: string): SectionEdit => {
    return edits[sectionId] ?? {};
  }, [edits]);

  return { save, get };
}
