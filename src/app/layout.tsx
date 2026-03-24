import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyHub — CS301 Multimedia Processing',
  description:
    'Interactive study app for Introduction to Multimedia Processing. Flashcards, practice problems, and rich content with LaTeX math.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
