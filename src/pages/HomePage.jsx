import { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage, getHistory, clearHistory as apiClearHistory, uploadFile } from '../api/chat';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getHistory()
      .then(msgs => setMessages(msgs.map(m => ({ role: m.role, content: m.content, attachments: m.attachments || [], ts: m.ts }))))
      .catch(() => setMessages([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const clearChat = useCallback(async () => {
    try {
      await apiClearHistory();
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history', err);
    }
  }, []);

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      try {
        const meta = await uploadFile(file);
        setAttachments(prev => [...prev, meta]);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && attachments.length === 0) || isLoading) return;

    const userMsg = {
      role: 'user',
      content: text,
      attachments: [...attachments],
      ts: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    const assistantMsg = { role: 'assistant', content: '', ts: Date.now() };
    setMessages(prev => [...prev, assistantMsg]);

    // Build message text that includes file references for the AI
    let messageForAI = text;
    if (attachments.length > 0) {
      const fileRefs = attachments.map(a => `[${a.originalName}](${a.url})`).join(', ');
      messageForAI = text ? `${text}\n\n(Attached: ${fileRefs})` : `(Attached: ${fileRefs})`;
    }

    try {
      await sendMessage(messageForAI, messages, (chunk) => {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      });
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], content: `Error: ${err.message}` };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isImage = (mimetype) => mimetype?.startsWith('image/');

  if (loadingHistory) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading conversation…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '40px 60px', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {dragOver && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(20,20,20,0.85)', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--text-muted)', margin: 20,
          }}>
            <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>Drop files to attach</span>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="hero-section" style={{ padding: 0, minHeight: 'auto', marginBottom: 40 }}>
            <h1 className="hero-title">Hi there, what can I help with?</h1>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--bg-card)' : 'transparent',
                border: m.role === 'user' ? '1px solid var(--border-input)' : 'none',
                borderRadius: 'var(--radius-md)',
                padding: m.role === 'user' ? '12px 16px' : '0',
                maxWidth: '80%',
                color: 'var(--text-primary)',
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {m.attachments?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: m.content ? 8 : 0 }}>
                    {m.attachments.map(att => (
                      <div key={att.id} style={{
                        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden', maxWidth: 200,
                      }}>
                        {isImage(att.mimetype) ? (
                          <img src={att.url} alt={att.originalName} style={{ maxWidth: '100%', display: 'block' }} />
                        ) : (
                          <a href={att.url} target="_blank" rel="noreferrer" style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                            color: 'var(--text-primary)', textDecoration: 'none', fontSize: 12,
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                              <polyline points="13 2 13 9 20 9" />
                            </svg>
                            {att.originalName}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {m.role === 'assistant' ? (
                  <MarkdownRenderer content={m.content} />
                ) : (
                  m.content
                )}
                {isLoading && i === messages.length - 1 && !m.content ? (
                  <span style={{ color: 'var(--text-muted)' }}>Thinking…</span>
                ) : null}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="input-section">
        <div className="input-bar">
          {attachments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px 0' }}>
              {attachments.map(att => (
                <span key={att.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--bg-page)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: 12,
                }}>
                  {att.originalName}
                  <button onClick={() => removeAttachment(att.id)} style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 1,
                  }}>×</button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything, create anything"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <div className="input-toolbar">
            <div className="toolbar-left">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
                multiple
              />
              <button className="btn-icon" aria-label="Add attachment" onClick={() => fileInputRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button className="btn-pill btn-pill-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
                Ultra
              </button>
              {messages.length > 0 && (
                <button className="btn-pill btn-pill-outline" onClick={clearChat} title="Clear history">
                  Clear
                </button>
              )}
            </div>
            <div className="toolbar-right">
              <button className="btn-icon btn-icon-ghost" aria-label="Voice input">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <button className="btn-pill btn-pill-dark" onClick={handleSend} disabled={isLoading || (!input.trim() && attachments.length === 0)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v8" /><path d="M18 5v13" /><path d="M22 10v3" />
                </svg>
                {isLoading ? '…' : 'Speak'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
