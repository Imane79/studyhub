import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Strip background/backgroundColor from every token style so no token
// gets a highlight box — only the container background remains.
export const codeTheme: Record<string, React.CSSProperties> = Object.fromEntries(
  Object.entries(oneDark).map(([selector, styles]) => {
    const { background: _bg, backgroundColor: _bgc, ...rest } = styles as React.CSSProperties & { background?: string; backgroundColor?: string };
    return [selector, rest];
  })
);
