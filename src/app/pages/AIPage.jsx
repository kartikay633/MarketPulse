// ROADMAP: Section 5 & 10 — Pulse AI Conversational Terminal Page
// Institutional Research Desk — Exact Market Pulse Design System
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAIChat } from '../hooks/useAI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, User, RefreshCw, Cpu, ShieldCheck, Terminal } from 'lucide-react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import '../styles/markdown.css';

const SUGGESTIONS = [
  'NIFTY 50 market breadth & regime today',
  'Reliance Industries technical & price action breakdown',
  'What is driving banking sector momentum?',
  'INDIA VIX volatility signals for Indian equities',
  'Tata Motors multi-timeframe analysis',
];

export default function AIPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [input, setInput] = useState('');
  const [conversationId] = useState(() => `conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Market Pulse Institutional Intelligence Desk

Connected to live NSE / BSE market telemetry and Gemini 1.5 Flash synthesis engine.

**Capabilities:**
- **Market Telemetry:** Real-time LTP, Day Ranges, 52-Week Bands, and Sector Breadth
- **Driver Analysis:** Cross-referencing price action with recent corporate news and macroeconomic catalysts
- **Risk Context:** Assessing volatility regimes (INDIA VIX) and sector concentration risks

Enter an Indian equity ticker, index, or macroeconomic inquiry below to begin terminal analysis.`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatMutation = useAIChat();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  // Handle pre-filled query param (?q=...)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleSend = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || chatMutation.isPending) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    chatMutation.mutate(
      { message: text, conversationId },
      {
        onSuccess: (data) => {
          const assistantMsg = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.reply || 'Analysis completed.',
            timestamp: data.timestamp || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        },
        onError: () => {
          const errorMsg = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: 'Unable to communicate with the intelligence server. Verify API configuration and network connectivity.',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', backgroundColor: 'var(--background)', position: 'relative' }}>
        {/* Top Intelligence Header */}
        <div className="ai-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/pulse_ai_core.jpg"
              alt="Pulse AI Core"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(59, 130, 246, 0.6)',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.5)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pulse AI Quantitative Desk
                </span>
                <span className="badge badge--accent badge--sm">
                  QUANTUM FINTECH CORE
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
                Gemini 1.5 Flash • Connected to live Upstox NSE / BSE telemetry
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            onClick={() => setMessages([messages[0]])}
          >
            <RefreshCw size={12} />
            <span>Clear Terminal</span>
          </button>
        </div>

        {/* Research Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className="animate-slide-up"
                style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: isUser ? '75%' : '90%' }}
              >
                {!isUser && (
                  <img
                    src="/pulse_ai_core.jpg"
                    alt="AI"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  />
                )}

                <div className={`ai-message-bubble ${isUser ? 'ai-message-bubble--user' : 'ai-message-bubble--assistant'}`}>
                  {isUser ? (
                    m.content
                  ) : (
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="ai-avatar" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Processing indicator */}
          {chatMutation.isPending && (
            <div className="ai-processing animate-fade-in">
              <div className="ai-avatar">
                <Cpu size={14} />
              </div>
              <div style={{ padding: '10px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: 'var(--text-sm)' }}>
                <span className="ai-processing-dot" />
                <span>Synthesizing live Indian market data & news catalysts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{ padding: '4px 24px 8px', maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="ai-suggestion-chip"
              onClick={() => handleSend(s)}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="ai-input-bar">
          <div className="ai-input-wrapper">
            <Terminal size={15} color="var(--text-muted)" />
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query ticker (e.g. RELIANCE), index regime, or macroeconomic policy..."
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || chatMutation.isPending}
              className={`btn ai-send-btn ${input.trim() && !chatMutation.isPending ? 'ai-send-btn--active' : 'ai-send-btn--disabled'}`}
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </div>
          <div style={{ maxWidth: '1000px', margin: '6px auto 0', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} />
              AI syntheses are informational and do not constitute registered investment advice.
            </span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
