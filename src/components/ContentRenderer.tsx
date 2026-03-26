'use client';

import React from 'react';
import { ContentBlock } from '@/lib/types';
import { ParsedText } from '@/lib/parseInline';
import { MathRenderer } from './MathRenderer';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { Definition } from './Definition';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  blocks: ContentBlock[];
  accentColor?: string;
}

export function ContentRenderer({ blocks, accentColor = '#5B8AF0' }: ContentRendererProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={i} className="text-[var(--text-secondary)] leading-relaxed">
                <ParsedText text={block.body} />
              </p>
            );

          case 'definition':
            return (
              <Definition
                key={i}
                term={block.term}
                body={block.body}
                accentColor={accentColor}
              />
            );

          case 'math':
            return (
              <MathRenderer
                key={i}
                math={block.expression}
                block
                label={block.label}
              />
            );

          case 'example':
            return (
              <div
                key={i}
                className="my-4 rounded-[12px] overflow-hidden"
                style={{ border: `1px solid ${accentColor}55` }}
              >
                <div
                  className="px-4 py-2 text-sm font-semibold"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                >
                  📌 {block.title}
                </div>
                <div className="px-4 py-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <ParsedText text={block.body} />
                </div>
              </div>
            );

          case 'code':
            return (
              <CodeBlock
                key={i}
                language={block.language}
                body={block.body}
                title={block.title}
              />
            );

          case 'callout':
            return <Callout key={i} style={block.style} body={block.body} />;

          case 'table':
            return (
              <div key={i} className="my-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: `${accentColor}22` }}>
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-3 py-2 text-left font-semibold"
                          style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                        >
                          <ParsedText text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        style={{
                          background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-2 text-[var(--text-secondary)]"
                            style={{ borderBottom: '1px solid var(--border)' }}
                          >
                            <ParsedText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'image':
            return (
              <figure key={i} className="my-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  className="rounded-[8px] max-w-full"
                />
                {block.caption && (
                  <figcaption className="text-xs text-[var(--text-dim)] mt-2 text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'list':
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag
                key={i}
                className={`my-3 pl-5 space-y-1 text-sm text-[var(--text-secondary)] ${block.ordered ? 'list-decimal' : 'list-disc'}`}
              >
                {block.items.map((item, li) => (
                  <li key={li} className="leading-relaxed">
                    <ParsedText text={item} />
                  </li>
                ))}
              </Tag>
            );

          case 'markdown':
            return (
              <div key={i} className="prose-md text-[var(--text-secondary)] leading-relaxed text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h2: ({ children }) => <h2 className="text-base font-semibold text-[var(--text-primary)] mt-5 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-4 mb-1">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="text-[var(--text-primary)] font-semibold">{children}</strong>,
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');
                      return isBlock
                        ? <pre className="my-2 p-3 rounded-lg text-xs font-mono overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: '#e8c97e' }}><code>{children}</code></pre>
                        : <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: '#e8c97e' }}>{children}</code>;
                    },
                    hr: () => <hr className="border-[var(--border)] my-4" />,
                    table: ({ children }) => <table className="w-full text-sm border-collapse my-3">{children}</table>,
                    th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-[var(--text-primary)] border-b border-[var(--border)]">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border-b border-[var(--border)]">{children}</td>,
                  }}
                >
                  {block.body}
                </ReactMarkdown>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
