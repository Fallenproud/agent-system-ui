import { marked } from 'marked';
import { useMemo } from 'react';

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const language = lang || '';
  return `<pre class="code-block"><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
};

renderer.codespan = ({ text }) => {
  return `<code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:12px;color:var(--text-primary);">${escapeHtml(text)}</code>`;
};

renderer.link = ({ href, text }) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:var(--text-primary);text-decoration:underline;">${text}</a>`;
};

renderer.blockquote = ({ text }) => {
  return `<blockquote style="border-left:3px solid var(--border-input);padding-left:12px;margin:8px 0;color:var(--text-secondary);">${text}</blockquote>`;
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function MarkdownRenderer({ content }) {
  const html = useMemo(() => {
    if (!content) return '';
    return marked.parse(content, { renderer });
  }, [content]);

  if (!content) return null;

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
