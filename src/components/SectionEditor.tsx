'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { SectionEdit } from '@/hooks/useEdits';
import { Flashcard, Problem, ProblemType } from '@/lib/types';

type EditorTab = 'content' | 'flashcards' | 'problems';

interface Props {
  edit: SectionEdit;
  onSave: (patch: Partial<SectionEdit>) => void;
  accentColor: string;
}

export function SectionEditor({ edit, onSave, accentColor }: Props) {
  const [tab, setTab] = useState<EditorTab>('content');
  const [markdown, setMarkdown] = useState(edit.markdown ?? '');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(edit.flashcards ?? []);
  const [problems, setProblems] = useState<Problem[]>(edit.problems ?? []);
  const [cardPaste, setCardPaste] = useState('');
  const [probPaste, setProbPaste] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Handle image paste from clipboard
  const handleContentPaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    for (const item of Array.from(e.clipboardData.items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const url = ev.target?.result as string;
          const insertion = `\n![image](${url})\n`;
          const ta = taRef.current;
          const pos = ta?.selectionStart ?? markdown.length;
          const next = markdown.slice(0, pos) + insertion + markdown.slice(pos);
          setMarkdown(next);
          onSave({ markdown: next });
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  }, [markdown, onSave]);

  // Parse pasted flashcards (Q: / A: format, blank-line-separated)
  const parseCards = () => {
    const added: Flashcard[] = [];
    for (const chunk of cardPaste.split(/\n\s*\n/)) {
      const lines = chunk.trim().split('\n');
      let q = '', a = '';
      for (const l of lines) {
        const qm = l.match(/^Q:\s*(.*)/i); if (qm) q = qm[1].trim();
        const am = l.match(/^A:\s*(.*)/i); if (am) a = am[1].trim();
      }
      if (q && a) added.push({ q, a });
    }
    if (!added.length) return;
    const next = [...flashcards, ...added];
    setFlashcards(next);
    setCardPaste('');
    onSave({ flashcards: next });
  };

  // Parse pasted problems (Q: / A: / Hint: / Type: format)
  const parseProblems = () => {
    const added: Problem[] = [];
    for (const chunk of probPaste.split(/\n\s*\n/)) {
      const lines = chunk.trim().split('\n');
      let q = '', a = '', hint = '', type: ProblemType = 'conceptual';
      for (const l of lines) {
        const qm = l.match(/^Q:\s*(.*)/i); if (qm) q = qm[1].trim();
        const am = l.match(/^A:\s*(.*)/i); if (am) a = am[1].trim();
        const hm = l.match(/^Hint:\s*(.*)/i); if (hm) hint = hm[1].trim();
        const tm = l.match(/^Type:\s*(.*)/i);
        if (tm && tm[1].toLowerCase() === 'calculation') type = 'calculation';
      }
      if (q && a) added.push({ type, q, a, ...(hint ? { hint } : {}) });
    }
    if (!added.length) return;
    const next = [...problems, ...added];
    setProblems(next);
    setProbPaste('');
    onSave({ problems: next });
  };

  const updateCard = (i: number, field: 'q' | 'a', val: string) => {
    const next = flashcards.map((c, idx) => idx === i ? { ...c, [field]: val } : c);
    setFlashcards(next); onSave({ flashcards: next });
  };
  const deleteCard = (i: number) => {
    const next = flashcards.filter((_, idx) => idx !== i);
    setFlashcards(next); onSave({ flashcards: next });
  };

  const updateProb = (i: number, field: keyof Problem, val: string) => {
    const next = problems.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    setProblems(next); onSave({ problems: next });
  };
  const deleteProb = (i: number) => {
    const next = problems.filter((_, idx) => idx !== i);
    setProblems(next); onSave({ problems: next });
  };

  const inputStyle = {
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  };

  const elevatedStyle = {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-[8px]" style={{ background: 'var(--bg-elevated)' }}>
        {(['content', 'flashcards', 'problems'] as EditorTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1.5 text-xs font-medium rounded-[6px] transition-all"
            style={{
              background: tab === t ? accentColor : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-dim)',
            }}
          >
            {t === 'content' ? '📝 Content' : t === 'flashcards' ? '🃏 Flashcards' : '📋 Problems'}
          </button>
        ))}
      </div>

      {/* ── Content Tab ── */}
      {tab === 'content' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-dim)]">
            Type or paste your notes. Supports Markdown, <code className="font-mono text-[#e8c97e]">$math$</code>,{' '}
            <code className="font-mono text-[#e8c97e]">$$block math$$</code>, images, tables, and code blocks.
            You can also paste a screenshot directly from your clipboard.
          </p>
          <textarea
            ref={taRef}
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            onPaste={handleContentPaste}
            onBlur={() => onSave({ markdown })}
            rows={14}
            placeholder={`## Notes\n\nPaste or type here...\n\nSupports $inline math$ and:\n\n$$\\\\text{block math}$$\n\nAnd images — just paste a screenshot!`}
            className="w-full text-sm font-mono p-3 rounded-[8px] resize-y outline-none leading-relaxed"
            style={elevatedStyle}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSave({ markdown })}
              className="px-4 py-2 rounded-[8px] text-sm font-medium"
              style={{ background: accentColor, color: '#fff' }}
            >
              Save
            </button>
            {markdown && (
              <button
                onClick={() => { setMarkdown(''); onSave({ markdown: '' }); }}
                className="px-4 py-2 rounded-[8px] text-sm font-medium"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}
              >
                Clear
              </button>
            )}
          </div>

          {markdown && (
            <>
              <div className="text-xs font-medium text-[var(--text-dim)] mt-2">— Live Preview —</div>
              <div
                className="p-4 rounded-[8px] text-sm text-[var(--text-secondary)] leading-relaxed overflow-x-auto"
                style={elevatedStyle}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-3 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3 mb-1">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    img: ({ src, alt }: any) => (
                      <figure className="my-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src as string} alt={alt ?? ''} className="rounded-[8px] max-w-full" />
                        {alt && <figcaption className="text-xs text-[var(--text-dim)] mt-1 text-center">{alt}</figcaption>}
                      </figure>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');
                      return isBlock
                        ? <pre className="my-2 p-3 rounded-[8px] text-xs font-mono overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: '#e8c97e' }}><code>{children}</code></pre>
                        : <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: '#e8c97e' }}>{children}</code>;
                    },
                    blockquote: ({ children }) => <blockquote className="border-l-2 pl-3 italic text-[var(--text-dim)] my-2" style={{ borderColor: accentColor }}>{children}</blockquote>,
                    hr: () => <hr className="border-[var(--border)] my-4" />,
                    table: ({ children }) => <table className="w-full text-sm border-collapse my-3">{children}</table>,
                    th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-[var(--text-primary)] border-b border-[var(--border)]">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border-b border-[var(--border)]">{children}</td>,
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Flashcards Tab ── */}
      {tab === 'flashcards' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-dim)]">
              Paste multiple cards using <code className="font-mono text-[#e8c97e]">Q: question</code> /{' '}
              <code className="font-mono text-[#e8c97e]">A: answer</code> format. Separate cards with a blank line. Supports math in answers.
            </p>
            <textarea
              value={cardPaste}
              onChange={e => setCardPaste(e.target.value)}
              rows={7}
              placeholder={`Q: What is a pixel?\nA: The smallest unit of a digital image\n\nQ: What is bit depth $b$?\nA: Number of bits per pixel; gives $L = 2^b$ gray levels`}
              className="w-full text-sm font-mono p-3 rounded-[8px] resize-y outline-none"
              style={elevatedStyle}
            />
            <button
              onClick={parseCards}
              className="px-4 py-2 rounded-[8px] text-sm font-medium"
              style={{ background: accentColor, color: '#fff' }}
            >
              Parse & Add Cards
            </button>
          </div>

          {flashcards.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-[var(--text-dim)] font-medium">
                {flashcards.length} card{flashcards.length !== 1 ? 's' : ''}
              </div>
              {flashcards.map((card, i) => (
                <div key={i} className="p-3 rounded-[8px] space-y-2" style={elevatedStyle}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-[var(--text-dim)]">Card {i + 1}</span>
                    <button onClick={() => deleteCard(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">✕ remove</button>
                  </div>
                  <input
                    value={card.q}
                    onChange={e => updateCard(i, 'q', e.target.value)}
                    placeholder="Question"
                    className="w-full text-sm p-2 rounded-[6px] outline-none"
                    style={inputStyle}
                  />
                  <input
                    value={card.a}
                    onChange={e => updateCard(i, 'a', e.target.value)}
                    placeholder="Answer"
                    className="w-full text-sm p-2 rounded-[6px] outline-none"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              const next = [...flashcards, { q: '', a: '' }];
              setFlashcards(next); onSave({ flashcards: next });
            }}
            className="px-4 py-2 rounded-[8px] text-sm font-medium"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            + Add Card Manually
          </button>
        </div>
      )}

      {/* ── Problems Tab ── */}
      {tab === 'problems' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-dim)]">
              Paste problems using <code className="font-mono text-[#e8c97e]">Q: / A: / Hint: / Type: calculation</code> format.
              Separate problems with a blank line. Supports math anywhere.
            </p>
            <textarea
              value={probPaste}
              onChange={e => setProbPaste(e.target.value)}
              rows={7}
              placeholder={`Q: Calculate the file size of a 640×480 RGB image\nA: $640 \\times 480 \\times 3 = 921{,}600$ bytes\nHint: Multiply width × height × bytes per pixel\nType: calculation\n\nQ: What is entropy in the context of compression?\nA: A measure of the average information content per symbol`}
              className="w-full text-sm font-mono p-3 rounded-[8px] resize-y outline-none"
              style={elevatedStyle}
            />
            <button
              onClick={parseProblems}
              className="px-4 py-2 rounded-[8px] text-sm font-medium"
              style={{ background: accentColor, color: '#fff' }}
            >
              Parse & Add Problems
            </button>
          </div>

          {problems.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs text-[var(--text-dim)] font-medium">
                {problems.length} problem{problems.length !== 1 ? 's' : ''}
              </div>
              {problems.map((prob, i) => (
                <div key={i} className="p-3 rounded-[8px] space-y-2" style={elevatedStyle}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-[var(--text-dim)]">Problem {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={prob.type}
                        onChange={e => updateProb(i, 'type', e.target.value)}
                        className="text-xs rounded-[4px] px-1.5 py-0.5 outline-none"
                        style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        <option value="conceptual">conceptual</option>
                        <option value="calculation">calculation</option>
                      </select>
                      <button onClick={() => deleteProb(i)} className="text-xs text-red-400 hover:text-red-300 transition-colors">✕ remove</button>
                    </div>
                  </div>
                  <input
                    value={prob.q}
                    onChange={e => updateProb(i, 'q', e.target.value)}
                    placeholder="Question"
                    className="w-full text-sm p-2 rounded-[6px] outline-none"
                    style={inputStyle}
                  />
                  <input
                    value={prob.a}
                    onChange={e => updateProb(i, 'a', e.target.value)}
                    placeholder="Answer (supports $math$)"
                    className="w-full text-sm p-2 rounded-[6px] outline-none"
                    style={inputStyle}
                  />
                  <input
                    value={prob.hint ?? ''}
                    onChange={e => updateProb(i, 'hint', e.target.value)}
                    placeholder="Hint (optional)"
                    className="w-full text-sm p-2 rounded-[6px] outline-none"
                    style={{ ...inputStyle, color: 'var(--text-secondary)' }}
                  />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              const next = [...problems, { type: 'conceptual' as ProblemType, q: '', a: '', hint: '' }];
              setProblems(next); onSave({ problems: next });
            }}
            className="px-4 py-2 rounded-[8px] text-sm font-medium"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            + Add Problem Manually
          </button>
        </div>
      )}
    </div>
  );
}
