// ROADMAP: Section 5 — Empty State & Error Boundary
import React from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

export function EmptyState({ title = 'No data available', message = 'Check back during market hours or adjust your filters', actionText, onAction }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#a0a0b8',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#1a1a28',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#606078',
        }}
      >
        <Inbox size={22} />
      </div>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f5' }}>{title}</h4>
      <p style={{ fontSize: '13px', maxWidth: '360px', lineHeight: 1.5 }}>{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#3366ff',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '32px 24px',
            margin: '20px 0',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 23, 68, 0.08)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            color: '#f0f0f5',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle size={28} color="#ff1744" />
          <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Something went wrong</h4>
          <p style={{ fontSize: '13px', color: '#a0a0b8', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#1e1e30',
              border: '1px solid #2a2a44',
              color: '#f0f0f5',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
