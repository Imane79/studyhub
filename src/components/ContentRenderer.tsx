'use client';

import React from 'react';
import { ContentBlock } from '@/lib/types';
import { ParsedText } from '@/lib/parseInline';
import { MathRenderer } from './MathRenderer';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { Definition } from './Definition';

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

          default:
            return null;
        }
      })}
    </div>
  );
}
