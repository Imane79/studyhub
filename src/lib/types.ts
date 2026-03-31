export interface Course {
  name: string;
  code: string;
  semester: string;
  instructor: string;
}

export type ContentBlockType =
  | 'text'
  | 'definition'
  | 'math'
  | 'example'
  | 'code'
  | 'callout'
  | 'table'
  | 'image'
  | 'list'
  | 'markdown';

export type CalloutStyle = 'info' | 'warning' | 'tip' | 'exam';

export interface TextBlock {
  type: 'text';
  body: string;
}

export interface DefinitionBlock {
  type: 'definition';
  term: string;
  body: string;
}

export interface MathBlock {
  type: 'math';
  expression: string;
  label?: string;
}

export interface ExampleBlock {
  type: 'example';
  title: string;
  body: string;
}

export interface CodeBlock {
  type: 'code';
  language: string;
  body: string;
  title?: string;
}

export interface CalloutBlock {
  type: 'callout';
  style: CalloutStyle;
  body: string;
}

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface ListBlock {
  type: 'list';
  ordered: boolean;
  items: string[];
}

export interface MarkdownBlock {
  type: 'markdown';
  body: string;
}

export type ContentBlock =
  | TextBlock
  | DefinitionBlock
  | MathBlock
  | ExampleBlock
  | CodeBlock
  | CalloutBlock
  | TableBlock
  | ImageBlock
  | ListBlock
  | MarkdownBlock;

export interface Flashcard {
  q: string;
  a: string;
}

export type ProblemType = 'calculation' | 'conceptual';

export interface Problem {
  type: ProblemType;
  q: string;
  a: string;
  hint?: string;
}

export interface Section {
  id: string;
  number: string;
  title: string;
  content: ContentBlock[];
  flashcards: Flashcard[];
  problems: Problem[];
}

export interface Lecture {
  id: string;
  number: number;
  title: string;
  chapter: string;
  color: string;
  icon: string;
  courseId: string;
  sections: Section[];
}

export interface CourseContent {
  course: Course;
  lectures: Lecture[];
}
