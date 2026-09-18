// ROADMAP: Section 5 & 10 — Pulse AI Conversational Terminal Page
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAIChat } from '../hooks/useAI';
import { Sparkles, Send, Bot, User, ShieldAlert, CornerDownLeft, RefreshCw, Zap } from 'lucide-react';
import ErrorBoundary from '../components/common/ErrorBoundary';

const SUGGESTIONS = [
  'How is NIFTY 50 performing today?',
  'Analyze Reliance Industries price action',
  'What drove IT sector stocks higher?',
  'Explain Tata Motors technical positioning',
  'What is INDIA VIX telling us about volatility?',
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
      content: `### Welcome to **Pulse AI** ⚡

I am your real-time institutional equity co-pilot for the Indian stock market (NSE & BSE).

Every answer I provide is grounded in verified, live market data:
- Real-time **LTP, Day Range & 52-Week Bands** from Upstox
- **Market Breadth & Sector Trends** across Indian indices
- Verified **Financial News & Corporate Disclosures**

What would you like to analyze today?`,
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
            content: data.reply || 'Analysis complete.',
            timestamp: data.timestamp || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        },
        onError: () => {
          const errorMsg = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: 'Unable to connect to intelligence server. Please verify your connection or try again.',
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          backgroundColor: '#090910',
          position: 'relative',
        }}
      >
        {/* Top Intelligence Header */}
        <div
          style={{
            padding: '16px 28px',
            borderBottom: '1px solid #1e1e30',
            backgroundColor: '#0d0d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sparkles size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                  Pulse AI Market Assistant
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#1b1b30',
                    color: '#818cf8',
                    border: '1px solid #282845',
                  }}
                >
                  LIVE DATA GROUNDED
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#717192', marginTop: '1px' }}>
                Powered by Gemini 1.5 Flash • Connected to live Upstox NSE/BSE feeds
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#141422',
                border: '1px solid #232338',
                color: '#8b8ba8',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={12} />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 24px',
            maxWidth: '960px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '75%' : '88%',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={16} />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: isUser ? '#1e1e35' : '#0e0e18',
                    border: `1px solid ${isUser ? '#373760' : '#1e1e32'}`,
                    padding: '16px 20px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    color: '#e5e5f0',
                    fontSize: '13.5px',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.content}
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#27273f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a0a0c8',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {chatMutation.isPending && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '16px',
                  backgroundColor: '#0e0e18',
                  border: '1px solid #1e1e32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#818cf8',
                  fontSize: '13px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366f1', animation: 'pulse 1s infinite' }} />
                <span>Pulse AI is analyzing live quotes & news...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div
            style={{
              padding: '8px 24px',
              maxWidth: '960px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#12121e',
                  border: '1px solid #232338',
                  color: '#a5a5c5',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#232338';
                  e.currentTarget.style.color = '#a5a5c5';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Container */}
        <div
          style={{
            padding: '16px 24px 20px',
            backgroundColor: '#0a0a12',
            borderTop: '1px solid #1c1c2e',
          }}
        >
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#12121e',
                borderRadius: '12px',
                border: '1px solid #282842',
                padding: '4px 8px 4px 16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about any Indian stock, index, sector or trading concept..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={chatMutation.isPending}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f0f0fa',
                  fontSize: '14px',
                  padding: '10px 0',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || chatMutation.isPending}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: input.trim() ? '#6366f1' : '#1c1c2e',
                  color: input.trim() ? '#ffffff' : '#555570',
                  fontWeight: 600,
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#555570',
              }}
            >
              <ShieldAlert size={12} />
              <span>
                Pulse AI provides informational analytics only. Not investment or SEBI-registered advisory.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
